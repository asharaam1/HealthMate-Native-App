import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import { useReports } from '../context/ReportContext';
import { useNavigation } from '@react-navigation/native';
import { ReportCard } from '../components/ReportCard';
import { EmptyState } from '../components/EmptyState';
import { SkeletonLoader } from '../components/SkeletonLoader';
import type { Report } from '../types';

export default function TimelineScreen() {
  const { colors } = useTheme();
  const { reports, getReports, loading } = useReports();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    await getReports({ limit: 50 });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }, []);

  // const handleReportPress = (report: Report) => {
  //   na
  const handleReportPress = (report: Report) => {
    navigation.navigate('HomeTab', {
      screen: 'ReportDetail',
      params: { reportId: report._id },
    });
  };

  if (loading && !refreshing && reports.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Timeline
          </Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
            Your medical history
          </Text>
        </View>
        <SkeletonLoader count={3} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Timeline
        </Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
          Your medical history
        </Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <ReportCard report={item} onPress={() => handleReportPress(item)} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="No Reports Yet"
            description="Upload your first medical report to get AI analysis"
            buttonText="Upload Report"
            onPress={() => navigation.navigate('Upload')}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
});
