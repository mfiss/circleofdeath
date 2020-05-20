import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ThumbSVG from "./thumb";
import { firestore } from "./firebase";

const PlayersList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style-type: none;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  font-size: 2rem;
`;

const PlayerListItem = styled.li`
  z-index: 50;
  padding: 0.5rem;
  ${({ current }) => (current ? "color: red;" : null)}
`;

const ThumbMaster = styled.button`
  opacity: ${({ current }) => (current ? 1 : 0.2)};
  border: 0;
`;

const QuestionMaster = styled.p`
  font-size: 3rem;
  font-family: "UnifrakturMaguntia", cursive;
  opacity: ${({ current }) => (current ? 1 : 0.2)};
  color: red;
  margin: 0;
  padding: 0;
`;

const PlayerBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlayerStatusBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const Thumb = ({ currentMaster }) => {
  const [thumbState, toggleThumbState] = useState(false);
  const handleThumbClick = () => toggleThumbState(!thumbState);

  return (
    <ThumbMaster
      current={currentMaster}
      pressed={thumbState}
      onClick={() => handleThumbClick()}
    >
      <ThumbSVG
        width={"50"}
        height={"50"}
        fill={thumbState ? "red" : "black"}
      />
    </ThumbMaster>
  );
};

export default ({ gameId, players }) => {
  // TODO: fetch players
  const [activePlayers, setActivePlayers] = useState(players);
  useEffect(() => {
    async function getPlayers() {
      try {
        const playerList = await firestore.collection("games").doc(`${gameId}`).collection('players').get();
        playerList.forEach(doc => console.log(doc.id))
      } catch (err) {
        console.log(err)
      }
    }
    getPlayers();
  }, []);

  return (
    <PlayersList>
      {players.map((player, i) => (
        <PlayerListItem key={JSON.stringify(player)} current={player.current}>
          <PlayerBox>
            <PlayerStatusBox>
              <Thumb currentMaster={player.thumbMaster} />
              <QuestionMaster current={player.questionMaster}>?</QuestionMaster>
            </PlayerStatusBox>
            {player.name}
          </PlayerBox>
        </PlayerListItem>
      ))}
    </PlayersList>
  );
};

