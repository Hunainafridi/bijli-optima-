import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { isPKTPeakHour } from '../../utils/timeUtils';

export const PeakWindowBanner: React.FC = () => {
  if (!isPKTPeakHour()) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Background Radiance */}
      <View style={styles.glowAuraAmber} />
      <View style={styles.glowAuraEmerald} />

      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <View style={styles.tagRow}>
            <View style={styles.peakPill}>
              <View style={styles.pulsingAmber} />
              <Text style={styles.peakPillText}>Peak Window Active</Text>
            </View>
            <Text style={styles.tariffTag}>NEPRA TARIFF 4</Text>
          </View>
          <Text style={styles.heading}>17:00 – 21:00 Peak Tariff</Text>
          <Text style={styles.subtext}>
            Automated battery arbitrage engaged. Grid injection suppressed; domestic bus isolated from ₨ 68.4/kWh penal rate.
          </Text>
        </View>

        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="meter-electric" size={26} color={colors.secondaryContainer} />
        </View>
      </View>

      {/* Realtime Savings Metric Counter Grid */}
      <View style={styles.metricGrid}>
        {/* Cycle Arbitrage */}
        <View style={styles.metricBox}>
          <View style={styles.metricLabelRow}>
            <MaterialCommunityIcons name="piggy-bank-outline" size={14} color={colors.primaryBright} />
            <Text style={styles.metricLabel}>CYCLE ARBITRAGE</Text>
          </View>
          <View style={styles.metricValRow}>
            <Text style={styles.metricValLarge}>₨ 4,820</Text>
            <Text style={styles.metricPercentage}>+22%</Text>
          </View>
          <Text style={styles.metricDetail}>Shedded 71.4 kWh vs peak</Text>
        </View>

        {/* Storage Reserve */}
        <View style={styles.metricBox}>
          <View style={styles.metricLabelRow}>
            <MaterialCommunityIcons name="battery-charging-high" size={14} color={colors.secondaryContainer} />
            <Text style={styles.metricLabel}>STORAGE RESERVE</Text>
          </View>
          <View style={styles.metricValRow}>
            <Text style={[styles.metricValLarge, { color: colors.secondaryContainer }]}>78.4%</Text>
            <Text style={styles.voltageText}>48.8V</Text>
          </View>
          <Text style={styles.metricDetail}>4h 12m runtime buffer</Text>
        </View>
      </View>

      {/* Micro Arbitrage Status Bar */}
      <View style={styles.statusBarSection}>
        <View style={styles.statusLabelRow}>
          <Text style={styles.statusLabelLeft}>PEAK PROGRESSION (SLOT 2 OF 4)</Text>
          <Text style={styles.statusLabelRight}>1h 48m REMAINING</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '45%', backgroundColor: colors.secondaryContainer }]} />
          <View style={[styles.progressFill, { width: '15%', backgroundColor: colors.primaryBright }]} />
          <View style={[styles.progressFill, { width: '40%', backgroundColor: colors.surfaceContainerHighest }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(28, 32, 40, 0.9)',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    overflow: 'hidden',
    position: 'relative',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  glowAuraAmber: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(254, 183, 0, 0.12)',
  },
  glowAuraEmerald: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(0, 229, 153, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleCol: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  peakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(254, 183, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  pulsingAmber: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
  },
  peakPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.secondaryContainer,
    letterSpacing: 0.6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tariffTag: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  subtext: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 3,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  metricValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 2,
  },
  metricValLarge: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  metricPercentage: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryBright,
  },
  voltageText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  metricDetail: {
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusBarSection: {
    gap: 5,
  },
  statusLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusLabelLeft: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusLabelRight: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  progressTrack: {
    height: 7,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 3.5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
