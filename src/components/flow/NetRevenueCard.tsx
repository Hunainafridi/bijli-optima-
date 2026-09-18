import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

export const NetRevenueCard: React.FC = () => {
  const { telemetry } = useEnergy();

  return (
    <View style={styles.container}>
      {/* Background Aura */}
      <View style={styles.glowAuraRight} />
      <View style={styles.glowAuraLeft} />

      {/* Top Split: Net Revenue & Export Badge */}
      <View style={styles.topRow}>
        <View style={styles.revenueColumn}>
          <Text style={styles.revenueLabel}>NET REVENUE POSITION</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>+₨</Text>
            <Text style={styles.revenueAmount}>{telemetry.netRevenuePkr.toLocaleString()}</Text>
            <Text style={styles.creditPill}>CREDIT</Text>
          </View>
        </View>

        <View style={styles.exportColumn}>
          <View style={styles.exportBadge}>
            <View style={styles.pulseGreen} />
            <Text style={styles.exportText}>EXPORT ACTIVE</Text>
          </View>
          <Text style={styles.pfText}>
            PF: <Text style={styles.pfValue}>{telemetry.powerFactor}</Text> lag
          </Text>
        </View>
      </View>

      {/* Power Flow Split Ticker Grid */}
      <View style={styles.tickerGrid}>
        {/* Solar Harvest */}
        <View style={styles.tickerCol}>
          <Text style={styles.tickerLabel}>SOLAR HARVEST</Text>
          <Text style={styles.solarValue}>
            {telemetry.solarKw}{' '}
            <Text style={styles.unitSuffix}>kW</Text>
          </Text>
        </View>

        {/* House Load */}
        <View style={styles.tickerCol}>
          <Text style={styles.tickerLabel}>HOUSE LOAD</Text>
          <Text style={styles.houseValue}>
            {telemetry.houseLoadKw}{' '}
            <Text style={styles.unitSuffix}>kW</Text>
          </Text>
        </View>

        {/* To Disco Grid */}
        <View style={styles.tickerCol}>
          <Text style={styles.tickerLabel}>TO DISCO GRID</Text>
          <Text style={styles.gridValue}>
            +{telemetry.gridKw}{' '}
            <Text style={styles.unitSuffix}>kW</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(28, 32, 40, 0.85)',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  glowAuraRight: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 229, 153, 0.08)',
  },
  glowAuraLeft: {
    position: 'absolute',
    left: -40,
    top: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(124, 211, 255, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  revenueColumn: {
    flex: 1,
  },
  revenueLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryBright,
    letterSpacing: -0.5,
  },
  creditPill: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  exportColumn: {
    alignItems: 'flex-end',
    gap: 4,
  },
  exportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
  },
  pulseGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryBright,
  },
  exportText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryBright,
    letterSpacing: 0.6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  pfText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  pfValue: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  tickerGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 28, 36, 0.7)',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  tickerCol: {
    flex: 1,
    paddingHorizontal: 6,
  },
  tickerLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
  solarValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  houseValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.tertiaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  unitSuffix: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textMuted,
  },
});
