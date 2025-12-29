import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.38;

export default function HomeScreen({ navigation }) {
    const { isRTL } = useContext(LanguageContext);

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0a0a0a', '#1a1a2e', '#16213e']} style={StyleSheet.absoluteFill} />

            {/* Settings Button */}
            <TouchableOpacity
                style={[styles.settingsBtn, isRTL ? { left: 20 } : { right: 20 }]}
                onPress={() => navigation.navigate('Settings')}
            >
                <Ionicons name="settings-outline" size={26} color="#8892b0" />
            </TouchableOpacity>

            {/* Main Buttons Grid */}
            <View style={styles.grid}>
                {/* ADD */}
                <TouchableOpacity
                    style={styles.mainButton}
                    onPress={() => navigation.navigate('AddProduct')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="add-circle-outline" size={50} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* SELL */}
                <TouchableOpacity
                    style={styles.mainButton}
                    onPress={() => navigation.navigate('SellProduct')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#f093fb', '#f5576c']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="cart-outline" size={50} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* VIEW */}
                <TouchableOpacity
                    style={[styles.mainButton, styles.wideButton]}
                    onPress={() => navigation.navigate('ViewStock')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#4facfe', '#00f2fe']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="layers-outline" size={50} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    settingsBtn: {
        position: 'absolute',
        top: 50,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
        paddingHorizontal: 20
    },
    mainButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: 28,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20
    },
    wideButton: {
        width: BUTTON_SIZE * 2 + 20
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
