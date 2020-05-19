import React, {useMemo, useRef, useState, useEffect, useCallback} from 'react'
import {random} from 'lodash'
import {useFrame, useLoader} from 'react-three-fiber'
import cardBackTexture from '../../../cards/cardback.png'
import * as THREE from 'three'

export default ({cardTexture,index}) => {
  const mesh = useRef()
  const time = useRef(0)

  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const isActiveRef = useRef(isActive)

  // loading texture
  const texture = useMemo(() => new THREE.TextureLoader().load(cardTexture), [
    cardTexture,
  ])

  const backSideTexture = useMemo(
    () => new THREE.TextureLoader().load(cardBackTexture),
    []
  )

  const c = (-6 + (index * .1))

  // random time mod factor
  const timeMod = useMemo(() => random(0.1, 4, true), [])

  // color
  const color = isHovered ? 0xe5d54d : isActive ? 0xf7e7e5 : 0xf95b3c

  //useEffect of the activeState
  useEffect(() => {
    isActiveRef.current = isActive
  }, [c, isActive])

  // raf loop
  useFrame(() => {
    
    // mesh.current.rotation.y += 0.001

    if (mesh.current.position.y < 4) {
      mesh.current.position.y += .1
    } else {
      mesh.current.position.y += -10.2
    }
        
    if (isActiveRef.current) {
      time.current += 0.03
      // mesh.current.position.y = position[1] + Math.sin(time.current) * 0.4
      mesh.current.position.x = Math.sin(time.current) * 0.4
    }
  })

  // Events
  const onHover = useCallback(
    (e, value) => {
      e.stopPropagation()
      setIsHovered(value)
    },
    [setIsHovered]
  )

  const onClick = useCallback(
    (e) => {
      e.stopPropagation()
      setIsActive((v) => !v)
    },
    [setIsActive]
  )

  return (
    <group 
      ref={mesh} 
      rotation={[0,0,0]}
      position={[0,(-18 + (index * 1.3)),0]}
      onClick={(e) => onClick(e)}
      onPointerOver={(e) => onHover(e, true)}
      onPointerOut={(e) => onHover(e, false)}
    >
      <mesh>
        <planeGeometry attach='geometry' args={[1, 1.33]} />
        <meshLambertMaterial attach='material' map={texture} />
      </mesh>
      <mesh>
        <planeGeometry attach='geometry' args={[1, 1.33]} />
        <meshLambertMaterial
          attach='material'
          map={backSideTexture}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
