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
        {/* <pointLight distance={100} intensity={3} color="blue" /> */}
        <spotLight intensity={5} position={[1, 1, -1000]} penumbra={1} color="white" />
        <ambientLight color={0x404040} intensity={3} />
    </group>
  )
}
