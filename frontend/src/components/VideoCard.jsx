import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export function VideoCard({ driveId, youtubeId, titulo = 'Vídeo demonstrativo' }) {
  if (!driveId && !youtubeId) return null;

  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0`
    : `https://drive.google.com/file/d/${driveId}/preview`;

  return (
    <View style={styles.playerContainer}>
      {Platform.OS === 'web' ? (
        <iframe
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title={titulo}
        />
      ) : (
        <WebView
          source={{ uri: embedUrl }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginVertical: 12,
  },
  webview: {
    flex: 1,
  },
});