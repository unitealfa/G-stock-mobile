import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { LanguageProvider } from './src/context/LanguageContext';
import { StockProvider } from './src/context/StockContext';
import Navigation from './src/Navigation';

export default function App() {
    return (
        <LanguageProvider>
            <StockProvider>
                <View style={styles.container}>
                    <Navigation />
                    <StatusBar style="light" />
                </View>
            </StockProvider>
        </LanguageProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
});
