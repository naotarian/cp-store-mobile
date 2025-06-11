import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Review } from '../../types/review';
import { ReviewCard } from './ReviewCard';
import { ApiService } from '../../services/api/index';

interface ReviewSectionProps {
  shopId: string;
  reviewCount: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ 
  shopId, 
  reviewCount 
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [shopId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewData = await ApiService.getShopReviews(shopId);
      setReviews(reviewData);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setError('レビューの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>レビュー ({reviewCount}件)</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6200EA" />
          <Text style={styles.loadingText}>レビューを読み込み中...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>レビュー ({reviewCount}件)</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>レビュー ({reviews.length}件)</Text>
      
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>まだレビューがありません</Text>
        </View>
      ) : (
        <View style={styles.reviewsList}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
  reviewsList: {
    // レビューカード間のスペースはReviewCard内で管理
  },
}); 