import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import AppNavigator from './src/navigation/AppNavigator';
export default function App(){const [loaded]=useFonts({PlusJakartaSans_400Regular,PlusJakartaSans_500Medium,PlusJakartaSans_600SemiBold,PlusJakartaSans_700Bold});if(!loaded)return null;return <AppNavigator/>;}
