import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Mapa from './screens/Mapa';

export default function App() {
  return (
    <View style={styles.container}>
      <Mapa />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});