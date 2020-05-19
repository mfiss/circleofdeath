import React, { useState } from 'react'
import styled from 'styled-components';
import SkullGif from '../skull.gif';

export const NewGameBackground = styled.div`
  font-family: 'UnifrakturMaguntia', cursive;
  font-size: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  background-color: black;
`

export const GameTitle = styled.h1`
  font-family: 'UnifrakturMaguntia', cursive;
  color: red;
  font-size: 6rem;
  margin: 0;
`

export const TitleBackground = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  > img {
    padding: 1rem;
    align-self: center;
  }
`

export const NewGameButton = styled.button`
  cursor: pointer;
  font-family: 'UnifrakturMaguntia', cursive;
  color: white;
  border: none;
  background: none;
  font-size: 2rem;
`

export const NameInput = styled.input`
  font-family: 'UnifrakturMaguntia', cursive;
  font-size: 2rem;
  background: black;
  margin: 1rem 0 1rem 0;
  color: white;
  text-align: center;
`

const Error = styled.div`
  color: red;
  font-size: 1.5rem
`

const Skull = () => <img src={SkullGif} alt="Spinning Skull" />

const NewGameSetup = ({startGame}) => {
  const [name, setName] = useState('')
  const [error, setError] = useState([])
  
  const sanitizeName = (value) => {
    setError([])
    let funValue = value
    if (funValue.match(/[^a-z0-9áéíóúñü .,_-]/gim,"")) {
      setError('Wow such fancy characters. Try some regular letters, nerd')
      funValue = 'Nerd'
    }

    if (value.length > 15) {
      setError('Use a shorter name, Dingus')

      funValue= 'Dingus'
    }

    const sanitizedName = funValue.replace(/[^a-z0-9áéíóúñü .,_-]/gim,"").trim().slice(0, 15)
    setName(sanitizedName);
  }

  const checkForName = () => {
    if (name) {
      // Do stuff to actually start a game
      startGame()
    } else {
      setError('Enter a name first')
    }
  }

  return (
    <>
    Enter Name:
    <NameInput value={name} onChange={({target: { value } }) => sanitizeName(value)} />
    
    <NewGameButton onClick={() => checkForName()}>
      Start New Game
    </NewGameButton>
    <Error>{error}</Error>
    </>
  )
}

export default ({startGame}) => {

 return (
    <NewGameBackground id="new-game-background" >
      <TitleBackground>
        <Skull />
          <GameTitle>Circle of Death</GameTitle>
      <NewGameSetup startGame={startGame}/>
      </TitleBackground>
    </NewGameBackground>
  )

}