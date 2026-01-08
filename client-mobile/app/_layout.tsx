import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';

export default function RootLayout() {
  const publishableKey = Constants.expoConfig?.extra?.stripePublishableKey ?? 'pk_test_replace_me';

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
      </Stack>
    </StripeProvider>
  );
}