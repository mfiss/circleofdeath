import React from 'react'
import styled from 'styled-components'

const StyledPaper = styled.div`
  position: relative;
  margin: 1rem;
  background: white;
  border-radius: 1rem;

  &:before {
    content: '';
    border-left: .2rem solid #EEB9B9;
    height: 100%;
    position: absolute;
    top: 0;
    left: 15%;  
    z-index: 1;
  }

  &:after {
    content: '';
    border-right: .1rem solid #EEB9B9;
    height: 100%;
    position: absolute;
    top: 0;
    right: 15%;  
    z-index: 1;
  }

  ${({theme}) => `@media only screen and (min-width : ${theme.largeBreakpoint}px) {

    height: 100%;
    mask-image: radial-gradient(circle at 2rem , transparent .75rem, black .75rem, black 100%), 
    radial-gradient(circle at 2rem 15%, transparent .75rem, black .75rem, black 100%),
    radial-gradient(circle at 2rem 85%, transparent .75rem, black .75rem, black 100%);

    mask-size: 100% 100%;
    -webkit-mask-composite: destination-in;
    mask-composite: subtract;
  }
`}`

const PaperLines = styled.div`
  top: 15%;
  left: 0;
  position: absolute;
  width: 100%;
  height: 85%;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
  background: repeating-linear-gradient(white, white 2rem, #B9CEEE 2rem, #B9CEEE 2.1rem);
`
export default ({children}) => (
  <StyledPaper>
    {children}
    <PaperLines />
  </StyledPaper>
)