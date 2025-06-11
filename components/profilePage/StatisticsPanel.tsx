import { BarChart2, Calendar, Clock, ExternalLink, TrendingUp, Users, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface UserStats {
  totalViews: number;
  totalLikes: number;
  totalConnections: number;
  memberSince: string;
  lastActive: string;
  activityChart: {
    labels: string[];
    data: number[];
  };
  engagementMetrics: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  postPerformance: {
    best: {
      id: string;
      title: string;
      views: number;
      engagement: number;
    };
    worst: {
      id: string;
      title: string;
      views: number;
      engagement: number;
    };
  };
}

interface StatisticsPanelProps {
  userId: string;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ userId }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      // const response = await fetch(`/api/users/${userId}/stats`);
      // const data = await response.json();
      
      // Using mock data
      const mockData = await mockFetchStats(userId);
      setStats(mockData);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0EA5E9" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Error loading statistics'}</Text>
        <TouchableOpacity onPress={fetchStats}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statBoxesContainer}>
        <View style={styles.statBox}>
          <BarChart2 size={20} color="#0EA5E9" style={styles.statIcon} />
          <Text style={styles.statValue}>{stats.totalViews.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        
        <View style={styles.statBox}>
          <TrendingUp size={20} color="#0EA5E9" style={styles.statIcon} />
          <Text style={styles.statValue}>{stats.totalLikes.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        
        <View style={styles.statBox}>
          <Users size={20} color="#0EA5E9" style={styles.statIcon} />
          <Text style={styles.statValue}>{stats.totalConnections.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Connections</Text>
        </View>
      </View>
      
      <View style={styles.joinInfoContainer}>
        <View style={styles.joinInfoItem}>
          <Calendar size={16} color="#6B7280" style={styles.joinInfoIcon} />
          <Text style={styles.joinInfoText}>
            Joined {stats.memberSince}
          </Text>
        </View>
        
        <View style={styles.joinInfoItem}>
          <Clock size={16} color="#6B7280" style={styles.joinInfoIcon} />
          <Text style={styles.joinInfoText}>
            Last active {stats.lastActive}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.detailsButtonText}>Show details</Text>
        <ExternalLink size={16} color="#0EA5E9" style={styles.detailsButtonIcon} />
      </TouchableOpacity>
      
      {/* Statistics Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Activity Statistics</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Activity Overview</Text>
                <Text style={styles.sectionSubtitle}>Last 7 days</Text>
                
                <View style={styles.chartContainer}>
                  <LineChart
                    data={{
                      labels: stats.activityChart.labels,
                      datasets: [
                        {
                          data: stats.activityChart.data
                        }
                      ]
                    }}
                    width={300}
                    height={180}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                      style: {
                        borderRadius: 16
                      },
                      propsForDots: {
                        r: '4',
                        strokeWidth: '2',
                        stroke: '#0EA5E9'
                      }
                    }}
                    bezier
                    style={styles.chart}
                  />
                </View>
              </View>
              
              <View style={styles.metricsSection}>
                <Text style={styles.sectionTitle}>Engagement Metrics</Text>
                
                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{stats.engagementMetrics.likes}</Text>
                    <Text style={styles.metricLabel}>Likes</Text>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{stats.engagementMetrics.comments}</Text>
                    <Text style={styles.metricLabel}>Comments</Text>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{stats.engagementMetrics.shares}</Text>
                    <Text style={styles.metricLabel}>Shares</Text>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{stats.engagementMetrics.saves}</Text>
                    <Text style={styles.metricLabel}>Saves</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.performanceSection}>
                <Text style={styles.sectionTitle}>Post Performance</Text>
                
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceTitle}>Best Performing Post</Text>
                  <Text style={styles.performancePostTitle}>
                    {stats.postPerformance.best.title}
                  </Text>
                  <View style={styles.performanceMetrics}>
                    <Text style={styles.performanceMetric}>
                      {stats.postPerformance.best.views} views
                    </Text>
                    <Text style={styles.performanceMetric}>
                      {stats.postPerformance.best.engagement}% engagement
                    </Text>
                  </View>
                </View>
                
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceTitle}>Needs Improvement</Text>
                  <Text style={styles.performancePostTitle}>
                    {stats.postPerformance.worst.title}
                  </Text>
                  <View style={styles.performanceMetrics}>
                    <Text style={styles.performanceMetric}>
                      {stats.postPerformance.worst.views} views
                    </Text>
                    <Text style={styles.performanceMetric}>
                      {stats.postPerformance.worst.engagement}% engagement
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Mock data function
const mockFetchStats = async (userId: string): Promise<UserStats> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return {
    totalViews: 4853,
    totalLikes: 298,
    totalConnections: 47,
    memberSince: 'Sep 12, 2023',
    lastActive: 'Today',
    activityChart: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [5, 12, 8, 19, 14, 10, 16]
    },
    engagementMetrics: {
      likes: 298,
      comments: 125,
      shares: 43,
      saves: 76
    },
    postPerformance: {
      best: {
        id: 'post123',
        title: 'How to Master React Native in 30 Days',
        views: 1234,
        engagement: 24
      },
      worst: {
        id: 'post456',
        title: 'My Weekend Project: Smart Home Setup',
        views: 198,
        engagement: 5
      }
    }
  };
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 8,
  },
  retryText: {
    color: '#0EA5E9',
    fontWeight: '500',
  },
  statBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C4A6E',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#0C4A6E',
  },
  joinInfoContainer: {
    marginBottom: 16,
  },
  joinInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  joinInfoIcon: {
    marginRight: 6,
  },
  joinInfoText: {
    fontSize: 14,
    color: '#4B5563',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#0EA5E9',
    fontWeight: '600',
    marginRight: 6,
  },
  detailsButtonIcon: {
    
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    padding: 16,
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chart: {
    borderRadius: 16,
  },
  metricsSection: {
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  metricItem: {
    width: '50%',
    padding: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0C4A6E',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  performanceSection: {
    marginBottom: 24,
  },
  performanceItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  performancePostTitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  performanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceMetric: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default StatisticsPanel;