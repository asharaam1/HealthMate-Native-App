import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useReports } from '../context/ReportContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SkeletonLoader } from '../components/SkeletonLoader';

// Report Card with Delete Button
const ReportCard = ({ report, onPress, onDelete }: { 
  report: any; 
  onPress: () => void; 
  onDelete: () => void;
}) => {
  const { colors, radius } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      'blood-test': '🩸',
      'x-ray': '🦴',
      prescription: '💊',
      ultrasound: '🔊',
      other: '📄',
    };
    return icons[type] || '📄';
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderRadius: radius.lg, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{getIcon(report.reportType)}</Text>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {report.title}
          </Text>
          <Text style={[styles.cardDate, { color: colors.textSecondary }]}>{formatDate(report.reportDate)}</Text>
        </View>
        <TouchableOpacity 
          onPress={onDelete} 
          style={styles.deleteBtn}
        >
          <Icon name="delete-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function ReportsListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { reports, getReports, deleteReport, loading } = useReports();
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    await getReports({ limit: 50 });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }, []);

  const handleDelete = (reportId: string, title: string) => {
    Alert.alert(
      'Delete Report',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteReport(reportId);
            fetchReports();
          }
        },
      ]
    );
  };

  if (loading && !refreshing && reports.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Reports</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Your medical history</Text>
        </View>
        <SkeletonLoader count={3} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Reports</Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Your medical history</Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ReportCard 
            report={item} 
            onPress={() => navigation.navigate('ReportDetail', { reportId: item._id })}
            onDelete={() => handleDelete(item._id, item.title)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Reports Yet</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Tap + to upload your first report</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('Upload')}>
        <Icon name="plus" size={28} color={colors.primaryText} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  headerSub: { fontSize: 13, marginTop: 2 },
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 80 },
  card: { marginBottom: 12, padding: 16, borderWidth: 0.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardDate: { fontSize: 12 },
  deleteBtn: { padding: 4 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center' },
});