
const Box = (props) => {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
  
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
      if (hovered && !active) {
        mesh.current.rotation.z += 0.01
        mesh.current.rotation.x += 0.01
      }
      if (hovered && active) {
        mesh.current.rotation.y += 0.02
        mesh.current.rotation.x += 0.06
      }
    })
  
    return (
      <mesh
        {...props}
        ref={mesh}
        scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        onClick={e => setActive(!active)}
        onPointerOver={e => setHover(true)}
        onPointerOut={e => setHover(false)}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} />
        <matrix4 translation={(150,0,0)} />
      </mesh>
    )
  }
  
  const Square = (props) => {
    const wormRef = useRef()
  
    useFrame(() => {
      wormRef.current.rotation.z = Math.PI*2/13*props.i
    })
  
    return (
      <mesh
        {...props}
        ref={wormRef}
        scale={[1, 1, 1]}
      >
        <boxGeometry attach="geometry" args={50,50,150} />
        <meshLambertMaterial attach="material" color={props.color} />
      </mesh>  
    )
  }
  
  const Elements = () => {
    const nodesCircles = [...Array(14)].map((el, i) => {
      return <Circle key={i} position={[0, 0, i*180]} i={i} />;
    });
    
    return (
      <group>
        { nodesCircles }
      </group>
  
    )
  }
  
  const Circle = ({i}) => {
    const circleRef = useRef()
    const colors = [0xff0000, 0x000000, 0xFF6565, 0x854343]
    
    // circleRef.current.position.z = -i*180;
  
    const nodesSquares = [...Array(13)].map((el, i) => {
      return <Square key={i} i={i} color={colors[i%4]} />;
    });
  
    return (
      <group ref={circleRef}>
        { nodesSquares }
      </group>
    );
  }
    