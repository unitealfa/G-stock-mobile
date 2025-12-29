import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';

export default function SettingsScreen({ navigation }) {
    const { language, changeLanguage, t, isRTL } = useContext(LanguageContext);

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#1a1a2e', '#16213e']} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={28} color="#fff" />
                </TouchableOpacity>
                <Ionicons name="settings-outline" size={32} color="#fff" />
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="language-outline" size={24} color="#8892b0" />
                    <Text style={styles.sectionTitle}>{t('language')}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.option, language === 'ar' && styles.optionActive]}
                    onPress={() => changeLanguage('ar')}
                >
                    <Text style={[styles.optionText, language === 'ar' && styles.optionTextActive]}>
                        العربية
                    </Text>
                    {language === 'ar' && <Ionicons name="checkmark-circle" size={24} color="#64ffda" />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.option, language === 'fr' && styles.optionActive]}
                    onPress={() => changeLanguage('fr')}
                >
                    <Text style={[styles.optionText, language === 'fr' && styles.optionTextActive]}>
                        Français
                    </Text>
                    {language === 'fr' && <Ionicons name="checkmark-circle" size={24} color="#64ffda" />}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginTop: 40,
        marginBottom: 40
    },
    backBtn: { padding: 5 },
    section: { marginBottom: 30 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15
    },
    sectionTitle: { color: '#8892b0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 18,
        borderRadius: 12,
        marginBottom: 10
    },
    optionActive: {
        backgroundColor: 'rgba(100, 255, 218, 0.1)',
        borderWidth: 1,
        borderColor: '#64ffda'
    },
    optionText: { color: '#ccd6f6', fontSize: 18 },
    optionTextActive: { color: '#64ffda', fontWeight: '600' }
});
