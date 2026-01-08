// client-mobile/app/(tabs)/index.tsx
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../src/config/api'; // ✅ FIX: path from app/(tabs) -> app/config
import ProductCard from '../../components/ProductCard';
import type { ApiProduct } from '../../src/types/product';
import { mapProductToCard } from '../../src/utils/mapProduct';

const STORAGE_KEY = '@search_history';

export default function HomeScreen() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), loadHistory()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data: unknown = await res.json();
      setProducts(Array.isArray(data) ? (data as ApiProduct[]) : []);
    } catch {
      setProducts([]);
    }
  };

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every(x => typeof x === 'string')) {
        setHistory(parsed);
      } else {
        setHistory([]);
      }
    } catch {
      setHistory([]);
    }
  };

  const saveToHistory = async (text: string) => {
    const value = text.trim();
    if (!value) return;

    // ✅ FIX: typed callback param (no implicit any)
    const updated = [value, ...history.filter((h: string) => h !== value)].slice(0, 5);

    setHistory(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // ✅ FIX: typed callback param (no implicit any)
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p: ApiProduct) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} />
        <TextInput
          placeholder="Search deals..."
          value={search}
          onChangeText={setSearch}
          onFocus={() => setIsSearching(true)}
          onSubmitEditing={() => {
            void saveToHistory(search);
            Keyboard.dismiss();
            setIsSearching(false);
          }}
          style={styles.input}
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item: ApiProduct) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }: { item: ApiProduct }) => (
          <ProductCard {...mapProductToCard(item)} />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50 }}>No deals found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: {
    flexDirection: 'row',
    padding: 12,
    margin: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
  },
  input: { marginLeft: 10, flex: 1 },
});