import * as THREE from 'three'
import React, {useMemo, useRef} from 'react'
import {useLoader, useUpdate, useFrame} from 'react-three-fiber'
import helvetiker from '../helvetiker.json'

export const Text = ({
  children,
  vAlign = 'center',
  hAlign = 'center',
  size = 2,
  color = '#FF0000',
  ...props
}) => {
  //   const font = useLoader(THREE.FontLoader, helvetiker)
  const config = useMemo(
    () => ({
      font: new THREE.Font(helvetiker),
      size: 5,
      height: 5,
      //   curveSegments: 0.01,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelOffset: 0,
      //   bevelSegments: 8,
    }),
    []
  )
  const mesh = useUpdate(
    (self) => {
      const size = new THREE.Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(size)
      self.position.x =
        hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x
      self.position.y =
        vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y
    },
    [children]
  )
  return (
    <group {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry attach='geometry' args={[children, config]} />
        <meshLambertMaterial attach='material' color='red' />
      </mesh>
    </group>
  )
}

export default () => {
  const ref = useRef()

  useFrame(
    ({clock}) =>
      (ref.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.1)
  )
  return (
    <group ref={ref}>
      <Text hAlign='center' position={[0, 2.5, 0]} children='Circle' />
      <Text hAlign='center' position={[0, 1.4, 0]} children='of' />
      <Text hAlign='center' position={[0, .5, 0]} children='Death' />
    </group>
  )
}
