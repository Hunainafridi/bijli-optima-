import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

export const BillProjectionCard: React.FC = () => {
  const { nepraStatus } = useEnergy();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="trending-down" size={20} color={colors.primaryBright} />
          <Text style={styles.title}>30-Day Bill Projection</Text>
        </View>
        <View style={styles.savingsBadge}>
          <Text style={styles.savingsText}>SAVINGS 51%</Text>
        </View>
      </View>

      {/* Comparison Columns */}
      <View style={styles.comparisonGrid}>
        {/* Regulated with Optima */}
        <View style={styles.projectionCol}>
          <Text style={styles.colLabel}>PROJECTED BILL</Text>
          <Text style={styles.amountOptimized}>
            ₨ {nepraStatus.projectedBillPkr.toLocaleString()}
          </Text>
          <View style={styles.statusLine}>
            <MaterialCommunityIcons name="check" size={13} color={colors.primaryBright} />
            <Text style={styles.statusOptimized}>Optima Regulated</Text>
          </View>
        </View>

        {/* Without Optima */}
        <View style={[styles.projectionCol, styles.unregulatedCol]}>
          <Text style={styles.colLabel}>WITHOUT OPTIMA</Text>
          <Text style={styles.amountUnregulated}>
            ₨ {nepraStatus.unregulatedBillPkr.toLocaleString()}
          </Text>
          <View style={styles.statusLine}>
            <MaterialCommunityIcons name="arrow-up" size={13} color={colors.errorBright} />
            <Text style={styles.statusUnregulated}>Slab 4 Spillover</Text>
          </View>
        </View>
      </View>

      {/* Net Benefit Banner */}
      <View style={styles.benefitBanner}>
        <Text style={styles.benefitLabel}>Avoided Tariff Penalties:</Text>
        <Text style={styles.benefitAmount}>
          ₨ {nepraStatus.avoidedPenaltiesPkr.toLocaleString()} NET SAVED
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(38, 42, 51, 0.9)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  savingsBadge: {
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
  },
  savingsText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryBright,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  projectionCol: {
    flex: 1,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    justifyContent: 'space-between',
  },
  unregulatedCol: {
    opacity: 0.8,
  },
  colLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  amountOptimized: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryBright,
    marginVertical: 4,
    letterSpacing: -0.3,
  },
  amountUnregulated: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textSecondary,
    marginVertical: 4,
    textDecorationLine: 'line-through',
    letterSpacing: -0.3,
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statusOptimized: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryBright,
  },
  statusUnregulated: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.errorBright,
  },
  benefitBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 153, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
  },
  benefitLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  benefitAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
