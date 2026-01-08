import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { API_BASE_URL } from '../../src/config/api';

type MenuRowProps = {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
};

// רכיב שורה בתפריט לשימוש חוזר
const MenuRow = ({ icon, label, value, onPress, isDestructive = false, showChevron = true }: MenuRowProps) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.iconContainer, isDestructive && styles.destructiveIconBg]}>
      <Ionicons name={icon as any} size={20} color={isDestructive ? '#ef4444' : '#333'} />
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuLabel, isDestructive && styles.destructiveText]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
    </View>
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useStore(); // שליפת המשתמש מה-Store
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => {
            logout();
            router.replace('/login' as any);
          } 
        }
      ]
    );
  };

  // לוגיקת תמונת פרופיל או אווטאר גנרי
  const avatarUri = user?.avatarUrl 
    ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `${API_BASE_URL}/api/products/images/${user.avatarUrl}`)
    : `https://ui-avatars.com/api/?name=${user?.fullName || user?.username || 'User'}&background=2f95dc&color=fff`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 1. User Header - נתונים אמיתיים מה-Store */}
        <View style={styles.header}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={styles.userName}>{user?.fullName || user?.username || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email connected'}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => Alert.alert("Edit Profile", "Profile editing feature coming soon.")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Payment</Text>
          
          <MenuRow 
            icon="logo-paypal" 
            label="PayPal Settings" 
            value="Manage payment methods"
            onPress={() => Alert.alert("PayPal", "You will be redirected to PayPal to manage your account.")}
          />

          <MenuRow 
            icon="location-outline" 
            label="Shipping Address" 
            value={user?.address || "Add address"}
            onPress={() => console.log("Nav to Address")} 
          />
        </View>

        {/* 3. Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications-outline" size={20} color="#333" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Push Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e5e7eb', true: '#2f95dc' }}
            />
          </View>
          <MenuRow 
            icon="globe-outline" 
            label="Language" 
            value="English"
            onPress={() => console.log("Change Language")} 
          />
        </View>

        {/* 4. Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuRow 
            icon="help-circle-outline" 
            label="Help Center" 
            onPress={() => console.log("Help")} 
          />
        </View>

        {/* 5. Logout */}
        <View style={[styles.section, styles.lastSection]}>
          <MenuRow 
            icon="log-out-outline" 
            label="Log Out" 
            isDestructive 
            showChevron={false}
            onPress={handleLogout} 
          />
        </View>

        <Text style={styles.versionText}>BuyForce Version 1.0.0 (MVP)</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { paddingBottom: 40 },
  header: { 
    alignItems: 'center', 
    paddingVertical: 30, 
    backgroundColor: '#fff', 
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12, backgroundColor: '#eee' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#111' },
  userEmail: { fontSize: 14, color: '#666', marginBottom: 16 },
  editButton: { 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#e5e7eb' 
  },
  editButtonText: { fontSize: 13, fontWeight: '600', color: '#333' },
  section: { 
    backgroundColor: '#fff', 
    marginBottom: 20, 
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0'
  },
  lastSection: { marginBottom: 0 },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#9ca3af', 
    textTransform: 'uppercase', 
    marginLeft: 20, 
    marginBottom: 8, 
    marginTop: 8 
  },
  menuRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  iconContainer: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: '#f3f4f6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 16, color: '#1f2937' },
  menuValue: { fontSize: 14, color: '#9ca3af', marginTop: 2 },
  destructiveText: { color: '#ef4444', fontWeight: '600' },
  destructiveIconBg: { backgroundColor: '#fee2e2' },
  versionText: { textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 30 }
});