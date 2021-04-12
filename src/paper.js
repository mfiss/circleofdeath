import React from 'react'
import styled from 'styled-components'

const StyledPaper = styled.div`
  background: white;
  border-radius: 1rem;
  margin: 1rem;
  overflow: scroll;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;

  ${({
    theme,
  }) => `@media only screen and (min-width : ${theme.largeBreakpoint}px) {

    
    mask-image: radial-gradient(circle at 2rem , transparent .75rem, black .75rem, black 100%), 
    radial-gradient(circle at 2rem 15%, transparent .75rem, black .75rem, black 100%),
    radial-gradient(circle at 2rem 85%, transparent .75rem, black .75rem, black 100%);

    mask-size: 100% 100%;
    -webkit-mask-composite: destination-in;
    mask-composite: subtract;

    &:before {
      content: '';
      border-left: .2rem solid #EEB9B9;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 15%;  
      z-index: 100;
    }
  
    &:after {
      content: '';
      border-right: .1rem solid #EEB9B9;
      position: fixed;
      top: 0;
      bottom: 0;
      right: 15%;  
      z-index: 100;
    }
  }


`}
`

const PaperLines = styled.div`
  top: 15%;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
  background: repeating-linear-gradient(
    white,
    white 2rem,
    #DCE6F5 2rem,
    #DCE6F5 2.1rem
  );
`
export default ({children}) => {
  return (
    <StyledPaper>
      {children}
      <PaperLines />
    </StyledPaper>
  )
}
