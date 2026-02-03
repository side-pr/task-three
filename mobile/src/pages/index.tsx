/* eslint-disable react/react-in-jsx-scope */
import { createRoute } from '@granite-js/react-native';
import { WebView } from '@granite-js/native/react-native-webview';
import { StyleSheet, View } from 'react-native';
import { config } from '../config';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const preventZoomScript = `
    (function() {
      // CSS로 줌 방지
      var style = document.createElement('style');
      style.textContent = '* { touch-action: pan-x pan-y; }';
      document.head.appendChild(style);

      // viewport 메타 태그 설정
      var meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

      // 핀치 줌 제스처 차단
      document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
      document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });
      document.addEventListener('gestureend', function(e) { e.preventDefault(); }, { passive: false });

      // 더블탭 줌 방지
      var lastTouchEnd = 0;
      document.addEventListener('touchend', function(e) {
        var now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, { passive: false });

      // 멀티터치 줌 방지
      document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });

      true;
    })();
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: config.webUrl }}
        style={styles.webview}
        scalesPageToFit={false}
        injectedJavaScriptBeforeContentLoaded={preventZoomScript}
        injectedJavaScript={preventZoomScript}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
