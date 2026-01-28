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
      <WebView source={{ uri: config.webUrl }} style={styles.webview} />
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
