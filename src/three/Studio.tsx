import { Environment, Lightformer } from '@react-three/drei';

/**
 * Locally rendered studio environment — softboxes and strip lights built from
 * Lightformers, so no HDRI download is needed and reflections stay controlled.
 */
export function Studio() {
  return (
    <>
      <Environment resolution={512} frames={1}>
        <color attach="background" args={['#0b0d0c']} />
        {/* overhead strip */}
        <Lightformer form="rect" intensity={3.2} position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[12, 1.6, 1]} />
        {/* key softbox, left */}
        <Lightformer form="rect" intensity={2.6} position={[-6, 1.5, 3]} rotation-y={Math.PI / 2.6} scale={[3, 7, 1]} />
        {/* narrow rim strips, right & back */}
        <Lightformer form="rect" intensity={2.2} position={[6, 0, 0]} rotation-y={-Math.PI / 2} scale={[0.6, 9, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[2, 1, -6]} rotation-y={Math.PI} scale={[8, 0.7, 1]} />
        {/* diagonal strip: the classic streak across a watch crystal */}
        <Lightformer form="rect" color="#fff4dc" intensity={1.6} position={[3.5, 3, 6]} rotation={[0, 0.5, -0.7]} scale={[0.35, 7, 1]} />
        {/* warm, low champagne fill from below-front */}
        <Lightformer form="rect" color="#f3dfb6" intensity={0.5} position={[-2, -4, 5]} rotation-x={-0.6} scale={[6, 2, 1]} />
        {/* rear softbox for case back and movement views */}
        <Lightformer form="rect" intensity={0.9} position={[-1, 3, -7]} rotation-y={Math.PI} scale={[9, 4, 1]} />
        {/* large soft side panels so polished flanks never read as black holes */}
        <Lightformer form="rect" intensity={0.7} position={[-5, -1, -3]} rotation-y={Math.PI / 4} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={0.55} position={[5, -2, 4]} rotation-y={-Math.PI / 3} scale={[6, 5, 1]} />
        {/* deep green floor bounce */}
        <Lightformer form="rect" color="#2f7a5c" intensity={0.35} position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>

      <ambientLight intensity={0.08} />
      <directionalLight
        position={[-3.5, 5, 6]}
        intensity={2.2}
        color="#fff6e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.01}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-4.5}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
      />
      <spotLight position={[5, 2, -5]} angle={0.5} penumbra={1} intensity={14} color="#dfeee6" />
    </>
  );
}
