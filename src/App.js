import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import Status from "./status";
import Players from "./players";
import Paper from "./paper";
import Rules from "./rules";
import Deck from "./deck";
import NewGame from "./newGame";
import globalStyles from "./globalStyles";
import { firestore } from './firebase'

export const Table = styled.div`
  margin: auto;
  max-width: 1800px;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
`;

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: ${({ theme }) =>
    theme.largeBreakpoint}px) {
    width: 50%;
  }
`;

const GameStatusSection = styled.div`
  margin: 1rem 1rem 0 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: white;
  font-family: "Caveat", cursive;
  text-align: center;
  justify-content: space-around;
  text-align: center;
  display: flex;
  flex-direction: column;

  h1 {
    margin: 0;
  }
`;

const GameInfoContainer = styled.div`
  flex: 1 1 50%;
  position: relative;
  font-family: "Caveat", cursive;
`;

export const Game = () => {
  const path = window.location.pathname;
  const gameRoute = path !== "/" && path.slice(1);
  const [sessionPlayerName, setSessionPlayerName] = useState(null);
  // Either version of newGame will prompt user for a name if one doesn't exist yet
  const [newGame, setNewGame] = useState(!sessionPlayerName);
  const [status, setStatus] = useState("Start picking cards!");
  const [playerState, setPlayerState] = useState([]);
  const currentPlayer = playerState.find((p) => p.current);
  console.log('current player', currentPlayer, 'player state', playerState)
  const { name } = currentPlayer || {};
  const currentPlayerIndex = playerState.map((p) => p.current).indexOf(true);
  const nextPlayerIndex = (currentPlayerIndex === playerState.length - 1) ? 0 : currentPlayerIndex + 1
  const playerId = localStorage.getItem('playerId')
  const playersRef = firestore.collection(`/games/${gameRoute}/players`)
  const currentSessionPlayer = playersRef.doc(playerId)

  const changePlayer = (status) => {
    console.log('status', status)
    const cardStr = status.card || '';
    const thumbMaster = cardStr === "Jack";
    const questionMaster = cardStr === "Queen";

    currentSessionPlayer
    .get()
    .then(doc => {
        if (thumbMaster) {
          playersRef.where('thumbMaster', '==', true)
          .get()
          .then(snap => snap.forEach(doc => playersRef.doc(doc.id).update({ thumbMaster: false })))
        
        }
        if (questionMaster) {
          playersRef.where('questionMaster', '==', true).get()
          .then(snap => snap.forEach(doc => playersRef.doc(doc.id).update({ questionMaster: false })))
        }

        playersRef.where('current', '==', true).get()
        .then(snap => snap.forEach(doc => playersRef.doc(doc.id).update({current: false, thumbMaster, questionMaster})))
        console.log('playerState', playerState, 'nextPlayerIndex', nextPlayerIndex)
        // index can kinda work like an id
        playersRef.where('index', '==', playerState[nextPlayerIndex].index).get()
          .then(snap => snap.forEach(doc => playersRef.doc(doc.id).update({ current: true })))
      })
      .catch(err => console.log(err))
    }

    const handleUnload = (e) => {
       e.preventDefault()
      
      currentSessionPlayer
        .get()
        .then(doc => {
          if (doc.exists && doc.data().active) {
            // It's the leaving player's turn, so make the next person the current player
            changePlayer()
          } 
        })
        .catch(err => console.log(err))
      playersRef
      .doc(playerId)
      .update({active: false})
      .catch(err => console.log(err))
    }

    // Make people that leave the game inactive
    window.addEventListener('beforeunload', e => handleUnload(e))
    
    

  const updateStatus = (status) => {
    changePlayer(status);

    const statusResponse = statusResponseTemplate.find((match) => {
      if (match.color && status.color !== match.color) {
        return false;
      }
      return status.card === match.card;
    }) || { text: "Status not found!" };

    if (!status.card && !status.thumbMaster) {
      setStatus('Start picking cards!')
    } else if (status.thumbMaster) { 
      setStatus(`${status.thumbMaster} put their thumb down last. Drink!`)
    } else {
      setStatus(`${status.card} of ${status.suit}: ${statusResponse.text}`);
    }
    
  };

  const statusResponseTemplate = [
    { card: "Ace", text: "WATERFALL!" },
    { card: "King", text: "Make a rule." },
    { card: "Queen", text: `${name} is now the Question Master!` },
    { card: "Jack", text: `${name} is now the Thumb Master!` },
    { card: "10", text: "Category!" },
    { card: "9", text: "Rhyme!" },
    { card: "8", color: "red", text: `${name} drink!` },
    { card: "8", color: "black", text: `${name} give out drinks!` },
    { card: "7", color: "red", text: `${name} drink!` },
    { card: "7", color: "black", text: `${name} give out drinks!` },
    { card: "6", color: "red", text: `${name} drink!` },
    { card: "6", color: "black", text: `${name} give out drinks!` },
    { card: "5", text: `${name} drink 5!` },
    { card: "4", text: `${name} drink 4!` },
    { card: "3", text: `${name} drink 3!` },
    { card: "2", text: `${name} drink 2!` },
  ];

  const startGame = (gameRoute, returningPlayer) => {
    window.history.pushState("", "", gameRoute);
    setNewGame(false);
  };

  useEffect(() => {
    // set this for unsubscribing on component unmount
    let unsub
    function getPlayers() {
      try {
        // mount the listener
        unsub = firestore.collection(`/games/${gameRoute}/players`).onSnapshot(snapshot => {
          let currentPlayers = []
          snapshot.forEach(doc => {
            currentPlayers.push(doc.data())
          })
          const currentActivePlayers = currentPlayers.filter(player => player.active)
          setPlayerState(currentActivePlayers)
        })
      } catch (err) {
        console.log(err)
      }
    }
    getPlayers();
    // unmount unsub
    return () => unsub()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameRoute]);

  if (newGame) {
    return (
      <NewGame
        startGame={startGame}
        gameRoute={gameRoute}
        setSessionPlayerName={setSessionPlayerName}
      />
    );
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
        <GameInfoContainer>
          <Paper>
            <Rules />
          </Paper>
        </GameInfoContainer>
      </Table>
    );
  }
};

export const GameContainer = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export default () => (
  <ThemeProvider theme={globalStyles}>
    <GameContainer>
      <Game />
    </GameContainer>
  </ThemeProvider>
);
