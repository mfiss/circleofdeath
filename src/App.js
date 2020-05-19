import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Status from './status'
import Players from './players'
import Paper from './paper';
import Rules from './rules';
import Deck from './deck'
import NewGame from './newGame'
import globalStyles from './globalStyles'

 
// Uncomment once this stuff is live

// export const ws = new WebSocket('websocket url')

// this.ws.onopen = () => {
//   // on connecting, do nothing but log it to the console
//   console.log('connected')
//   }

//   this.ws.onmessage = evt => {
//   // listen to data sent from the websocket server
//   const message = JSON.parse(evt.data)
//   this.setState({dataFromServer: message})
//   console.log(message)
//   }

// this.ws.onclose = () => {
//   console.log('disconnected')
//   // automatically try to reconnect on connection loss
//   }

export const Table = styled.div`
  margin: auto;
  max-width: 1800px;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
`

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media only screen and (min-width : ${({theme}) => theme.largeBreakpoint}px) {
    width: 50%;
  }
`

const GameStatusSection = styled.div`
  margin: 1rem 1rem 0 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: white;
  font-family: 'Caveat', cursive;
  text-align: center;
  justify-content: space-around;
  text-align: center;
  display:flex;
  flex-direction: column;

  h1 {
    margin: 0;
  }
`;

const GameInfoContainer = styled.div`
  flex: 1 1 50%;
  position: relative;
  font-family: 'Caveat', cursive;

`

const fakePlayers = [
  { name: 'Matt', current: true, thumbMaster: false, questionMaster: false },
  { name: 'Bill', current: false, thumbMaster: false, questionMaster: false },
  { name: 'Chris', current: false, thumbMaster: false, questionMaster: false },
  { name: 'Dan', current: false, thumbMaster: false, questionMaster: false },
]

export const Game = () => {
  const path = window.location.pathname
  const gameRoute = path !== '/' && path  
  // Only start a new game if there is not a game route in the URL
  const [newGame, setNewGame ] = useState(!gameRoute)

  const [status, setStatus] = useState(['Start picking cards!'])
  const [playerState, setPlayerState] = useState(fakePlayers)

  const currentPlayer = playerState.find(p => p.current)
  const { name } = currentPlayer
  const currentPlayerIndex = playerState.map(p => p.current).indexOf(true)  
  
  const changePlayer = (card) => setPlayerState(playerState.map((player,index) => {
    const thumbMaster = card.card === 'Jack'
    const questionMaster = card.card === 'Queen'
    const isCurrentPlayer = index === currentPlayerIndex
    const newPlayerState = player

    // Player at the next index goes next, or if we're at the end of the array, it's the player at index 0
    newPlayerState.current = (index === currentPlayerIndex + 1) || (currentPlayerIndex === (playerState.length - 1) && !index)

    if (thumbMaster) {
      newPlayerState.thumbMaster = isCurrentPlayer
    }

    if (questionMaster) {
      newPlayerState.questionMaster = isCurrentPlayer
    }

    return newPlayerState
  }))

  const updateStatus = (card) => {
    changePlayer(card)

    const statusResponse = statusResponseTemplate.find(status => {
      if (status.color && card.color !== status.color) {
        return false
      }
      return card.card === status.card
    }) || { text: 'Status not found!'}

    setStatus([`${card.card} of ${card.suit}: ${statusResponse.text}`])
  }
  
  const statusResponseTemplate = [
    { card: 'Ace', text: 'WATERFALL!' },
    { card: 'King', text: 'Make a rule.' },
    { card: 'Queen', text: `${name} is now the Question Master!` },
    { card: 'Jack', text: `${name} is now the Thumb Master!`},
    { card: '10', text: 'Category!' },
    { card: '9', text: 'Rhyme!' },
    { card: '8', color: 'red', text: `${name} drink!` },
    { card: '8', color: 'black', text: `${name} give out drinks!` },
    { card: '7', color: 'red', text: `${name} drink!` },
    { card: '7', color: 'black', text: `${name} give out drinks!` },
    { card: '6', color: 'red', text: `${name} drink!` },
    { card: '6', color: 'black', text: `${name} give out drinks!` },
    { card: '5', text: `${name} drink 5!` },
    { card: '4', text: `${name} drink 4!` },
    { card: '3', text: `${name} drink 3!` },
    { card: '2', text: `${name} drink 2!` },
  ]

  const startGame = () => { 
    setNewGame(false)
  }

  if (newGame) {
    return  <NewGame startGame={startGame} />
  } else {
    return (
        <Table>
          <Column>
            <Deck updateStatus={updateStatus} />
            <GameStatusSection>
              <Players players={playerState} />
              <Status status={status} />
            </GameStatusSection>
          </Column>
          <GameInfoContainer>
            <Paper>
              <Rules />
            </Paper>
          </GameInfoContainer>
        </Table>
    )
  }
}

export const GameContainer = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow:hidden;
`

export default () => (
  <ThemeProvider theme={globalStyles}>
    <GameContainer>
      <Game />  
    </GameContainer>
  </ThemeProvider>
)
