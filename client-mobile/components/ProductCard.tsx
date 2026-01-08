import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../src/config/api';

// חישוב רוחב דינמי כדי לוודא התאמה לכל המכשירים
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 45) / 2; // הורדת המרווחים הצידיים והרווח בין הכרטיסים

interface ProductCardProps {
  id: string;
  title: string;
  regularPrice: number;
  groupPrice: number;
  joinedCount: number;
  targetCount: number;
  progress: number;
  image: string | any;
  endsAt?: string;
}

export default function ProductCard({
  id,
  title,
  regularPrice,
  groupPrice,
  joinedCount,
  targetCount,
  progress,
  image,
  endsAt
}: ProductCardProps) {
  
  const router = useRouter();

  const getTimeLeft = (deadline: string) => {
    if (!deadline) return "";
    const total = Date.parse(deadline) - Date.now();
    if (total <= 0) return "Ended";
    
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    if (days > 0) return `${days}d left`;
    return `${hours}h left`; 
  };

  const imageSource = typeof image === 'string' 
    ? (image.startsWith('http') ? { uri: image } : { uri: `${API_BASE_URL}/api/products/images/${image}` })
    : image;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/product/${id}`)}
    >
      <View style={styles.imageContainer}>
        <Image 
            source={imageSource} 
            style={styles.image} 
            resizeMode="cover"
        />
        
        {endsAt && (
            <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{getTimeLeft(endsAt)}</Text>
            </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.groupPrice}>₪{groupPrice}</Text>
          <Text style={styles.regularPrice}>₪{regularPrice}</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(progress || 0, 100)}%` }]} />
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>{joinedCount}/{targetCount}</Text>
            <Text style={styles.percentageText}>{Math.round(progress || 0)}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    width: CARD_WIDTH, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginBottom: 15,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    elevation: 2, 
    overflow: 'hidden' 
  },
  imageContainer: { 
    height: 110, 
    width: '100%', 
    backgroundColor: '#f8fafc' 
  },
  image: { 
    width: '100%', 
    height: '100%' 
  },
  timeBadge: { 
    position: 'absolute', 
    bottom: 6, 
    left: 6, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 4, 
    paddingHorizontal: 5, 
    paddingVertical: 2 
  },
  timeText: { 
    color: '#fff', 
    fontSize: 9, 
    fontWeight: '700' 
  },
  content: { 
    padding: 8 
  },
  title: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#1e293b', 
    marginBottom: 4 
  },
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  groupPrice: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#2f95dc', 
    marginRight: 4 
  },
  regularPrice: { 
    fontSize: 10, 
    color: '#94a3b8', 
    textDecorationLine: 'line-through' 
  },
  progressSection: { 
    marginTop: 2 
  },
  progressBarBg: { 
    height: 4, 
    backgroundColor: '#f1f5f9', 
    borderRadius: 2, 
    marginBottom: 4 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#2f95dc', 
    borderRadius: 2 
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  statsText: { 
    fontSize: 9, 
    color: '#64748b' 
  },
  percentageText: { 
    fontSize: 9, 
    fontWeight: '700', 
    color: '#334155' 
  },
});