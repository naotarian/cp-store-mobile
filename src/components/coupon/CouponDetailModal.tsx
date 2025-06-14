import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Coupon, CouponIssue, CouponAcquisition } from '../../types/coupon';

interface CouponDetailModalProps {
  coupon: Coupon | null;
  visible: boolean;
  onClose: () => void;
  onGetCoupon: (coupon: Coupon) => void;
  onLogin: () => void;
  isAuthenticated: boolean;
  isAcquired?: boolean;
  activeIssue?: CouponIssue | null;
  userAcquisition?: CouponAcquisition | null;
}

export const CouponDetailModal: React.FC<CouponDetailModalProps> = ({
  coupon,
  visible,
  onClose,
  onGetCoupon,
  onLogin,
  isAuthenticated,
  isAcquired,
  activeIssue,
  userAcquisition,
}) => {
  if (!coupon) return null;

  const formatExpiryDate = () => {
    if (!activeIssue?.end_datetime) {
      return '期限情報なし';
    }
    
    const expiryDate = new Date(activeIssue.end_datetime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const expiry = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
    
    // 時間部分を取得
    const timeString = expiryDate.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // 当日かどうかチェック
    if (expiry.getTime() === today.getTime()) {
      return `本日 ${timeString}まで`;
    }
    
    // 日付と曜日を表示
    const dateString = expiryDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short'
    });
    
    return `${dateString} ${timeString}まで`;
  };

  const getExpiryStatus = () => {
    if (userAcquisition) {
      if (userAcquisition.is_expired) return 'expired';
      if (userAcquisition.status === 'used') return 'used';
      return 'active';
    }
    if (activeIssue) {
      if (activeIssue.status === 'expired') return 'expired';
      if (!activeIssue.is_available) return 'unavailable';
      return 'available';
    }
    return 'unknown';
  };

  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const isNew = () => {
    const createdDate = new Date(coupon.created_at);
    const now = new Date();
    const diffTime = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3; // 3日以内はNEW
  };

  const handleGetCoupon = () => {
    if (!isAuthenticated) {
      // ログインしていない場合は直接ログイン画面に遷移
      onClose();
      onLogin();
      return;
    }
    
    // ログインしている場合はクーポン取得処理を実行
    onGetCoupon(coupon);
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
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <MaterialIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* メインコンテンツ */}
                <View style={styles.content}>
                  {/* タイトルセクション */}
                  <View style={styles.titleSection}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>{coupon.title}</Text>
                      <View style={styles.badgeContainer}>
                        {isAcquired && (
                          <View style={styles.acquiredBadge}>
                            <MaterialIcons name="check-circle" size={16} color="#fff" />
                            <Text style={styles.acquiredText}>取得済み</Text>
                          </View>
                        )}
                        {isNew() && !isAcquired && (
                          <View style={styles.newBadge}>
                            <MaterialIcons name="new-releases" size={16} color="#fff" />
                            <Text style={styles.newText}>NEW</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text style={styles.description}>{coupon.description}</Text>
                  </View>

                  {/* 使用期限セクション */}
                  <View style={styles.expirySection}>
                    <View style={styles.expiryHeader}>
                      <MaterialIcons 
                        name="schedule" 
                        size={24} 
                        color={getExpiryStatus() === 'expired' ? '#F44336' : '#FF6B6B'} 
                      />
                      <Text style={styles.expiryLabel}>
                        {isAcquired ? '使用期限' : '取得期限'}
                      </Text>
                    </View>
                    <Text style={[
                      styles.expiryDate,
                      getExpiryStatus() === 'expired' && styles.expiredText
                    ]}>
                      {formatExpiryDate()}
                    </Text>
                    {getExpiryStatus() === 'expired' && (
                      <Text style={styles.expiredLabel}>期限切れ</Text>
                    )}
                  </View>

                  {/* 詳細情報セクション */}
                  {(coupon.conditions || coupon.notes) && (
                    <View style={styles.detailsSection}>
                      {coupon.conditions && (
                        <View style={styles.detailItem}>
                          <View style={styles.detailHeader}>
                            <MaterialIcons name="info" size={20} color="#FF6B6B" />
                            <Text style={styles.detailLabel}>利用条件</Text>
                          </View>
                          <Text style={styles.detailText}>{coupon.conditions}</Text>
                        </View>
                      )}

                      {coupon.notes && (
                        <View style={styles.detailItem}>
                          <View style={styles.detailHeader}>
                            <MaterialIcons name="note" size={20} color="#FF6B6B" />
                            <Text style={styles.detailLabel}>備考</Text>
                          </View>
                          <Text style={styles.detailText}>{coupon.notes}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* 注意事項セクション */}
                  <View style={styles.noticeSection}>
                    <View style={styles.noticeHeader}>
                      <MaterialIcons name="warning" size={20} color="#FF9800" />
                      <Text style={styles.noticeTitle}>ご利用上の注意</Text>
                    </View>
                    <View style={styles.noticeList}>
                      <Text style={styles.noticeItem}>• クーポンは1回限り有効です</Text>
                      <Text style={styles.noticeItem}>• 他のクーポンとの併用はできません</Text>
                      <Text style={styles.noticeItem}>• 有効期限を過ぎたクーポンは使用できません</Text>
                      <Text style={styles.noticeItem}>• 店舗にてクーポン画面をご提示ください</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* フッターボタン */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>閉じる</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.getCouponButton,
                    isAcquired && styles.disabledButton
                  ]}
                  onPress={isAcquired ? undefined : handleGetCoupon}
                  disabled={isAcquired}
                >
                  <MaterialIcons 
                    name={
                      isAcquired 
                        ? "check-circle" 
                        : isAuthenticated 
                          ? "redeem" 
                          : "login"
                    } 
                    size={20} 
                    color="#fff" 
                  />
                  <Text style={styles.getCouponButtonText}>
                    {isAcquired 
                      ? "取得済み" 
                      : isAuthenticated 
                        ? "クーポンを取得" 
                        : "ログインして取得"
                    }
                  </Text>
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
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  expirySection: {
    marginBottom: 20,
  },
  expiryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  expiryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  expiryDate: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginLeft: 28,
  },
  expiredText: {
    color: '#F44336',
  },
  expiredLabel: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailHeader: {
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
  noticeSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  noticeList: {
    marginLeft: 20,
  },
  noticeItem: {
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
  acquiredBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  acquiredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 