import React, {useRef} from 'react'
import {map} from 'lodash'
import {useFrame} from 'react-three-fiber'

import TwoOfClubs from '../../../cards/2_of_clubs.png'
import TwoOfDiamonds from '../../../cards/2_of_diamonds.png'
import TwoOfHearts from '../../../cards/2_of_hearts.png'
import TwoOfSpades from '../../../cards/2_of_spades.png'

import ThreeOfClubs from '../../../cards/3_of_clubs.png'
import ThreeOfDiamonds from '../../../cards/3_of_diamonds.png'
import ThreeOfHearts from '../../../cards/3_of_hearts.png'
import ThreeOfSpades from '../../../cards/3_of_spades.png'

import FourOfClubs from '../../../cards/4_of_clubs.png'
import FourOfDiamonds from '../../../cards/4_of_diamonds.png'
import FourOfHearts from '../../../cards/4_of_hearts.png'
import FourOfSpades from '../../../cards/4_of_spades.png'

import FiveOfClubs from '../../../cards/5_of_clubs.png'
import FiveOfDiamonds from '../../../cards/5_of_diamonds.png'
import FiveOfHearts from '../../../cards/5_of_hearts.png'
import FiveOfSpades from '../../../cards/5_of_spades.png'

import SixOfClubs from '../../../cards/6_of_clubs.png'
import SixOfDiamonds from '../../../cards/6_of_diamonds.png'
import SixOfHearts from '../../../cards/6_of_hearts.png'
import SixOfSpades from '../../../cards/6_of_spades.png'

import SevenOfClubs from '../../../cards/7_of_clubs.png'
import SevenOfDiamonds from '../../../cards/7_of_diamonds.png'
import SevenOfHearts from '../../../cards/7_of_hearts.png'
import SevenOfSpades from '../../../cards/7_of_spades.png'

import EightOfClubs from '../../../cards/8_of_clubs.png'
import EightOfDiamonds from '../../../cards/8_of_diamonds.png'
import EightOfHearts from '../../../cards/8_of_hearts.png'
import EightOfSpades from '../../../cards/8_of_spades.png'

import NineOfClubs from '../../../cards/9_of_clubs.png'
import NineOfDiamonds from '../../../cards/9_of_diamonds.png'
import NineOfHearts from '../../../cards/9_of_hearts.png'
import NineOfSpades from '../../../cards/9_of_spades.png'

import TenOfClubs from '../../../cards/10_of_clubs.png'
import TenOfDiamonds from '../../../cards/10_of_diamonds.png'
import TenOfHearts from '../../../cards/10_of_hearts.png'
import TenOfSpades from '../../../cards/10_of_spades.png'

import JackOfClubs from '../../../cards/jack_of_clubs.png'
import JackOfDiamonds from '../../../cards/jack_of_diamonds.png'
import JackOfHearts from '../../../cards/jack_of_hearts.png'
import JackOfSpades from '../../../cards/jack_of_spades.png'

import QueenOfClubs from '../../../cards/queen_of_clubs.png'
import QueenOfDiamonds from '../../../cards/queen_of_diamonds.png'
import QueenOfHearts from '../../../cards/queen_of_hearts.png'
import QueenOfSpades from '../../../cards/queen_of_spades.png'

import KingOfClubs from '../../../cards/king_of_clubs.png'
import KingOfDiamonds from '../../../cards/king_of_diamonds.png'
import KingOfHearts from '../../../cards/king_of_hearts.png'
import KingOfSpades from '../../../cards/king_of_spades.png'

import AceOfClubs from '../../../cards/ace_of_clubs.png'
import AceOfDiamonds from '../../../cards/ace_of_diamonds.png'
import AceOfHearts from '../../../cards/ace_of_hearts.png'
import AceOfSpades from '../../../cards/ace_of_spades.png'

import Card from './Card'

const cards = [
  TwoOfClubs,
  TwoOfDiamonds,
  TwoOfHearts,
  TwoOfSpades,
  ThreeOfClubs,
  ThreeOfDiamonds,
  ThreeOfHearts,
  ThreeOfSpades,
  FourOfClubs,
  FourOfDiamonds,
  FourOfHearts,
  FourOfSpades,
  FiveOfClubs,
  FiveOfDiamonds,
  FiveOfHearts,
  FiveOfSpades,
  SixOfClubs,
  SixOfDiamonds,
  SixOfHearts,
  SixOfSpades,
  SevenOfClubs,
  SevenOfDiamonds,
  SevenOfHearts,
  SevenOfSpades,
  EightOfClubs,
  EightOfDiamonds,
  EightOfHearts,
  EightOfSpades,
  NineOfClubs,
  NineOfDiamonds,
  NineOfHearts,
  NineOfSpades,
  TenOfClubs,
  TenOfDiamonds,
  TenOfHearts,
  TenOfSpades,
  JackOfClubs,
  JackOfDiamonds,
  JackOfHearts,
  JackOfSpades,
  QueenOfClubs,
  QueenOfDiamonds,
  QueenOfHearts,
  QueenOfSpades,
  KingOfClubs,
  KingOfDiamonds,
  KingOfHearts,
  KingOfSpades,
  AceOfClubs,
  AceOfDiamonds,
  AceOfHearts,
  AceOfSpades,
]

const chunk = (arr, size) =>
Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
  arr.slice(i * size, i * size + size)
);

export default () => {
  const group = useRef()

  // useFrame(() => {
  //   group.current.rotation.y += 0.005
  // })

  const cardGroups = chunk(cards, 8)
  console.log(cardGroups)

  return (
    <group ref={group} rotation={[0,0,0]} position={[0,0,0]}>
    {cardGroups.map((grp,i) => (
      <group  rotation={[1,(3- (i/1.5)),0]} position={[(-3.5 + (i +.4)), (i % 4), 0]}>
        {grp.map((card,j) => (
          <Card key={j} cardTexture={card} index={j} rotation={[0,0,0]} position={[0,0,0]} />
        ))}
      </group>
    ))}
    </group>
  )
}