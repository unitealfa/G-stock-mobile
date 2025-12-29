import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddProductScreen from './screens/AddProductScreen';
import HomeScreen from './screens/HomeScreen';
import SellProductScreen from './screens/SellProductScreen';
import SettingsScreen from './screens/SettingsScreen';
import ViewStockScreen from './screens/ViewStockScreen';

const Stack = createStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#0a0a0a' },
                    gestureEnabled: true
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddProduct" component={AddProductScreen} />
                <Stack.Screen name="SellProduct" component={SellProductScreen} />
                <Stack.Screen name="ViewStock" component={ViewStockScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
