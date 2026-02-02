/* eslint-disable react/react-in-jsx-scope */
import { createRoute } from '@granite-js/react-native';
import { WebView } from '@granite-js/native/react-native-webview';
import { StyleSheet, View } from 'react-native';
import { config } from '../config';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: config.webUrl }}
        style={styles.webview}
        scalesPageToFit={false}
        injectedJavaScript={`
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
          const existingMeta = document.querySelector('meta[name="viewport"]');
          if (existingMeta) {
            existingMeta.setAttribute('content', meta.content);
          } else {
            document.head.appendChild(meta);
          }

          document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
              e.preventDefault();
            }
          }, { passive: false });

          document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
          });

          true;
        `}
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
