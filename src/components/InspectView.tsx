import React, { Suspense, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Resolve the GLB asset — expo bundler serves it via require()
// For web, we use a static path; for native, we'd use the asset system
const GLB_PATH = require('../assets/tamagotchi.glb');

function TamagotchiModel() {
  const { scene } = useGLTF(
    Platform.OS === 'web'
      ? GLB_PATH
      : typeof GLB_PATH === 'number'
        ? (GLB_PATH as any) // RN asset id — drei handles this on native
        : GLB_PATH
  );

  return <primitive object={scene} />;
}

function SceneLighting() {
  return (
    <>
      {/* Warm key light from front-above (match Blender setup) */}
      <directionalLight
        position={[0, 3, 5]}
        intensity={1.8}
        color="#FFF5E6"
        castShadow={false}
      />
      {/* Soft fill from below */}
      <directionalLight
        position={[0, -2, 2]}
        intensity={0.6}
        color="#E8E0FF"
      />
      {/* Ambient for baseline visibility */}
      <ambientLight intensity={0.4} color="#FFFFFF" />
    </>
  );
}

export default function InspectView() {
  return (
    <View style={styles.container}>
      <Canvas
        style={styles.canvas}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 4], fov: 35 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // transparent background
        }}
      >
        <SceneLighting />
        <Suspense fallback={null}>
          <TamagotchiModel />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.5}  // ~0.8x of default 3.2
          maxDistance={8}    // ~2x of default 4
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.85}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.1}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%' as any,
    height: '100%' as any,
  },
  canvas: {
    width: '100%' as any,
    height: '100%' as any,
  },
});
