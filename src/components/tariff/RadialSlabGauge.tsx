import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

export const RadialSlabGauge: React.FC = () => {
  const { nepraStatus } = useEnergy();

  // 120 diameter, radius 50, circumference = 2 * PI * 50 = 314.15
  const circumference = 314.15;
  // Offset calculated for 284/300 (~94.6% consumption in tier arc)
  const strokeDashoffset = 65;

  return (
    <View style={styles.container}>
      {/* Background Aura */}
      <View style={styles.glowAura} />

      <View style={styles.gaugeLayout}>
        {/* Circular SVG Radial Gauge */}
        <View style={styles.svgWrapper}>
          <Svg width={150} height={150} viewBox="0 0 120 120" style={styles.gaugeSvg}>
            {/* Background Track */}
            <Circle
              cx={60}
              cy={60}
              r={50}
              stroke={colors.surfaceContainerHighest}
              strokeWidth={9}
              fill="transparent"
            />
            {/* Safe Tier Slices */}
            <Circle
              cx={60}
              cy={60}
              r={50}
              stroke={colors.primaryBright}
              strokeWidth={9}
              strokeDasharray={circumference}
              strokeDashoffset={104.7}
              strokeLinecap="round"
              opacity={0.4}
              fill="transparent"
            />
            {/* Active Amber Alert Arc */}
            <Circle
              cx={60}
              cy={60}
              r={50}
              stroke={colors.secondaryContainer}
              strokeWidth={9}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </Svg>

          {/* Value Readout Inside Arc */}
          <View style={styles.gaugeCenterText}>
            <Text style={styles.consumedLabel}>CONSUMED</Text>
            <View style={styles.consumedRow}>
              <Text style={styles.consumedValue}>{nepraStatus.currentUnits}</Text>
              <Text style={styles.consumedKwh}>kWh</Text>
            </View>
            <Text style={styles.capLabel}>OF {nepraStatus.capUnits} CAP</Text>
          </View>
        </View>

        {/* Legend & Threshold Alert Right Column */}
        <View style={styles.infoCol}>
          <View style={styles.ratioHeader}>
            <View style={styles.ratioTitleRow}>
              <View style={styles.amberDot} />
              <Text style={styles.ratioTitle}>SLAB 3 PROXIMITY</Text>
            </View>
            <Text style={styles.ratioValue}>{nepraStatus.breachRatio}% RATIO</Text>
          </View>

          {/* Alert Callout Box */}
          <View style={styles.alertBox}>
            <View style={styles.alertHeader}>
              <MaterialCommunityIcons name="alert-outline" size={16} color={colors.secondaryContainer} />
              <Text style={styles.alertUnits}>{nepraStatus.remainingUnits} Units Remaining</Text>
            </View>
            <Text style={styles.alertDesc}>
              Exceeding 300 units triggers{' '}
              <Text style={styles.alertBold}>Slab 4 penalty (+₨ {nepraStatus.penaltyPerUnitPkr.toFixed(2)}/unit)</Text>{' '}
              retroactively across unshielded base brackets.
            </Text>
          </View>

          {/* Smart Buffer Sub-Strip */}
          <View style={styles.bufferRow}>
            <View style={styles.bufferLeft}>
              <MaterialCommunityIcons name="solar-power-variant" size={13} color={colors.primaryBright} />
              <Text style={styles.bufferLabel}>Net Generation Buffer</Text>
            </View>
            <Text style={styles.bufferValue}>+3.2 kWh Today</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(28, 32, 40, 0.85)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  glowAura: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(254, 183, 0, 0.1)',
  },
  gaugeLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  svgWrapper: {
    width: 140,
    height: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  gaugeCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumedLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  consumedRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginVertical: 1,
  },
  consumedValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  consumedKwh: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  capLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  infoCol: {
    flex: 1,
    gap: 8,
  },
  ratioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratioTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  amberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
  },
  ratioTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  ratioValue: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  alertBox: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 8,
    padding: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(254, 183, 0, 0.25)',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertUnits: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryContainer,
  },
  alertDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  alertBold: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  bufferRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bufferLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bufferLabel: {
    fontSize: 9,
    color: colors.textMuted,
  },
  bufferValue: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
