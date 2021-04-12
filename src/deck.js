import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Cards from './cards';
import get from 'lodash.get';
import { firestore } from './firebase'

const DeckContainer = styled.div(({ smallest}) => css`
  margin: auto;
  padding-top: 1rem;
  padding-bottom: 1rem;
  height: calc(${smallest}px - 2rem);
  width: calc(${smallest}px - 2rem);
`)

export const Card = styled.img(({ index, rotate, smallest}) => {
    const cardHeight = smallest * .3
    const cardWidth = smallest * .2

    const horizontalOffset = (smallest / 2) - (cardWidth / 2)
    const verticalOffset = (smallest / 2) - (cardHeight / 2)

  return css`
  background: red;
  position: absolute;
  margin:0;
  padding:0;
  z-index: ${index || 0};
  transform: translate(${horizontalOffset}px, ${verticalOffset}px) rotate(${rotate}deg);
  overflow:hidden;
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  border-radius: .5rem;
  box-shadow: 0 0 .25rem black;
`})

const CircleCard = styled(Card)(({ index, inPlay, smallest }) => {
  const cardWidth = smallest * .2

  const horizontalOffset = (smallest / 2) - (cardWidth / 2)

  return css`
  ${inPlay ? null : 'display: none;'}

  transform: translate(${smallest * .1}px, ${smallest * .35}px) rotate(${index * 7}deg);
  transform-origin: ${horizontalOffset}px center;
  cursor: pointer;

  &:hover {
      box-shadow: 0 0 .5rem black;
  }
`})

export default ({ gameId, gameContainerRef, setGameOver, updateStatus }) => {
  const localGame = gameId === 'local'
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

    if (localGame) {
      const newDeckState = deckState.map(c => c.card === card.card && c.suit === card.suit ? ({ ...c, inPlay: false, index: discardPile.length}) : c)
      localStorage.setItem('deckState', JSON.stringify(newDeckState))
      setDeckState(newDeckState)
      updateStatus(card)
    } else {
      await firestore.collection(`/games/${gameId}/deck`)
      .where('card', '==', card.card)
      .where('suit', '==', card.suit)
      .get()
      .then(snapshot => snapshot.forEach(doc => firestore.collection(`/games/${gameId}/deck`).doc(doc.id).update({inPlay: false, index: discardPile.length })))
      .catch(err => console.log(err))
    updateStatus(card)
    }

  }

  useEffect(() => {
    if (localGame) {
      const possibleDeckState = localStorage.getItem('deckState')
      if (possibleDeckState) {
        setDeckState(JSON.parse(possibleDeckState))
      }
    } else {
      let unsub
      function syncGame() {
        try {
          unsub = firestore.collection(`/games/${gameId}/deck`).onSnapshot(snapshot => {
            const deckState = snapshot.docs.map(doc => doc.data())
              setDeckState(deckState)
          })
        } catch (err) {
          console.log(err)
        }
      }
      syncGame()
      // need this to unsub when component unmounts
      return () => unsub()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [gameId, localGame])

  const [ smallest, setSmallest] = useState(null)
  let refWidth
  let refHeight
  let newSmallest
  if (gameContainerRef.current) {
    refHeight = gameContainerRef.current.getBoundingClientRect().height
    refWidth = gameContainerRef.current.getBoundingClientRect().width
    newSmallest = Math.min.apply( Math, [refHeight, refWidth] )
    if (newSmallest !== smallest) {
      setSmallest(newSmallest)
    }
  }
  
  const gameOver = discardPile.length === 52
  if (gameOver) {
    setGameOver(true)
  }

  return (
    <DeckContainer smallest={smallest}>
      {discardPile.map((card, i) => <Card smallest={smallest} key={JSON.stringify(card)} src={get(Cards, `${card.suit}${card.card}`)} index={card.index} rotate={card.rotate} />)}
      {deckState.map((card, i) =>
        <CircleCard
          key={JSON.stringify(card)}
          smallest={smallest}
          src={Cards.CardBack} 
          index={i}
          inPlay={card.inPlay}
          onClick={() => handleClick(card)} />)}
    </DeckContainer>
  )
}