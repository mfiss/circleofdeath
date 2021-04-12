import React from "react";
import styled from "styled-components";

const PlayersList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style-type: none;
  justify-content: space-around;
  margin: 0;
  padding: 0;
  font-size: 2rem;
`;

const PlayerListItem = styled.li`
  z-index: 50;
  padding: 0.5rem;
  ${({ current }) => (current ? "color: red;" : null)}
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

export default ({ players }) => {

  return (
    <PlayersList>
      {players.map((player, i) => (
        <PlayerListItem key={i} current={player.current}>
          <PlayerBox>
            <PlayerStatusBox>
            </PlayerStatusBox>
            {player.name}
          </PlayerBox>
        </PlayerListItem>
      ))}
    </PlayersList>
  );
};

