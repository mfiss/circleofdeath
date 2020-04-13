import React from 'react'

export default () => {
  const FakeSphere = () => {
    return (
      <mesh>
        <sphereBufferGeometry args={[0.7, 30, 30]} attach='geometry' />
        <meshBasicMaterial color={0xff0000} attach='material' />
      </mesh>
    )
  }

  return (
    <group>
      {/* <FakeSphere /> */}
      {/* <ambientLight /> */}
      {/* <pointLight distance={60} intensity={.1} color="white" /> */}
        <spotLight intensity={1} position={[0, 0, 70]} penumbra={1} color="white" />
        <ambientLight color={0x404040} intensity={1} />
    </group>
  )
}
