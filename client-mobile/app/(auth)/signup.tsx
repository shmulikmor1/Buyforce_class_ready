import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { API_BASE_URL } from '../../src/config/api';

export default function SignupScreen() {
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    username: '', 
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      Alert.alert('Success', 'Account created! Please login.', [
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } catch (err: any) {
      Alert.alert('Signup Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: 'Create Account', headerShadowVisible: false }} />
      <Text style={styles.title}>Join Us</Text>
      <Text style={styles.subtitle}>Create an account to start shopping</Text>

      <View style={styles.form}>
        <TextInput 
          placeholder="Username" 
          style={styles.input} 
          autoCapitalize="none"
          onChangeText={(t) => setForm({...form, username: t})} 
        />
        <TextInput 
          placeholder="Email Address" 
          style={styles.input} 
          keyboardType="email-address" 
          autoCapitalize="none"
          onChangeText={(t) => setForm({...form, email: t})} 
        />
        <TextInput 
          placeholder="Password" 
          style={styles.input} 
          secureTextEntry 
          onChangeText={(t) => setForm({...form, password: t})} 
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')} style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 32 },
  form: { gap: 16 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', padding: 16, borderRadius: 12, fontSize: 16 },
  button: { backgroundColor: '#2f95dc', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 8, minHeight: 60, justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#2f95dc', fontSize: 14, fontWeight: '600' }
});