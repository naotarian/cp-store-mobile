import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Coupon } from '../../types/coupon';

interface CouponDetailModalProps {
  coupon: Coupon | null;
  visible: boolean;
  onClose: () => void;
  onGetCoupon: (coupon: Coupon) => void;
}

export const CouponDetailModal: React.FC<CouponDetailModalProps> = ({
  coupon,
  visible,
  onClose,
  onGetCoupon,
}) => {
  if (!coupon) return null;

  const formatDiscount = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%OFF`;
    } else if (coupon.discountValue === 0) {
      return '無料';
    } else {
      return `${coupon.discountValue}円OFF`;
    }
  };

  const formatExpireDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleGetCoupon = () => {
    onGetCoupon(coupon);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* ヘッダー */}
                <View style={styles.header}>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{formatDiscount()}</Text>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <MaterialIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* NEW バッジ */}
                {coupon.isNew && (
                  <View style={styles.newBadgeContainer}>
                    <View style={styles.newBadge}>
                      <MaterialIcons name="new-releases" size={16} color="#fff" />
                      <Text style={styles.newText}>NEW</Text>
                    </View>
                  </View>
                )}

                {/* タイトルと説明 */}
                <View style={styles.content}>
                  <Text style={styles.title}>{coupon.title}</Text>
                  <Text style={styles.description}>{coupon.description}</Text>

                  {/* 詳細情報 */}
                  <View style={styles.detailSection}>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="schedule" size={20} color="#FF6B6B" />
                      <Text style={styles.detailLabel}>有効期限</Text>
                    </View>
                    <Text style={styles.detailText}>
                      {formatExpireDate(coupon.expireDate)}まで
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="info" size={20} color="#FF6B6B" />
                      <Text style={styles.detailLabel}>利用条件</Text>
                    </View>
                    <Text style={styles.detailText}>{coupon.conditions}</Text>
                  </View>

                  {/* 注意事項 */}
                  <View style={styles.noteSection}>
                    <Text style={styles.noteTitle}>📝 ご利用上の注意</Text>
                    <Text style={styles.noteText}>
                      • クーポンは1回限り有効です{'\n'}
                      • 他のクーポンとの併用はできません{'\n'}
                      • 有効期限を過ぎたクーポンは使用できません{'\n'}
                      • 店舗にてクーポン画面をご提示ください
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* フッターボタン */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.getCouponButton}
                  onPress={handleGetCoupon}
                >
                  <MaterialIcons name="redeem" size={20} color="#fff" />
                  <Text style={styles.getCouponButtonText}>クーポンを取得</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  discountBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
  },
  discountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  newBadgeContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  newText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginLeft: 28,
  },
  noteSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  getCouponButton: {
    flex: 2,
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getCouponButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 