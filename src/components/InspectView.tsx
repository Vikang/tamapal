import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';

// GLB asset — Expo bundler resolves this to a URL on web
const GLB_ASSET = require('../assets/tamagotchi.glb');

export default function InspectView() {
  const containerIdRef = useRef(`inspect-${Date.now()}`);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const containerId = containerIdRef.current;

    // Load model-viewer script from CDN
    const loadModelViewer = (): Promise<void> =>
      new Promise((resolve, reject) => {
        if (customElements.get('model-viewer')) { resolve(); return; }
        const s = document.createElement('script');
        s.type = 'module';
        s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
        s.onload = () => resolve();
        s.onerror = reject;
        document.head.appendChild(s);
      });

    (async () => {
      await loadModelViewer();

      const container = document.getElementById(containerId);
      if (!container) return;

      // Resolve GLB URL
      let url: string;
      if (typeof GLB_ASSET === 'string') url = GLB_ASSET;
      else if (GLB_ASSET?.default) url = GLB_ASSET.default;
      else if (GLB_ASSET?.uri) url = GLB_ASSET.uri;
      else url = String(GLB_ASSET);

      // Create model-viewer element
      const mv = document.createElement('model-viewer');
      mv.setAttribute('src', url);
      mv.setAttribute('camera-controls', '');
      mv.setAttribute('disable-zoom', '');
      mv.setAttribute('interaction-prompt', 'none');
      mv.setAttribute('camera-orbit', '0deg 90deg 4m');
      mv.setAttribute('min-camera-orbit', 'auto 30deg auto');
      mv.setAttribute('max-camera-orbit', 'auto 150deg auto');
      mv.setAttribute('environment-image', 'neutral');
      mv.setAttribute('shadow-intensity', '0');
      mv.setAttribute('exposure', '1.2');
      mv.style.width = '100%';
      mv.style.height = '100%';
      mv.style.backgroundColor = 'transparent';
      mv.style.setProperty('--poster-color', 'transparent');

      container.appendChild(mv);
    })();

    return () => {
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = '';
    };
  }, []);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.fallback}>Inspect mode requires web</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <div
        id={containerIdRef.current}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%' as any,
    height: '100%' as any,
  },
  fallback: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
});
