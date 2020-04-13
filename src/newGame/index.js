import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import Cards from './components/Cards'
import Lights from './components/Lights'
import Environment from './components/Environment'
import Text from './components/Text'
import styled from 'styled-components';
import SkullGif from '../skull.gif';

export const NewGameBackground = styled.div`
  cursor: pointer;
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
  font-family: 'UnifrakturMaguntia', cursive;
  color: white;
  border: none;
  background: none;
  font-size: 2rem;
`

const Skull = () => <img src={SkullGif} alt="Spinning Skull" />

export default ({startGame}) => {

 return (
    <NewGameBackground
      id="new-game-background"
      onClick={() => startGame()}
    >
          <Canvas>
        <Suspense fallback={null}>
          <Text />
          <Cards />
          <Lights />
          <Environment />
        </Suspense>
      </Canvas>
      {/* <TitleBackground>
        <Skull />
          <GameTitle>Circle of Death</GameTitle>
      </TitleBackground> */}
      <NewGameButton>Start New Game</NewGameButton>
    </NewGameBackground>
  )

}