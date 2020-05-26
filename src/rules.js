
import React, { useState } from 'react'
import styled from 'styled-components'

const RulesTab = styled.div`
position: relative;
padding: 1rem;
font-family: 'Caveat', cursive;
text-align: left;
z-index: 69; 
transition: 1s ease-in-out;
bottom: 0;

  h2 {
    margin: 0;
  }

  ${({theme}) => `@media only screen and (min-width : ${theme.largeBreakpoint}px) {
  padding-left: 17%;
  margin: auto;
}


> ul {
  padding: 0;
  z-index: 69;

  > li > h3 {
    display: inline;
    margin: 0;
    padding: 0;
  }
}

> ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  > li {
    p {
      padding: 0;
      margin-top: 0;
    }

    h4 {
      display: inline;
      margin: 0;
      padding: 0;

      &:before {
        content: ' - ';
      }
    }
  } 
}
`}`

const Em = styled.em`
  font-weight: bold;
`

export default () => (
    <RulesTab>
      <h2>Rules:</h2>
      <ul>
        <li>
          <p>
            <Em>King - Make a rule</Em> The player can make one rule and have the ability to undo a rule put in place by a previous King. However, if you draw the fourth King, you must drink the middle cup.
          </p>
        </li>
        <li>
          <p>
            <Em>Queen - Question Master</Em> Ask a question to any other player, who must ask another player a different question. The first person to not reply with a question or ask the person who asked them loses and must drink.
          </p>
        </li>
        <li>
          <p>
          <Em>Jack - Thumb Master</Em> You are now the Thumb Master. This means that you can place your Thumb on the table at any time and all other players must race to do the same. The last player with his or her thumb on the table must drink. You remain Thumb master until someone else draws a Jack. (in-game functionality to come!)
          </p>
        </li>
        <li>
          <p>
          <Em>10 - Categories</Em> The player states a category and everyone else must state items that fit into the category. The first player to respond with an irrelevant or repeated item drinks.
          </p>
        </li>
        <li>
          <p>
          <Em>9 - Rhyme</Em> Say a word. Everyone must find a rhyme. The first player to hesitate, answer incorrectly, or repeat a rhyme must drink.
          </p>
        </li>
        <li>
          <p>
          <Em>6-8</Em> If the card color is red, the player must drink. Otherwise, the player has the ability to give the drink to someone else. Or, the person who drew the card assigns that number of drinks (usually one drink equals one second) to someone sitting in the circle.
          </p>
        </li>
        <li>
          <p>
          <Em>2-5</Em> That player drinks that number of drinks.
          </p>
        </li>
        <li>
          <p>
            <Em>Ace - Waterfall</Em> Everyone chugs their drink, and the drinking stops only when the person to their right stops, starting with the player that drew the Ace. Think of it like dominoes, but with a greater chance that someone will vomit.
          </p>
        </li>
      </ul>
    </RulesTab>
)