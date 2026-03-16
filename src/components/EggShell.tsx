import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { playButtonClick } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

// Import R3F / Three — webpack handles tree-shaking
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// GLB asset — webpack resolves via asset/resource rule to a URL string
const GLB_ASSET = require('../assets/tamagotchi.glb');

interface EggShellProps {
  onLeftPress: () => void;
  onMiddlePress: () => void;
  onRightPress: () => void;
  isInspectMode: boolean;
  onToggleInspect: () => void;
}

// ── Layout constants ──────────────────────────────────────────────
const VIEWER_W = 600;
const VIEWER_H = 750;

// Button touch targets (percentage-based positions over 3D dome buttons)
const BUTTONS = [
  { id: 'left' as const, left: 34, top: 71, handler: 'onLeftPress' as const },
  { id: 'middle' as const, left: 45.5, top: 74, handler: 'onMiddlePress' as const },
  { id: 'right' as const, left: 57, top: 71, handler: 'onRightPress' as const },
];
const BTN_SIZE_PCT = 8;

// Animation names in the GLB
const ANIM_MAP: Record<string, string> = {
  left: 'Button_LeftAction.006',
  middle: 'Button_MiddleAction.006',
  right: 'Button_RightAction.006',
};

type ButtonId = 'left' | 'middle' | 'right';

// ── LCD Texture Capture Hook ──────────────────────────────────────
// Renders DeviceScreen off-screen and captures it as a THREE.CanvasTexture
function useLCDTexture() {
  const textureRef = useRef<InstanceType<typeof THREE.CanvasTexture> | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const html2canvas = require('html2canvas');
    const ReactDOM = require('react-dom/client');
    const DeviceScreen = require('./DeviceScreen').default;

    // Create offscreen container for DeviceScreen
    const container = document.createElement('div');
    container.id = 'lcd-offscreen-container';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '192px';  // Fixed size for capture
    container.style.height = '160px';
    container.style.overflow = 'hidden';
    container.style.zIndex = '-1';
    document.body.appendChild(container);
    containerRef.current = container;

    // Render DeviceScreen into the offscreen container
    const root = ReactDOM.createRoot(container);
    rootRef.current = root;

    // We need to wrap DeviceScreen in a React element
    const React = require('react');
    root.render(React.createElement(DeviceScreen));

    // Create the offscreen canvas for texture
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 192;
    offCanvas.height = 160;
    offscreenCanvasRef.current = offCanvas;

    // Fill with LCD green initially (before first capture)
    const initCtx = offCanvas.getContext('2d');
    if (initCtx) {
      initCtx.fillStyle = '#C8D8C0';
      initCtx.fillRect(0, 0, 192, 160);
    }

    // Create THREE.CanvasTexture
    const texture = new THREE.CanvasTexture(offCanvas);
    texture.flipY = true;  // Default for CanvasTexture
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    textureRef.current = texture;

    // Periodically capture the DeviceScreen div
    let capturing = false;
    intervalRef.current = setInterval(async () => {
      if (capturing || !containerRef.current) return;
      capturing = true;
      try {
        const captured = await html2canvas(containerRef.current, {
          backgroundColor: '#C8D8C0',
          width: 192,
          height: 160,
          scale: 1,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        const ctx = offCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 192, 160);
          ctx.drawImage(captured, 0, 0, 192, 160);
          if (textureRef.current) {
            textureRef.current.needsUpdate = true;
          }
        }
      } catch (_e) {
        console.error('[LCD] html2canvas capture error:', _e);
      }
      capturing = false;
    }, 100); // ~10fps

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (rootRef.current) {
        try { rootRef.current.unmount(); } catch (_e) {}
      }
      if (containerRef.current && document.body.contains(containerRef.current)) {
        document.body.removeChild(containerRef.current);
      }
      if (textureRef.current) textureRef.current.dispose();
    };
  }, []);

  return textureRef;
}

// ── Test Pattern Texture ──────────────────────────────────────────
// Creates a very obvious test pattern to verify the texture pipeline
function createTestPatternTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Bright green background
  ctx.fillStyle = '#00FF00';
  ctx.fillRect(0, 0, 256, 256);

  // Red rectangle top-left
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(10, 10, 60, 60);

  // Blue rectangle bottom-right
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(186, 186, 60, 60);

  // Large black text "HELLO" centered
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HELLO', 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// ── 3D Model Component (inside Canvas) ───────────────────────────
interface TamaModelProps {
  isInspectMode: boolean;
  animToPlay: string | null;
  onAnimDone: () => void;
  lcdTextureRef: React.MutableRefObject<any>;
}

function TamaModel({ isInspectMode, animToPlay, onAnimDone, lcdTextureRef }: TamaModelProps) {
  const glbUrl = typeof GLB_ASSET === 'string' ? GLB_ASSET
    : GLB_ASSET?.default ? GLB_ASSET.default
    : GLB_ASSET?.uri ? GLB_ASSET.uri
    : String(GLB_ASSET);

  const gltf = useGLTF(glbUrl);
  const { actions } = useAnimations(gltf.animations, gltf.scene);
  const screenPlaneRef = useRef<THREE.Mesh | null>(null);
  const testTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Find the screen mesh, hide it, and create a replacement plane with proper UVs
  useEffect(() => {
    let screenMesh: THREE.Mesh | null = null;

    // Find the screen mesh by name or material
    gltf.scene.traverse((child: any) => {
      if (!child.isMesh) return;
      // Match by mesh name or material name
      if (child.name === 'Sphere068_2' ||
          (child.material && (
            (Array.isArray(child.material) && child.material.some((m: any) => m.name?.includes('LCD'))) ||
            (!Array.isArray(child.material) && child.material.name?.includes('LCD'))
          ))) {
        screenMesh = child as THREE.Mesh;
      }
    });

    if (!screenMesh) {
      console.error('[LCD] Could not find screen mesh (Sphere068_2 / LCD_UI.031)');
      return;
    }

    console.log('[LCD] Found screen mesh:', (screenMesh as any).name);

    // Get bounding box of the original screen mesh
    const bbox = new THREE.Box3().setFromObject(screenMesh);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    bbox.getCenter(center);
    bbox.getSize(size);

    console.log('[LCD] Screen bbox center:', center, 'size:', size);

    // Hide the original mesh
    (screenMesh as THREE.Mesh).visible = false;

    // Create test pattern texture
    const testTexture = createTestPatternTexture();
    testTextureRef.current = testTexture;

    // Create a replacement plane with proper UVs
    // Use the bounding box dimensions — the screen is roughly rectangular
    // Use the largest two dimensions for width/height
    const dims = [size.x, size.y, size.z].sort((a, b) => b - a);
    const planeW = dims[0] * 1.0;  // Width
    const planeH = dims[1] * 1.0;  // Height

    const planeGeo = new THREE.PlaneGeometry(planeW, planeH);
    const planeMat = new THREE.MeshBasicMaterial({
      map: testTexture,
      side: THREE.DoubleSide,
      toneMapped: false, // Prevent tone mapping from dimming colors
    });

    const plane = new THREE.Mesh(planeGeo, planeMat);

    // Convert center to the parent's local space
    const parent = (screenMesh as THREE.Mesh).parent;
    if (parent) {
      // center is in world space, convert to parent's local space
      const localCenter = parent.worldToLocal(center.clone());
      plane.position.copy(localCenter);
    } else {
      plane.position.copy(center);
    }

    // Determine the plane's orientation based on the thinnest dimension
    // The thinnest dimension is the "depth" axis — the plane should face that direction
    const sizeArr = [
      { axis: 'x', val: size.x },
      { axis: 'y', val: size.y },
      { axis: 'z', val: size.z },
    ].sort((a, b) => a.val - b.val);
    const thinAxis = sizeArr[0].axis;

    // Orient the plane to face the thin axis
    if (thinAxis === 'z') {
      // Default PlaneGeometry faces +Z, so no rotation needed
      // But push it slightly forward to avoid z-fighting
      plane.position.z = center.z + size.z * 0.5 + 0.001;
    } else if (thinAxis === 'x') {
      plane.rotation.y = Math.PI / 2;
      plane.position.x = center.x + size.x * 0.5 + 0.001;
    } else if (thinAxis === 'y') {
      plane.rotation.x = Math.PI / 2;
      plane.position.y = center.y + size.y * 0.5 + 0.001;
    }

    plane.name = 'LCD_ReplacementPlane';

    // Add to the parent (or scene root)
    if (parent) {
      parent.add(plane);
    } else {
      gltf.scene.add(plane);
    }

    screenPlaneRef.current = plane;
    console.log('[LCD] Replacement plane created and added. Dims:', planeW, 'x', planeH);

    return () => {
      // Cleanup
      if (plane.parent) plane.parent.remove(plane);
      planeGeo.dispose();
      planeMat.dispose();
      testTexture.dispose();
    };
  }, [gltf]);

  // Update the plane's texture from the LCD capture when available
  useFrame(() => {
    if (screenPlaneRef.current && lcdTextureRef.current) {
      const mat = screenPlaneRef.current.material as THREE.MeshBasicMaterial;
      // Switch from test pattern to live LCD capture
      if (mat.map !== lcdTextureRef.current) {
        mat.map = lcdTextureRef.current;
        mat.needsUpdate = true;
      }
      lcdTextureRef.current.needsUpdate = true;
    }
  });

  // Play button animations
  useEffect(() => {
    if (!animToPlay || !actions) return;
    const action = actions[animToPlay];
    if (action) {
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();

      const onFinished = () => {
        onAnimDone();
      };
      const mixer = action.getMixer();
      mixer.addEventListener('finished', onFinished);
      return () => {
        mixer.removeEventListener('finished', onFinished);
      };
    }
  }, [animToPlay, actions, onAnimDone]);

  return (
    <primitive
      object={gltf.scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

// ── Scene wrapper (lights + controls + model) ────────────────────
interface SceneProps {
  isInspectMode: boolean;
  animToPlay: string | null;
  onAnimDone: () => void;
  lcdTextureRef: React.MutableRefObject<any>;
}

function Scene({ isInspectMode, animToPlay, onAnimDone, lcdTextureRef }: SceneProps) {
  const controlsRef = useRef<any>(null);

  // Reset camera when exiting inspect mode
  useEffect(() => {
    if (!isInspectMode && controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [isInspectMode]);

  return (
    <>
      {/* Lighting — bright, warm, even (product photography style) */}
      <ambientLight intensity={1.5} color="#FFFFFF" />
      <directionalLight
        position={[0, 3, 5]}
        intensity={2.0}
        color="#FFF8F0"
        castShadow={false}
      />
      <directionalLight
        position={[0, -2, 3]}
        intensity={1.0}
        color="#FFFFFF"
      />
      <directionalLight
        position={[-3, 1, 2]}
        intensity={0.5}
        color="#F0F0FF"
      />

      {/* Camera controls */}
      <OrbitControls
        ref={controlsRef}
        enabled={isInspectMode}
        enablePan={false}
        enableZoom={isInspectMode}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        // Prevent click-through: only drag should orbit
        enableDamping
        dampingFactor={0.1}
      />

      {/* The tamagotchi model */}
      <TamaModel
        isInspectMode={isInspectMode}
        animToPlay={animToPlay}
        onAnimDone={onAnimDone}
        lcdTextureRef={lcdTextureRef}
      />
    </>
  );
}

// ── Main EggShell Component ──────────────────────────────────────
const EggShell: React.FC<EggShellProps> = ({
  onLeftPress,
  onMiddlePress,
  onRightPress,
  isInspectMode,
  onToggleInspect,
}) => {
  const [animToPlay, setAnimToPlay] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // useLCDTexture is always called (hooks can't be conditional), but it
  // no-ops internally when Platform.OS !== 'web'
  const lcdTextureRef = useLCDTexture();

  // Button press handler
  const handleButtonPress = useCallback(
    (buttonId: ButtonId, handler: () => void) => {
      playButtonClick();
      triggerHaptic('light');

      // Trigger GLB button animation
      const animName = ANIM_MAP[buttonId];
      if (animName) {
        setAnimToPlay(animName);
      }

      // Fire game action after short delay
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        handler();
        timeoutRef.current = null;
      }, 120);
    },
    [],
  );

  const handleAnimDone = useCallback(() => {
    setAnimToPlay(null);
  }, []);

  const handleLeft = useCallback(
    () => handleButtonPress('left', onLeftPress),
    [handleButtonPress, onLeftPress],
  );
  const handleMiddle = useCallback(
    () => handleButtonPress('middle', onMiddlePress),
    [handleButtonPress, onMiddlePress],
  );
  const handleRight = useCallback(
    () => handleButtonPress('right', onRightPress),
    [handleButtonPress, onRightPress],
  );

  const handlerMap: Record<string, () => void> = {
    onLeftPress: handleLeft,
    onMiddlePress: handleMiddle,
    onRightPress: handleRight,
  };

  // Keyboard support
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        onToggleInspect();
        return;
      }
      if (isInspectMode) return;

      switch (e.key) {
        case 'a': case 'A': case 'ArrowLeft':
          e.preventDefault(); handleLeft(); break;
        case 's': case 'S': case 'ArrowDown': case 'Enter': case ' ':
          e.preventDefault(); handleMiddle(); break;
        case 'd': case 'D': case 'ArrowRight': case 'Escape':
          e.preventDefault(); handleRight(); break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleLeft, handleMiddle, handleRight, isInspectMode, onToggleInspect]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.outerWrapper}>
        <View style={styles.container}>
          <Text style={styles.fallbackText}>3D view requires web platform</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.container}>
        {/* Layer 0: R3F Canvas (always on) */}
        <div style={{
          width: '100%',
          height: '100%',
          position: 'absolute' as any,
          top: 0,
          left: 0,
          zIndex: 0,
        }}>
          <Canvas
            camera={{ position: [0, 0.5, 5], fov: 35 }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
            gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
            onCreated={({ gl }) => {
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.NoToneMapping;
            }}
          >
            <Scene
              isInspectMode={isInspectMode}
              animToPlay={animToPlay}
              onAnimDone={handleAnimDone}
              lcdTextureRef={lcdTextureRef}
            />
          </Canvas>
        </div>

        {/* Layer 2: Invisible button touch targets (disabled in inspect mode) */}
        {!isInspectMode &&
          BUTTONS.map((btn) => (
            <Pressable
              key={btn.id}
              onPress={handlerMap[btn.handler]}
              style={[
                styles.btnHit,
                {
                  left: `${btn.left}%` as any,
                  top: `${btn.top}%` as any,
                  width: `${BTN_SIZE_PCT}%` as any,
                  height: `${BTN_SIZE_PCT}%` as any,
                  borderRadius: 999,
                },
              ]}
            />
          ))}

        {/* Inspect mode indicator */}
        {isInspectMode && (
          <View style={styles.inspectBadge} pointerEvents="none">
            <Text style={styles.inspectBadgeText}>🔍 Drag to rotate</Text>
          </View>
        )}
      </View>

      {/* Toggle button */}
      <TouchableOpacity
        onPress={onToggleInspect}
        style={styles.toggleButton}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleText}>
          {isInspectMode ? '🎮 Play' : '🔍 Inspect'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
  },
  container: {
    width: VIEWER_W,
    height: VIEWER_H,
    position: 'relative' as const,
  },
  fallbackText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 14,
  },
  btnHit: {
    position: 'absolute',
    zIndex: 2,
  },
  inspectBadge: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    left: '50%' as any,
    transform: [{ translateX: -60 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 3,
  },
  inspectBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  toggleButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 115, 85, 0.15)',
  },
  toggleText: {
    fontSize: 13,
    color: '#8B7355',
    fontWeight: '500',
  },
});

export default EggShell;
