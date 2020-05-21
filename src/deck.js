import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Cards from './cards';
import get from 'lodash.get';
import firebase, { firestore } from './firebase'

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
        image: null
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
  // Here's where firestore will need to update the deck state every time a card is played
  const [deckState, setDeckState] = useState(shuffle(deckArray))
  const [discardPile, setDiscardPile] = useState([])

  const handleClick = (card) => {
    //do websocket stuff
    firestore.collection(`/games/${gameId}/game`).add({
      deckState: deckState.map(eachCard => eachCard === card ? { ...eachCard, inPlay: false } : eachCard),
      card,
      discardPile: [...discardPile, { ...card, rotate: Math.random() * 360 }]
    })
      .then(doc => {
        console.log('UPDATE TIME STAMP', doc.id)
        doc.update({
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    // setup for later
    let unsub
    function syncGame() {
      try {
        // returned function is for unsubbing
        unsub = firestore.collection(`/games/${gameId}/game`).orderBy('timestamp').limit(1).onSnapshot(snapshot => {
          const currentState = snapshot.docs.map(doc => doc.data())
          console.log('CURRENT STATE', currentState[0])
          if (currentState[0]) {
            const { card, deckState, discardPile } = currentState[0]
            setDeckState([...deckState])
            updateStatus(card)
            console.log('DECKSTATE', deckState)
            console.log('UPDATESTATUS', card)
            if (discardPile) {
              console.log('DISCARD', discardPile)
              setDiscardPile([...discardPile])
            }
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
    syncGame()
    // need this to unsub when component unmounts
    return () => unsub()
  }, [])

  return (
    <DeckContainer>
      {discardPile.map((card, i) => <Card key={JSON.stringify(card)} src={get(Cards, `${card.suit}${card.card}`)} index={i} rotate={card.rotate} />)}
      {deckState.map((card, i) =>
        <CircleCard
          key={JSON.stringify(card)}
          // src={Cards.CardBack} 
          index={i}
          inPlay={card.inPlay}
          onClick={() => handleClick(card)} />)}
    </DeckContainer>
  )
}