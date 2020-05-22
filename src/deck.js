import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Cards from './cards';
import get from 'lodash.get';
import { firestore } from './firebase'

const DeckContainer = styled.div`
  margin: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 95vmin;
  width: 90vmin;

  ${({ theme }) => `@media only screen and (min-width: ${theme.mediumBreakpoint}px) {
  height: ${theme.mediumBreakpoint}px;
  width: ${theme.mediumBreakpoint}px;
  }
`}`

export const Card = styled.img`
  background: red;
  position:absolute;
  margin:0;
  padding:0;
  z-index: ${({ index }) => index || 0};
  transform: translate(34vmin, 30vmin) rotate(${({ rotate }) => rotate}deg);
  overflow:hidden;
  width: 22.5vmin;
  height: 35vmin;
  border-radius: .5rem;
  box-shadow: 0 0 .25rem black;

  ${({ theme, rotate }) => `@media only screen and (min-width : ${theme.mediumBreakpoint}px) {
    transform: translate(${theme.mediumBreakpoint / 2.65}px, ${theme.mediumBreakpoint / 3.25}px) rotate(${rotate}deg);
    width: ${theme.mediumBreakpoint / 4.5}px;
    height: ${theme.mediumBreakpoint / 3}px;
  }
`}`

const CircleCard = styled(Card)`
  ${({ inPlay }) => inPlay ? null : 'display: none;'}

  transform: translate(0, 30vmin) rotate(${({ index }) => index * 7}deg);
  transform-origin: 45vmin center;
  cursor: pointer;

  &:hover {
      box-shadow: 0 0 .5rem black;
  }

  ${({ theme, index }) => `@media only screen and (min-width : ${theme.mediumBreakpoint}px) {
    transform-origin: ${theme.mediumBreakpoint / 2.25}px center;
    transform: translate(${theme.mediumBreakpoint / 20}px, ${theme.mediumBreakpoint / 3.3}px) rotate(${index * 7}deg);
  }
`}`

export default ({ gameId, updateStatus }) => {

  const suits = ["Hearts", "Spades", "Clubs", "Diamonds"]
  const cards = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"]

  const deckArray = []
  suits.forEach(suit => {
    cards.forEach(card => {
      deckArray.push({
        card,
        color: (suit === "Hearts" || suit === "Diamonds") ? 'red' : 'black',
        inPlay: true,
        suit,
        image: null,
        rotate: parseInt(Math.random() * 360)
      })
    })
  })

  const shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  const [deckState, setDeckState] = useState(shuffle(deckArray))
  const discardPile = deckState && deckState.filter(card => !card.inPlay)

  const handleClick = async (card) => {
     const updateDeck = firestore.collection(`/games/${gameId}/deck`)
      .where('card', '==', card.card)
      .where('suit', '==', card.suit)
      .get()
      .then(snapshot => snapshot.forEach(doc => firestore.collection(`/games/${gameId}/deck`).doc(doc.id).update({inPlay: false, index: discardPile.length })))
      .catch(err => console.log(err))

    const updateCurrentStatus = firestore.collection(`/games/${gameId}/currentStatus`).doc('currentStatus').set({...card})
      await Promise.all([updateDeck, updateCurrentStatus])
  }

  useEffect(() => {
    let unsub
    function syncGame() {
      try {
        // returned function is for unsubbing
        unsub = firestore.collection(`/games/${gameId}/deck`).onSnapshot(snapshot => {
          const deckState = snapshot.docs.map(doc => doc.data())
          if (deckState) {
            setDeckState(deckState)
          }
        })
        firestore.collection(`/games/${gameId}/currentStatus`).onSnapshot(snapshot => {
          const currentStatus = snapshot.docs.map(doc => doc.data())[0]
          if (currentStatus) {
            updateStatus(currentStatus)
            console.log('CURRENT STATUS', currentStatus, 'snapshot docs', snapshot.docs.map(doc => doc.data()))
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
    syncGame()
    // need this to unsub when component unmounts
    return () => unsub()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DeckContainer>
      {discardPile.map((card, i) => <Card key={JSON.stringify(card)} src={get(Cards, `${card.suit}${card.card}`)} index={card.index} rotate={card.rotate} />)}
      {deckState.map((card, i) =>
        <CircleCard
          key={JSON.stringify(card)}
          src={Cards.CardBack} 
          index={i}
          inPlay={card.inPlay}
          onClick={() => handleClick(card)} />)}
    </DeckContainer>
  )
}