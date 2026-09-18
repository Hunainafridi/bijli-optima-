import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export const SlabLadder: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Dynamic Slab Ladder</Text>
        <Text style={styles.discoAudited}>DISCO AUDITED</Text>
      </View>

      {/* Slabs Stack */}
      <View style={styles.slabsStack}>
        {/* Slab 1 */}
        <View style={styles.slabCard}>
          <View style={styles.leftGroup}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 229, 153, 0.12)' }]}>
              <MaterialCommunityIcons name="check-circle" size={18} color={colors.primaryBright} />
            </View>
            <View style={styles.slabInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.slabTitle}>Slab 1</Text>
                <Text style={styles.unitRange}>1 - 100 kWh</Text>
              </View>
              <Text style={styles.offsetText}>100% OFF-GRID SOLAR OFFSET</Text>
            </View>
          </View>
          <View style={styles.rateCol}>
            <Text style={styles.rateAmount}>₨ 14.50</Text>
            <Text style={styles.rateUnit}>/ unit</Text>
          </View>
        </View>

        {/* Slab 2 */}
        <View style={styles.slabCard}>
          <View style={styles.leftGroup}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 229, 153, 0.12)' }]}>
              <MaterialCommunityIcons name="check-circle" size={18} color={colors.primaryBright} />
            </View>
            <View style={styles.slabInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.slabTitle}>Slab 2</Text>
                <Text style={styles.unitRange}>101 - 200 kWh</Text>
              </View>
              <Text style={styles.offsetText}>100% SOLAR + STORAGE RUN</Text>
            </View>
          </View>
          <View style={styles.rateCol}>
            <Text style={styles.rateAmount}>₨ 19.80</Text>
            <Text style={styles.rateUnit}>/ unit</Text>
          </View>
        </View>

        {/* Slab 3: LIVE & CRITICAL */}
        <View style={[styles.slabCard, styles.slabActiveCard]}>
          <View style={styles.slabActiveContent}>
            <View style={styles.leftGroup}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(254, 183, 0, 0.2)' }]}>
                <MaterialCommunityIcons name="lightning-bolt" size={18} color={colors.secondaryContainer} />
              </View>
              <View style={styles.slabInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.slabTitle, { color: colors.secondaryContainer }]}>Slab 3</Text>
                  <Text style={styles.unitRange}>201 - 300 kWh</Text>
                  <View style={styles.liveTag}>
                    <Text style={styles.liveTagText}>LIVE</Text>
                  </View>
                </View>
                <Text style={styles.loggedText}>84 UNITS LOGGED • 16 REMAINING</Text>
              </View>
            </View>
            <View style={styles.rateCol}>
              <Text style={[styles.rateAmount, { color: colors.secondaryContainer }]}>₨ 28.50</Text>
              <Text style={styles.rateUnit}>/ unit</Text>
            </View>
          </View>

          {/* Micro Segmented Progress Bar */}
          <View style={styles.slabProgressBar}>
            <View style={styles.slabProgressFill} />
          </View>
        </View>

        {/* Slab 4: LOCKED */}
        <View style={[styles.slabCard, styles.slabLockedCard]}>
          <View style={styles.leftGroup}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceContainer }]}>
              <MaterialCommunityIcons name="lock" size={18} color={colors.textMuted} />
            </View>
            <View style={styles.slabInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.slabTitle, { color: colors.textSecondary }]}>Slab 4</Text>
                <Text style={styles.unitRange}>301 - 700 kWh</Text>
              </View>
              <View style={styles.shieldedRow}>
                <MaterialCommunityIcons name="shield-check" size={12} color={colors.errorBright} />
                <Text style={styles.shieldedText}>PROTECTED BY AUTO-SHEDDING</Text>
              </View>
            </View>
          </View>
          <View style={styles.rateCol}>
            <Text style={[styles.rateAmount, { color: colors.textSecondary }]}>₨ 42.00</Text>
            <Text style={styles.rateUnit}>/ unit</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  discoAudited: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryBright,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  slabsStack: {
    gap: 8,
  },
  slabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(24, 28, 36, 0.7)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  slabActiveCard: {
    backgroundColor: 'rgba(38, 42, 51, 0.9)',
    borderColor: 'rgba(254, 183, 0, 0.35)',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,
  },
  slabActiveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slabProgressBar: {
    height: 4,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 2,
    overflow: 'hidden',
  },
  slabProgressFill: {
    width: '84%',
    height: '100%',
    backgroundColor: colors.secondaryContainer,
  },
  slabLockedCard: {
    opacity: 0.75,
    backgroundColor: colors.surfaceContainerLowest,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slabInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slabTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  unitRange: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  liveTag: {
    backgroundColor: 'rgba(254, 183, 0, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  liveTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.secondaryContainer,
    letterSpacing: 0.6,
  },
  offsetText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryBright,
    marginTop: 2,
    letterSpacing: 0.4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  loggedText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.secondaryContainer,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  shieldedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  shieldedText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.errorBright,
    letterSpacing: 0.4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  rateCol: {
    alignItems: 'flex-end',
  },
  rateAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  rateUnit: {
    fontSize: 9,
    color: colors.textMuted,
  },
});
