import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useState } from 'react';
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';
import { StockContext } from '../context/StockContext';

export default function ViewStockScreen({ navigation }) {
    const { products, deleteProduct, updateProduct } = useContext(StockContext);
    const { t, isRTL } = useContext(LanguageContext);
    const [editingProduct, setEditingProduct] = useState(null);

    const [editName, setEditName] = useState('');
    const [editBuyPrice, setEditBuyPrice] = useState('');
    const [editQty, setEditQty] = useState('');
    const [editMargin, setEditMargin] = useState('30');
    const [editSellPrice, setEditSellPrice] = useState('');

    const handleDelete = (product) => {
        Alert.alert(
            t('delete'),
            t('deleteConfirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                { text: t('delete'), style: 'destructive', onPress: () => deleteProduct(product.id) }
            ]
        );
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setEditName(product.name);
        setEditBuyPrice(String(product.buyPrice));
        setEditQty(String(product.quantity));

        let currentSell = product.sellPrice;
        if (!currentSell || currentSell === 0) {
            currentSell = Math.ceil((product.buyPrice * 1.30) * 2) / 2;
        }
        setEditSellPrice(String(currentSell));
        const margin = ((currentSell / product.buyPrice) - 1) * 100;
        setEditMargin(margin.toFixed(0));
    };

    const handleSaveEdit = () => {
        if (editingProduct) {
            updateProduct(editingProduct.id, {
                name: editName,
                buyPrice: parseFloat(editBuyPrice),
                quantity: parseInt(editQty),
                sellPrice: parseFloat(editSellPrice)
            });
            setEditingProduct(null);
            Alert.alert(t('success'), t('productUpdated'));
        }
    };

    const onChangeBuyPrice = (val) => {
        setEditBuyPrice(val);
        const buy = parseFloat(val);
        const margin = parseFloat(editMargin);
        if (!isNaN(buy) && !isNaN(margin)) {
            const newSell = Math.ceil((buy * (1 + margin / 100)) * 2) / 2;
            setEditSellPrice(String(newSell));
        }
    };

    const onChangeMargin = (val) => {
        setEditMargin(val);
        const margin = parseFloat(val);
        const buy = parseFloat(editBuyPrice);
        if (!isNaN(buy) && !isNaN(margin)) {
            const newSell = Math.ceil((buy * (1 + margin / 100)) * 2) / 2;
            setEditSellPrice(String(newSell));
        }
    };

    const onChangeSellPrice = (val) => {
        setEditSellPrice(val);
        const sell = parseFloat(val);
        const buy = parseFloat(editBuyPrice);
        if (!isNaN(buy) && !isNaN(sell) && buy > 0) {
            const newMargin = ((sell / buy) - 1) * 100;
            setEditMargin(newMargin.toFixed(0));
        }
    };

    const calculateSellPrice = (buyPrice) => {
        return Math.ceil((buyPrice * 1.30) * 2) / 2;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onLongPress={() => handleDelete(item)}
            onPress={() => openEdit(item)}
        >
            <View style={[styles.row, isRTL && { flexDirection: 'row-reverse' }]}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderImg}>
                        <Ionicons name="cube-outline" size={30} color="#555" />
                    </View>
                )}
                <View style={[styles.info, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={[styles.badges, isRTL && { flexDirection: 'row-reverse' }]}>
                        <View style={styles.badge}>
                            <Ionicons name="cube-outline" size={14} color="#8892b0" />
                            <Text style={styles.badgeText}>{item.quantity}</Text>
                        </View>
                        <View style={styles.badge}>
                            <Ionicons name="trending-up-outline" size={14} color="#64ffda" />
                            <Text style={[styles.badgeText, { color: '#64ffda' }]}>
                                {item.sellPrice ? item.sellPrice.toFixed(2) : calculateSellPrice(item.buyPrice).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0a0a0a', '#1a1a2e']} style={StyleSheet.absoluteFill} />

            <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={28} color="#fff" />
                </TouchableOpacity>
                <Ionicons name="layers-outline" size={32} color="#4facfe" />
            </View>

            <FlatList
                data={products}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="cube-outline" size={60} color="#333" />
                        <Text style={styles.emptyText}>{t('noProducts')}</Text>
                    </View>
                }
            />

            {/* Edit Modal */}
            <Modal visible={!!editingProduct} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="create-outline" size={28} color="#4facfe" />
                        </View>

                        <View style={[styles.inputRow, isRTL && { flexDirection: 'row-reverse' }]}>
                            <Ionicons name="pricetag-outline" size={20} color="#8892b0" />
                            <TextInput
                                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder={t('productName')}
                                placeholderTextColor="#555"
                            />
                        </View>

                        <View style={styles.twoCol}>
                            <View style={[styles.inputRow, { flex: 1 }]}>
                                <Ionicons name="cash-outline" size={20} color="#8892b0" />
                                <TextInput
                                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                    value={editBuyPrice}
                                    onChangeText={onChangeBuyPrice}
                                    keyboardType="numeric"
                                    placeholder={t('buyPrice')}
                                    placeholderTextColor="#555"
                                />
                            </View>
                            <View style={[styles.inputRow, { flex: 1 }]}>
                                <Ionicons name="cube-outline" size={20} color="#8892b0" />
                                <TextInput
                                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                    value={editQty}
                                    onChangeText={setEditQty}
                                    keyboardType="numeric"
                                    placeholder={t('quantity')}
                                    placeholderTextColor="#555"
                                />
                            </View>
                        </View>

                        <View style={styles.twoCol}>
                            <View style={[styles.inputRow, { flex: 1 }]}>
                                <Ionicons name="trending-up-outline" size={20} color="#8892b0" />
                                <TextInput
                                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                                    value={editMargin}
                                    onChangeText={onChangeMargin}
                                    keyboardType="numeric"
                                    placeholder="%"
                                    placeholderTextColor="#555"
                                />
                            </View>
                            <View style={[styles.inputRow, { flex: 1, borderColor: '#64ffda', borderWidth: 1 }]}>
                                <Ionicons name="pricetags-outline" size={20} color="#64ffda" />
                                <TextInput
                                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left', color: '#64ffda' }]}
                                    value={editSellPrice}
                                    onChangeText={onChangeSellPrice}
                                    keyboardType="numeric"
                                    placeholder={t('sellPrice')}
                                    placeholderTextColor="#555"
                                />
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingProduct(null)}>
                                <Ionicons name="close-outline" size={28} color="#888" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                                <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.saveBtnGradient}>
                                    <Ionicons name="checkmark-outline" size={28} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    backBtn: { padding: 5 },
    card: {
        backgroundColor: '#1a1a2e',
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden'
    },
    row: { flexDirection: 'row', padding: 12, alignItems: 'center' },
    image: { width: 60, height: 60, borderRadius: 12 },
    placeholderImg: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#2a2a4e',
        justifyContent: 'center',
        alignItems: 'center'
    },
    info: { flex: 1, marginLeft: 15 },
    name: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 8 },
    badges: { flexDirection: 'row', gap: 12 },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    badgeText: { color: '#8892b0', fontSize: 14 },
    empty: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#555', marginTop: 15 },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1a1a2e', padding: 20, borderRadius: 20 },
    modalHeader: { alignItems: 'center', marginBottom: 20 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a4e',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 12
    },
    input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 14 },
    twoCol: { flexDirection: 'row', gap: 12 },
    modalButtons: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 15 },
    cancelBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2a2a4e',
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveBtn: { borderRadius: 30, overflow: 'hidden' },
    saveBtnGradient: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }
});
