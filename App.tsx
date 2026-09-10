import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

import LoginScreen from './src/screens/public/LoginScreen';
import RegisterScreen from './src/screens/public/RegisterScreen';
import ForgotPasswordScreen from './src/screens/public/ForgotPasswordScreen';
import EmailSentScreen from './src/screens/public/EmailSentScreen';
import NewPasswordScreen from './src/screens/public/NewPasswordScreen';
import PasswordChangedScreen from './src/screens/public/PasswordChangedScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <PasswordChangedScreen />;
}