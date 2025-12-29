import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const LanguageContext = createContext();

const translations = {
    ar: {
        // Home
        appName: 'جي-ستوك',
        add: 'إضافة',
        sell: 'بيع',
        view: 'عرض',
        settings: 'إعدادات',

        // Add Product
        addProduct: 'إضافة منتج',
        scanOrType: 'مسح أو كتابة...',
        productName: 'اسم المنتج',
        buyPrice: 'سعر الشراء',
        quantity: 'الكمية',
        save: 'حفظ',
        scan: 'مسح',
        tapToAddPhoto: 'اضغط لإضافة صورة',
        barcode: 'الباركود',

        // Sell
        sellProduct: 'بيع منتج',
        scanning: 'جاري المسح...',
        searchManually: 'بحث يدوي',
        search: 'بحث...',
        confirmSell: 'تأكيد البيع',
        cancel: 'إلغاء',
        inStock: 'في المخزن',
        sellingPrice: 'سعر البيع',
        buyingPrice: 'سعر الشراء',

        // View
        myStock: 'مخزني',
        noProducts: 'لا توجد منتجات',
        edit: 'تعديل',
        delete: 'حذف',
        deleteConfirm: 'هل أنت متأكد من الحذف؟',
        margin: 'الهامش %',
        sellPrice: 'سعر البيع',

        // Settings
        language: 'اللغة',
        arabic: 'العربية',
        french: 'Français',

        // Alerts
        success: 'نجاح',
        error: 'خطأ',
        productAdded: 'تمت إضافة المنتج!',
        fillAllFields: 'يرجى ملء جميع الحقول',
        productUpdated: 'تم تحديث المنتج',
        sold: 'تم البيع!',
        notFound: 'غير موجود',
        barcodeNotFound: 'لم يتم العثور على المنتج',
        close: 'إغلاق',
        cameraPermission: 'يلزم إذن الكاميرا',
        grant: 'منح'
    },
    fr: {
        // Home
        appName: 'G-Stock',
        add: 'Ajouter',
        sell: 'Vendre',
        view: 'Voir',
        settings: 'Paramètres',

        // Add Product
        addProduct: 'Ajouter Produit',
        scanOrType: 'Scanner ou taper...',
        productName: 'Nom du produit',
        buyPrice: 'Prix d\'achat',
        quantity: 'Quantité',
        save: 'Enregistrer',
        scan: 'Scanner',
        tapToAddPhoto: 'Appuyez pour ajouter une photo',
        barcode: 'Code-barres',

        // Sell
        sellProduct: 'Vendre Produit',
        scanning: 'Scan en cours...',
        searchManually: 'Recherche manuelle',
        search: 'Rechercher...',
        confirmSell: 'Confirmer Vente',
        cancel: 'Annuler',
        inStock: 'En stock',
        sellingPrice: 'Prix de vente',
        buyingPrice: 'Prix d\'achat',

        // View
        myStock: 'Mon Stock',
        noProducts: 'Aucun produit',
        edit: 'Modifier',
        delete: 'Supprimer',
        deleteConfirm: 'Voulez-vous vraiment supprimer?',
        margin: 'Marge %',
        sellPrice: 'Prix Vente',

        // Settings
        language: 'Langue',
        arabic: 'العربية',
        french: 'Français',

        // Alerts
        success: 'Succès',
        error: 'Erreur',
        productAdded: 'Produit ajouté!',
        fillAllFields: 'Veuillez remplir tous les champs',
        productUpdated: 'Produit mis à jour',
        sold: 'Vendu!',
        notFound: 'Non trouvé',
        barcodeNotFound: 'Produit non trouvé',
        close: 'Fermer',
        cameraPermission: 'Permission caméra requise',
        grant: 'Autoriser'
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('ar');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const saved = await AsyncStorage.getItem('@gstock_language');
            if (saved) setLanguage(saved);
        } catch (e) {
            console.log('Error loading language:', e);
        } finally {
            setLoading(false);
        }
    };

    const changeLanguage = async (lang) => {
        setLanguage(lang);
        await AsyncStorage.setItem('@gstock_language', lang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    const isRTL = language === 'ar';

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, isRTL, loading }}>
            {children}
        </LanguageContext.Provider>
    );
};
