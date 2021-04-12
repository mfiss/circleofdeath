
import React from 'react'
import { StyledButton, StyledNav } from './styled'

async function handleCopyLink() {
  const path = window.location
  await navigator.clipboard.writeText(path)
}


export default function({
  rulesExpanded,
  setRulesExpanded,
  localGame,
  setReturnHomeExpanded
}) {
  return (
    <StyledNav>
      <ul>
        <li><StyledButton onClick={() => {
          setRulesExpanded(false)
          setReturnHomeExpanded(true)
        }}>Home</StyledButton></li>
        <li><StyledButton onClick={() => setRulesExpanded(!rulesExpanded)}>{rulesExpanded ? 'Hide Rules' : 'View Rules'}</StyledButton></li>
        {!localGame && <li><StyledButton onClick={() => handleCopyLink()}>Copy Link</StyledButton></li>}
      </ul>
      
    </StyledNav>
  )
}