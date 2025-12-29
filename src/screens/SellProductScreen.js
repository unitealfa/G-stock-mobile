import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';
import { StockContext } from '../context/StockContext';

export default function SellProductScreen({ navigation }) {
    const { products, sellProduct } = useContext(StockContext);
    const { t, isRTL } = useContext(LanguageContext);
    const [permission, requestPermission] = useCameraPermissions();

    const [cameraVisible, setCameraVisible] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(0);

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const calculateSellPrice = (buyPrice) => {
        return Math.ceil((buyPrice * 1.30) * 2) / 2;
    };

    const handleBarCodeScanned = ({ data }) => {
        const product = products.find(p => p.barcode === data);
        if (product) {
            setCameraVisible(false);
            selectProduct(product);
        } else {
            Alert.alert(t('notFound'), t('barcodeNotFound'));
            setCameraVisible(false);
        }
    };

    const selectProduct = (product) => {
        setSelectedProduct(product);
        const price = product.sellPrice > 0 ? product.sellPrice : calculateSellPrice(product.buyPrice);
        setCalculatedPrice(price);
    };

    const confirmSell = async () => {
        if (selectedProduct) {
            await sellProduct(selectedProduct.id, 1);
            Alert.alert(t('sold'), `${selectedProduct.name} - ${calculatedPrice.toFixed(2)}`);
            setSelectedProduct(null);
            setCameraVisible(true);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderProductItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => selectProduct(item)}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
            ) : (
                <View style={styles.itemPlaceholder}>
                    <Ionicons name="cube-outline" size={24} color="#555" />
                </View>
            )}
            <View style={[styles.itemInfo, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.quantity}</Text>
            </View>
        </TouchableOpacity>
    );

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Ionicons name="camera-outline" size={60} color="#666" />
                <TouchableOpacity onPress={requestPermission} style={styles.permBtn}>
                    <Text style={styles.permText}>{t('grant')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Camera View
    if (cameraVisible) {
        return (
            <View style={styles.container}>
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    onBarcodeScanned={handleBarCodeScanned}
                />
                <View style={styles.overlay}>
                    <View style={styles.scanFrame}>
                        <Ionicons name="scan-outline" size={100} color="rgba(255,255,255,0.5)" />
                    </View>
                    <TouchableOpacity style={styles.manualBtn} onPress={() => setCameraVisible(false)}>
                        <Ionicons name="search-outline" size={24} color="#1a1a2e" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Search View
    if (!selectedProduct) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#0a0a0a', '#1a1a2e']} style={StyleSheet.absoluteFill} />

                <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCameraVisible(true)}>
                        <Ionicons name="scan-outline" size={28} color="#f093fb" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.searchRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="search-outline" size={22} color="#8892b0" />
                    <TextInput
                        style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
                        placeholder={t('search')}
                        placeholderTextColor="#555"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    data={filteredProducts}
                    keyExtractor={item => item.id}
                    renderItem={renderProductItem}
                    contentContainerStyle={{ padding: 15 }}
                />
            </View>
        );
    }

    // Sell Confirmation View
    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0a0a0a', '#16213e']} style={StyleSheet.absoluteFill} />

            <View style={styles.confirmCard}>
                {selectedProduct.image ? (
                    <Image source={{ uri: selectedProduct.image }} style={styles.confirmImage} />
                ) : (
                    <View style={styles.confirmPlaceholder}>
                        <Ionicons name="cube-outline" size={60} color="#555" />
                    </View>
                )}

                <Text style={styles.confirmTitle}>{selectedProduct.name}</Text>

                <View style={styles.priceCard}>
                    <View style={styles.priceItem}>
                        <Ionicons name="trending-down-outline" size={24} color="#8892b0" />
                        <Text style={styles.priceValue}>{selectedProduct.buyPrice}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={24} color="#555" />
                    <View style={styles.priceItem}>
                        <Ionicons name="trending-up-outline" size={24} color="#64ffda" />
                        <Text style={[styles.priceValue, { color: '#64ffda' }]}>{calculatedPrice.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.stockBadge}>
                    <Ionicons name="cube-outline" size={18} color="#8892b0" />
                    <Text style={styles.stockText}>{selectedProduct.quantity}</Text>
                </View>

                <TouchableOpacity style={styles.sellBtn} onPress={confirmSell}>
                    <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.sellBtnGradient}>
                        <Ionicons name="checkmark-circle-outline" size={32} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={() => { setSelectedProduct(null); setCameraVisible(true); }}>
                    <Ionicons name="close-circle-outline" size={32} color="#555" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
    permBtn: { marginTop: 20, padding: 15, backgroundColor: '#f093fb', borderRadius: 10 },
    permText: { color: '#fff', fontWeight: 'bold' },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scanFrame: { marginBottom: 50 },
    manualBtn: {
        backgroundColor: '#fff',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    backBtn: { padding: 5 },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        marginHorizontal: 15,
        borderRadius: 12,
        paddingHorizontal: 15
    },
    searchInput: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 15 },
    item: {
        flexDirection: 'row',
        backgroundColor: '#1a1a2e',
        padding: 12,
        marginBottom: 10,
        borderRadius: 12,
        alignItems: 'center'
    },
    itemImage: { width: 50, height: 50, borderRadius: 10 },
    itemPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#2a2a4e',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemInfo: { flex: 1, marginLeft: 15 },
    itemName: { color: '#fff', fontSize: 16, fontWeight: '600' },
    itemQty: { color: '#8892b0', fontSize: 14 },
    confirmCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    confirmImage: { width: 150, height: 150, borderRadius: 25, marginBottom: 20 },
    confirmPlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 25,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    confirmTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
    priceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20
    },
    priceItem: { alignItems: 'center', gap: 5 },
    priceValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 30
    },
    stockText: { color: '#8892b0', fontSize: 16 },
    sellBtn: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 15 },
    sellBtnGradient: { padding: 18, alignItems: 'center' },
    cancelBtn: { padding: 10 }
});
