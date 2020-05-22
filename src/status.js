import React from 'react'
import styled from 'styled-components'

const StyledStatus = styled.div`
  font-family: 'Caveat', cursive;
  font-size: 2rem;
  text-align: center;
`

export default ({status}) => (
    <StyledStatus>
      {status}
    </StyledStatus>
  )