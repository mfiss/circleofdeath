import styled, { css } from "styled-components";
import tableImage from './table.jpg'


export const Error = styled.div`
  color: red;
  font-size: 1.25rem;
`;


export const GameplaySection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 2;
  min-height: 0;
  width: 100%;
  position: relative;
`

export const GameStatusSection = styled.section`
  padding: 1rem;
  background: black;
  color: white;
  display: flex;
  flex-direction: column;
  flex: 0 2 0;
  justify-content: space-around;
  text-align: center;

  hr {
    border: none;
    height: 5px;
    background-image: linear-gradient(to right, rgba(255, 0, 0, 0), rgba(255, 0, 0, 0.75), rgba(255, 0, 0, 0));
    width: 100%;
  }
`

export const GameTitle = styled.h1`
  color: red;
  font-size: 2.5rem;
  margin: 0;
`;

export const NameInput = styled.input`
  background: black;
  margin: 1rem auto;
  color: white;
  text-align: center;
  border-left: none;
  border-right: none;
  border-top: none;
`;

export const NewGameBackground = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  background-color: black;
  padding: 1rem;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0%;
  bottom: 0;

  align-items: center;
  background: rgba(0, 0, 0, .75);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  z-index: 100;
`

export const StyledButton = styled.button`
  background: black;
  border: 2px solid red;
  border-radius: 2rem;
  cursor: pointer;
  color: white;
  display: inline-block;
  font-size: 1.25rem;
  padding: .5rem 1rem;
  margin: .5rem;

  &:hover, &:focus {
    box-shadow: 0 0 20px red;
  }
`;

export const Table = styled.div(({ height }) => css`
  align-items: stretch;
  background: url(${tableImage}) no-repeat center center fixed; 
  background-size: cover;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  height: ${height}px;
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
`)



export const TitleBackground = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  > img {
    padding: 1rem;
    align-self: center;
  }
`;

export const StyledNav = styled.nav`
  background: black;
  color: white;
  flex: 0 1 auto;
  align-items: center;
  justify-content: center;

  ul {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    list-style-type: none;
  }
`

export const Wrapper = styled.div(({ theme }) => css`
  * {
    font-family: ${theme.fonts.main};
  }
`)