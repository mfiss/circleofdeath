import React, {useState, useEffect} from 'react'
import styled, {ThemeProvider} from 'styled-components'
import Status from './status'
import Players from './players'
import Paper from './paper'
import Rules from './rules'
import Deck from './deck'
import NewGame from './newGame'
import globalStyles from './globalStyles'
import {firestore} from './firebase'

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
  max-height: 90vh;

  @media only screen and (min-width: ${({theme}) => theme.largeBreakpoint}px) {
    max-height: 100%;
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
  display: flex;
  flex-direction: column;

  h1 {
    margin: 0;
  }
`

const GameInfoContainer = styled.div`
  flex: 1 1 50%;
  font-family: 'Caveat', cursive;
  z-index: 420;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;

  ${({expanded}) =>
    expanded
      ? `
  top: 0;
  `
      : `
  top: 85vh;
  `}

  ${({
    theme,
  }) => `@media only screen and (min-width : ${theme.largeBreakpoint}px) {
    position: relative;
    top: 0;
  }`}
`

export const Game = () => {
  const path = window.location.pathname
  const gameRoute = path !== '/' && path.slice(1)
  const [sessionPlayerName, setSessionPlayerName] = useState(null)
  const [newGame, setNewGame] = useState(!sessionPlayerName)
  const [status, setStatus] = useState('Start picking cards!')
  const [rulesExpanded, setExpanded] = useState(false)
  const [playerState, setPlayerState] = useState([])
  const currentPlayer = playerState.find((p) => p.current)
  const {name} = currentPlayer || {}
  const playerId = localStorage.getItem('playerId')
  const playersRef = firestore.collection(`/games/${gameRoute}/players`)
  const currentSessionPlayer = playerId && playersRef.doc(playerId)
  const turnOrder = playerState.filter((player) => player.active)
  const currentPlayerIndex = turnOrder.indexOf(currentPlayer)
  const nextPlayerIndex =
    currentPlayerIndex === turnOrder.length - 1 ? 0 : currentPlayerIndex + 1
  const nextPlayerName = turnOrder[nextPlayerIndex]?.name
  const localGame = gameRoute === 'local'

  const changePlayer = (status) => {
    const cardStr = status.card || ''

    // TODO: Implement Thumb Master and Question Master
    // const thumbMaster = cardStr === 'Jack'
    // const questionMaster = cardStr === 'Queen'

    // if (thumbMaster) {
    //   playersRef
    //     .where('thumbMaster', '==', true)
    //     .get()
    //     .then((snap) =>
    //       snap.forEach((doc) =>
    //         playersRef.doc(doc.id).update({thumbMaster: false})
    //       )
    //     )
    //     .catch((err) => console.log(err))
    // }

    // if (questionMaster) {
    //   playersRef
    //     .where('questionMaster', '==', true)
    //     .get()
    //     .then((snap) =>
    //       snap.forEach((doc) =>
    //         playersRef.doc(doc.id).update({questionMaster: false})
    //       )
    //     )
    //     .catch((err) => console.log(err))
    // }

    if (localGame) {
      const newPlayerState = playerState.map((player,i) => {
        if (i === currentPlayerIndex) {
          return ({ ...player, current: false })
        }
        if (i === nextPlayerIndex) {
          return ({ ...player, current: true })
        }
        return player
      })

      setPlayerState(newPlayerState)
    } else {
      playersRef
      .get()
      .then((snap) =>
        snap.forEach((doc) => {
          return playersRef.doc(doc.id).update({
            current: false,
            // thumbMaster: thumbMaster,
            // questionMaster: questionMaster,
          })
        })
      )
      .catch((err) => console.log(err))

    playersRef
      .where('name', '==', nextPlayerName)
      .get()
      .then((snap) =>
        snap.forEach((doc) => playersRef.doc(doc.id).update({current: true}))
      )
      .catch((err) => console.log(err))
    }
  }

  if (!localGame) {
    const handleUnload = (e) => {
      e.preventDefault()
  
      currentSessionPlayer
        .get()
        .then((doc) => {
          if (doc.exists && doc.data().current) {
            // It's the leaving player's turn, so make the next person the current player
            changePlayer()
          }
        })
        .catch((err) => console.log(err))
      playersRef
        .doc(playerId)
        .update({active: false})
        .catch((err) => console.log(err))
    }
  
    // Make people that leave the game inactive
    window.addEventListener('beforeunload', (e) => handleUnload(e))
  }
  

  const updateStatus = (status) => {
    changePlayer(status)

    const statusResponse = statusResponseTemplate.find((match) => {
      if (match.color && status.color !== match.color) {
        return false
      }
      return status.card === match.card
    }) || {text: 'Status not found!'}

    if (!status.card && !status.thumbMaster) {
      setStatus('Start picking cards!')
    } else if (status.thumbMaster) {
      setStatus(`${status.thumbMaster} put their thumb down last. Drink!`)
    } else {
      setStatus(`${status.card} of ${status.suit}: ${statusResponse.text}`)
    }
  }

  const statusResponseTemplate = [
    {card: 'Ace', text: 'WATERFALL!'},
    {card: 'King', text: 'Make a rule.'},
    {card: 'Queen', text: `${name} is now the Question Master!`},
    {card: 'Jack', text: `${name} is now the Thumb Master!`},
    {card: '10', text: 'Category!'},
    {card: '9', text: 'Rhyme!'},
    {card: '8', color: 'red', text: `${name} drink!`},
    {card: '8', color: 'black', text: `${name} give out drinks!`},
    {card: '7', color: 'red', text: `${name} drink!`},
    {card: '7', color: 'black', text: `${name} give out drinks!`},
    {card: '6', color: 'red', text: `${name} drink!`},
    {card: '6', color: 'black', text: `${name} give out drinks!`},
    {card: '5', text: `${name} drink 5!`},
    {card: '4', text: `${name} drink 4!`},
    {card: '3', text: `${name} drink 3!`},
    {card: '2', text: `${name} drink 2!`},
  ]

  const startGame = (gameRoute, localPlayers) => {
    window.history.pushState('', '', gameRoute)
    console.log('localGame', localGame, 'gameRoute', gameRoute, 'localPlayers', localPlayers)
    if (localPlayers) {
      const mappedPlayers = localPlayers.map((player,i) => ({ name: localPlayers[i], active: true, current: i === 0 }))
      
      setPlayerState(mappedPlayers)
      console.log('playerState', playerState, 'mappedPlayers', mappedPlayers)
    }
    
    setNewGame(false)
  }

  useEffect(() => {
    // set this for unsubscribing on component unmount
    if (!localGame){
      let unsub
      function getPlayers() {
        try {
          // mount the listener
          unsub = firestore
            .collection(`/games/${gameRoute}/players`)
            .onSnapshot((snapshot) => {
              let currentPlayers = []
              snapshot.forEach((doc) => {
                currentPlayers.push(doc.data())
              })
              setPlayerState(currentPlayers)
            })
        } catch (err) {
          console.log(err)
        }
      }
      getPlayers()
      // unmount unsub
      return () => unsub()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [gameRoute, localGame])

  if (newGame) {
    return (
      <NewGame
        startGame={startGame}
        gameRoute={gameRoute}
        setSessionPlayerName={setSessionPlayerName}
        turnOrder={turnOrder}
      />
    )
  } else {
    return (
      <Table>
        <Column>
          <Deck gameId={gameRoute} updateStatus={updateStatus} />
          <GameStatusSection>
            <Players players={playerState} />
            <Status status={status} />
          </GameStatusSection>
        </Column>
        <GameInfoContainer
          onClick={() => setExpanded(!rulesExpanded)}
          expanded={rulesExpanded}
        >
          <Paper>
            <Rules rulesExpanded={rulesExpanded} />
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
`

export default () => (
  <ThemeProvider theme={globalStyles}>
    <GameContainer>
      <Game />
    </GameContainer>
  </ThemeProvider>
)
