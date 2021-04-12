import React, { useEffect, useRef, useState} from 'react'
import { ThemeProvider } from 'styled-components'
import Players from './players'
import Rules from './rules'
import Deck from './deck'
import NewGame from './newGame'
import globalStyles from './globalStyles'
import { firestore } from './firebase'
import Nav from './nav'
import {
  Table,
  GameStatusSection,
  GameplaySection,
  Overlay,
  StyledButton,
  Wrapper
} from './styled'

export const Game = () => {
  const path = window.location.pathname
  let gameRoute = path !== '/' && path.slice(1)
  // The intention was to use this to determine who can pick the next card
  // However, it seems fine to let any player pick the next card in case someone AFKs or whatever
  // So I'm just leaving this here for now
  const [sessionPlayerName, setSessionPlayerName] = useState(null)
  const [newGame, setNewGame] = useState(true)
  const [status, setStatus] = useState('Start picking cards!')
  const [rulesExpanded, setRulesExpanded] = useState(false)
  const [returnHomeExpanded, setReturnHomeExpanded] = useState(false)
  const [size, setSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  const [playerState, setPlayerState] = useState([])
  const [gameOver, setGameOver] = useState(false)
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
  const localGameInProgress = localStorage.getItem('playerState')
  const gameContainerRef = useRef(null)

function returnHome() {
  setSessionPlayerName(null)
  localStorage.removeItem('playerState')
  localStorage.removeItem('deckState')
  document.location.href = '/'
}

function ConfirmReturnHome() {
  return (
    <Overlay>
      <p>Returning home will exit your current game.</p>
      {localGame && <p>This will end your current local session.</p>}
      <p>Are you sure?</p>
      <div>
        <StyledButton onClick={() => returnHome()}>Yes</StyledButton>
        <StyledButton onClick={() => setReturnHomeExpanded(false)}>Cancel</StyledButton>
      </div>
    </Overlay>
  )
}

function GameOver() {
  return (
    <Overlay>
      <p>The game is over! I hope you had fun.</p>
        <StyledButton onClick={() => returnHome()}>Return Home</StyledButton>
    </Overlay>
  )
}


  useEffect(() => {
    if (localGameInProgress ) {
      setPlayerState(JSON.parse(localGameInProgress))
      window.history.pushState('', '', 'local')
      setNewGame(false)
    }
  },[localGameInProgress])

  useEffect(() => {
    function updateSize() {
      console.log('UPDATING SIZE')
      setSize({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
  }, []);

  const changePlayer = (status) => {

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
      localStorage.setItem('playerState', JSON.stringify(newPlayerState))
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
    if (localPlayers) {
      const mappedPlayers = localPlayers.map((player,i) => ({ name: localPlayers[i], active: true, current: i === 0 }))
      localStorage.setItem('playerState', JSON.stringify(mappedPlayers))
      setPlayerState(mappedPlayers)
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
      <Table height={size.height}>
        {gameOver && <GameOver />}
        <GameStatusSection>
          <Players players={playerState} />
          <hr />
          { status }
        </GameStatusSection>
        <GameplaySection ref={gameContainerRef}>
          {returnHomeExpanded && <ConfirmReturnHome />}
          {rulesExpanded && <div onClick={() => setRulesExpanded(false)}><Rules /></div>}
          <Deck gameId={gameRoute} setGameOver={setGameOver} updateStatus={updateStatus} gameContainerRef={gameContainerRef} />
        </GameplaySection>
        <Nav 
          rulesExpanded={rulesExpanded}
          setRulesExpanded={setRulesExpanded}
          localGame={localGame}
          setReturnHomeExpanded={setReturnHomeExpanded}
        />
      </Table>
    )
  }
}

export default () => (
  <ThemeProvider theme={globalStyles}>
    <Wrapper>
      <Game />
    </Wrapper>
  </ThemeProvider>
)
