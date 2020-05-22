import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SkullGif from "./skull.gif";
import { firestore } from "./firebase";

export const NewGameBackground = styled.div`
  font-family: "UnifrakturMaguntia", cursive;
  font-size: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  background-color: black;
`;

export const GameTitle = styled.h1`
  font-family: "UnifrakturMaguntia", cursive;
  color: red;
  font-size: 6rem;
  margin: 0;
`;

export const TitleBackground = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  > img {
    padding: 1rem;
    align-self: center;
  }
`;

export const NewGameButton = styled.button`
  cursor: pointer;
  font-family: "UnifrakturMaguntia", cursive;
  color: white;
  border: none;
  background: none;
  font-size: 1.5rem;
`;

export const NameInput = styled.input`
  font-family: "UnifrakturMaguntia", cursive;
  font-size: 2rem;
  background: black;
  margin: auto;
  margin-bottom: 1rem;
  color: white;
  text-align: center;
  border-left: none;
  border-right: none;
  border-top: none;
  width: 50%;
`;

const Error = styled.div`
  color: red;
  font-size: 1.25rem;
`;

const Skull = () => <img src={SkullGif} alt="Spinning Skull" />;

const NewGameSetup = ({ startGame, gameRoute, setSessionPlayerName }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState([]);

  const sanitizeName = (value) => {
    setError([]);
    let funValue = value;
    if (funValue.match(/[^a-z0-9áéíóúñü .,_-]/gim, "")) {
      setError("Wow such fancy characters. Try some regular letters, nerd");
      funValue = "Nerd";
    }

    if (value.length > 15) {
      setError("Use a shorter name, Dingus");

      funValue = "Dingus";
    }

    const sanitizedName = funValue
      .replace(/[^a-z0-9áéíóúñü .,_-]/gim, "")
      .trim()
      .slice(0, 15);
    setName(sanitizedName);
    setSessionPlayerName(sanitizedName);
  };


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
        rotate: parseInt(Math.random() * 360),
        index: 0
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

  const shuffledDeck = shuffle(deckArray)

  const checkForName = (gameRoute) => {
    if (name && gameRoute) {
      // get collection of players
      const players = firestore.collection('games').doc(`${gameRoute}`).collection('players')
      const numberOfPlayers = players.get().then(snap => {
        console.log(name, gameRoute, 'players', players, 'number', numberOfPlayers)
        // add your player
        players.add({
          active: true,
          name,
          current: false,
          index: snap.size,
          thumbMaster: false,
          questionMaster: false,
        }).then(doc => {
          // add user to localstorage for later use
          localStorage.setItem('playerId', doc.id)
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
      // start game with URL gameRoute
      startGame(gameRoute);
    }
    if (name && !gameRoute) {
      // set up active game
      firestore.collection(`games`).add({ active: true })
      .then((doc) => {
        const playerDocRef = firestore.collection('games').doc(`${doc.id}`).collection('players')
        const deckDocRef = firestore.collection('games').doc(`${doc.id}`).collection('deck')
        
        // add the player to a players collection
        playerDocRef
          .add({
            active: true,
            name,
            current: true,
            index: 0,
            thumbMaster: false,
            questionMaster: false
          }).then(player => {
            localStorage.setItem('playerId', player.id)
          }).catch(err => console.log(err))

          shuffledDeck.forEach(card => deckDocRef.add(card))
        // start game with the doc.id
        startGame(doc.id);
      });
         
    } else {
      setError("Enter a name first");
    }
  };
  
  useEffect(() => {
    function moveAlongNow(gameRoute) {
      const playerId = localStorage.getItem('playerId')
      if (playerId) {
        firestore.collection('games').doc(`${gameRoute}`).get().then(doc => {
          const active = doc.data()?.active
          if (active) {
            const players = firestore.collection('games').doc(`${gameRoute}`).collection('players')
            const playerIsReturning = players.doc(playerId).get()
            .then(doc => {
              if (doc.exists) {
                console.log('player is returning', doc)
                players.doc(playerId).update({ active: true})
                startGame(gameRoute, playerIsReturning)
              }
            }).catch(err => console.log(err))
          }
        })
      }
    }
    moveAlongNow(gameRoute)
  }, [gameRoute, startGame])

  return (
    <>
      Enter Name:
      <NameInput
        value={name}
        onKeyDown={({key}) => key === 'Enter' ? checkForName(gameRoute) : null}
        onChange={({ target: { value } }) => sanitizeName(value)}
      />
      {gameRoute ? (
        <NewGameButton onClick={() => checkForName(gameRoute)}>
          Join Game
        </NewGameButton>
      ) : (
          <NewGameButton onClick={() => checkForName(gameRoute)}>
            Start New Game
          </NewGameButton>
        )}
      <Error>{error}</Error>
    </>
  );
};

export default ({ startGame, gameRoute, setSessionPlayerName }) => {
  return (
    <NewGameBackground id="new-game-background">
      <TitleBackground>
        <Skull />
        <GameTitle>Circle of Death</GameTitle>
        <NewGameSetup
          startGame={startGame}
          gameRoute={gameRoute}
          setSessionPlayerName={setSessionPlayerName}
        />
      </TitleBackground>
    </NewGameBackground>
  );
};

