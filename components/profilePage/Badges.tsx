import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Award } from 'lucide-react-native';

interface BadgesProps {
  userId: string;
  showFeaturedOnly?: boolean;
  badges: Array<{
    medal_id: string;
    name: string;
    description: string;
    image: string;
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND' | 'RUBY' | 'LEGENDARY';
  }>;
}

const TIER_COLORS = {
  BRONZE: '#CD7F32',
  SILVER: '#C0C0C0',
  GOLD: '#FFD700',
  DIAMOND: '#B9F2FF',
  RUBY: '#E0115F',
  LEGENDARY: '#FF7F50',
};
export default function Badges({ userId, showFeaturedOnly = true, badges }: BadgesProps) {
  const displayBadges = showFeaturedOnly ? badges.slice(0, 3) : badges;

  const getBadgeColor = (tier: string) => TIER_COLORS[tier as keyof typeof TIER_COLORS] || '#9CA3AF';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        {showFeaturedOnly && badges.length > 3 && (
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {badges.length > 0 ? (
        <ScrollView 
          horizontal={showFeaturedOnly}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={showFeaturedOnly ? styles.scrollContent : styles.gridContent}
        >
          {displayBadges.map((badge) => (
            <View 
              key={badge.medal_id} 
              style={[
                styles.badgeContainer,
                { borderColor: getBadgeColor(badge.tier) }
              ]}
            >
              <Award size={24} color={getBadgeColor(badge.tier)} />
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDescription} numberOfLines={2}>
                {badge.description}
              </Text>
              <View 
                style={[
                  styles.tierBadge,
                  { backgroundColor: getBadgeColor(badge.tier) }
                ]}
              >
                <Text style={styles.tierText}>{badge.tier}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Award size={32} color="#9CA3AF" />
          <Text style={styles.emptyText}>No badges earned yet</Text>
          <Text style={styles.emptySubtext}>
            Complete activities to earn badges
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 150,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 8,
  },
  tierText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
