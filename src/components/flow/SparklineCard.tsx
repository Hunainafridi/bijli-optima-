import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

export const SparklineRow: React.FC = () => {
  const { telemetry } = useEnergy();

  return (
    <View style={styles.gridRow}>
      {/* 1. Solar Generation Card */}
      <View style={styles.sparkCard}>
        <View style={styles.topRow}>
          <Text style={styles.cardLabel}>SOLAR GEN</Text>
          <MaterialCommunityIcons name="white-balance-sunny" size={16} color={colors.secondaryContainer} />
        </View>
        <Text style={[styles.metricText, { color: colors.secondaryContainer }]}>
          {telemetry.dailySolarGenKwh}{' '}
          <Text style={styles.unitText}>kWh</Text>
        </Text>
        {/* SVG Sparkline */}
        <Svg width="100%" height={24} viewBox="0 0 100 24" style={styles.sparkSvg}>
          <Path
            d="M0 22 Q 25 18 40 8 T 75 4 T 100 12"
            fill="none"
            stroke={colors.secondaryContainer}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.subtext}>Peak: 4.8 kW</Text>
      </View>

      {/* 2. Battery Storage Card */}
      <View style={styles.sparkCard}>
        <View style={styles.topRow}>
          <Text style={styles.cardLabel}>STORAGE</Text>
          <MaterialCommunityIcons name="battery-high" size={16} color={colors.primaryBright} />
        </View>
        <Text style={[styles.metricText, { color: colors.primaryBright }]}>
          {telemetry.dailyStorageKwh}{' '}
          <Text style={styles.unitText}>kWh</Text>
        </Text>
        {/* SVG Sparkline */}
        <Svg width="100%" height={24} viewBox="0 0 100 24" style={styles.sparkSvg}>
          <Path
            d="M0 16 C 20 18, 40 10, 60 14 C 80 16, 90 6, 100 8"
            fill="none"
            stroke={colors.primaryBright}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.subtext}>Cycle 1.2x</Text>
      </View>

      {/* 3. Net Grid Card */}
      <View style={styles.sparkCard}>
        <View style={styles.topRow}>
          <Text style={styles.cardLabel}>NET GRID</Text>
          <MaterialCommunityIcons name="swap-horizontal" size={16} color={colors.tertiaryContainer} />
        </View>
        <Text style={[styles.metricText, { color: colors.tertiaryContainer }]}>
          {telemetry.dailyNetGridKwh}{' '}
          <Text style={styles.unitText}>kWh</Text>
        </Text>
        {/* SVG Sparkline */}
        <Svg width="100%" height={24} viewBox="0 0 100 24" style={styles.sparkSvg}>
          <Path
            d="M0 8 Q 30 18 50 14 T 80 6 T 100 4"
            fill="none"
            stroke={colors.tertiaryContainer}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={[styles.subtext, { color: colors.primaryBright }]}>+Exporting</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  sparkCard: {
    flex: 1,
    backgroundColor: 'rgba(28, 32, 40, 0.7)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  metricText: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginVertical: 2,
  },
  unitText: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.textMuted,
  },
  sparkSvg: {
    marginVertical: 4,
  },
  subtext: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
