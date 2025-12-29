import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';
import { StockContext } from '../context/StockContext';

export default function AddProductScreen({ navigation }) {
    const { addProduct } = useContext(StockContext);
    const { t, isRTL } = useContext(LanguageContext);
    const [permission, requestPermission] = useCameraPermissions();

    const [name, setName] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [barcode, setBarcode] = useState('');
    const [image, setImage] = useState(null);

    const [cameraVisible, setCameraVisible] = useState(false);
    const [cameraMode, setCameraMode] = useState('barcode');
    const [cameraRef, setCameraRef] = useState(null);

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleSave = async () => {
        if (!name || !buyPrice || !quantity) {
            Alert.alert(t('error'), t('fillAllFields'));
            return;
        }

        let finalImageUri = image;
        if (image) {
            try {
                const fileName = image.split('/').pop();
                const newPath = FileSystem.documentDirectory + fileName;
                await FileSystem.moveAsync({ from: image, to: newPath });
                finalImageUri = newPath;
            } catch (error) {
                console.log("Error moving file:", error);
            }
        }

        const product = {
            name,
            buyPrice: parseFloat(buyPrice),
            quantity: parseInt(quantity),
            image: finalImageUri,
            barcode,
            sellPrice: Math.ceil((parseFloat(buyPrice) * 1.30) * 2) / 2
        };

        addProduct(product);
        Alert.alert(t('success'), t('productAdded'));
        navigation.goBack();
    };

    const handleBarCodeScanned = ({ data }) => {
        setBarcode(data);
        setCameraVisible(false);
    };

    const takePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            setImage(photo.uri);
            setCameraVisible(false);
        }
    };

    const openCamera = (mode) => {
        setCameraMode(mode);
        setCameraVisible(true);
    };

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

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0a0a0a', '#1a1a2e']} style={StyleSheet.absoluteFill} />

            {/* Header */}
            <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={28} color="#fff" />
                </TouchableOpacity>
                <Ionicons name="add-circle-outline" size={32} color="#667eea" />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Photo */}
                <TouchableOpacity onPress={() => openCamera('photo')} style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.productImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="camera-outline" size={40} color="#555" />
                        </View>
                    )}
                </TouchableOpacity>

                {/* Barcode Row */}
                <View style={[styles.inputRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={styles.inputIcon}>
                        <Ionicons name="barcode-outline" size={22} color="#8892b0" />
                    </View>
                    <TextInput
                        style={[styles.input, { flex: 1, textAlign: isRTL ? 'right' : 'left' }]}
                        placeholder={t('barcode')}
                        placeholderTextColor="#555"
                        value={barcode}
                        onChangeText={setBarcode}
                    />
                    <TouchableOpacity style={styles.scanBtn} onPress={() => openCamera('barcode')}>
                        <Ionicons name="scan-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Name */}
                <View style={[styles.inputRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={styles.inputIcon}>
                        <Ionicons name="pricetag-outline" size={22} color="#8892b0" />
                    </View>
                    <TextInput
                        style={[styles.input, { flex: 1, textAlign: isRTL ? 'right' : 'left' }]}
                        placeholder={t('productName')}
                        placeholderTextColor="#555"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Price & Qty Row */}
                <View style={[styles.twoCol, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={[styles.inputRow, { flex: 1 }]}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="cash-outline" size={22} color="#8892b0" />
                        </View>
                        <TextInput
                            style={[styles.input, { flex: 1, textAlign: isRTL ? 'right' : 'left' }]}
                            placeholder={t('buyPrice')}
                            placeholderTextColor="#555"
                            keyboardType="numeric"
                            value={buyPrice}
                            onChangeText={setBuyPrice}
                        />
                    </View>
                    <View style={[styles.inputRow, { flex: 1 }]}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="cube-outline" size={22} color="#8892b0" />
                        </View>
                        <TextInput
                            style={[styles.input, { flex: 1, textAlign: isRTL ? 'right' : 'left' }]}
                            placeholder={t('quantity')}
                            placeholderTextColor="#555"
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={setQuantity}
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.saveBtnGradient}>
                        <Ionicons name="checkmark-circle-outline" size={28} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>

            {/* Camera Modal */}
            <Modal visible={cameraVisible} animationType="slide">
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    ref={ref => setCameraRef(ref)}
                    onBarcodeScanned={cameraMode === 'barcode' ? handleBarCodeScanned : undefined}
                    barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "ean8", "upc_e", "code128"] }}
                >
                    <View style={styles.cameraOverlay}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setCameraVisible(false)}>
                            <Ionicons name="close-circle" size={40} color="#fff" />
                        </TouchableOpacity>
                        {cameraMode === 'photo' && (
                            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                                <View style={styles.captureInner} />
                            </TouchableOpacity>
                        )}
                    </View>
                </CameraView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
    permBtn: { marginTop: 20, padding: 15, backgroundColor: '#667eea', borderRadius: 10 },
    permText: { color: '#fff', fontWeight: 'bold' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    backBtn: { padding: 5 },
    scrollContent: { padding: 20 },
    imageContainer: { alignItems: 'center', marginBottom: 25 },
    productImage: { width: 120, height: 120, borderRadius: 20 },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 20,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2a2a4e',
        borderStyle: 'dashed'
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden'
    },
    inputIcon: { padding: 15 },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        paddingVertical: 15,
        paddingHorizontal: 5
    },
    scanBtn: {
        padding: 15,
        backgroundColor: '#667eea'
    },
    twoCol: { flexDirection: 'row', gap: 12 },
    saveBtn: { marginTop: 20, borderRadius: 16, overflow: 'hidden' },
    saveBtnGradient: { padding: 18, alignItems: 'center' },
    cameraOverlay: { flex: 1, justifyContent: 'space-between', padding: 30 },
    closeBtn: { alignSelf: 'flex-start' },
    captureBtn: {
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    captureInner: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#fff' }
});
