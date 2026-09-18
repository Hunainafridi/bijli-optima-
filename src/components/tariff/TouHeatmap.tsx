import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export const TouHeatmap: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Hourly TOU Schedule</Text>
          <Text style={styles.subtitle}>Time-of-Use dynamic rates & peak windows</Text>
        </View>
        <View style={styles.clockIconBox}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={colors.textSecondary} />
        </View>
      </View>

      {/* 24-Hour Segment Heatmap Visualizer */}
      <View style={styles.heatmapTrack}>
        {/* 00:00 - 08:00 Off-Peak Normal (Cyan) */}
        <View style={[styles.segment, styles.offPeakSegment, { flex: 4 }]}>
          <Text style={styles.segmentTextCyan}>OFF</Text>
        </View>

        {/* 08:00 - 16:00 Solar Abundance (Emerald) */}
        <View style={[styles.segment, styles.solarSegment, { flex: 4 }]}>
          <Text style={styles.segmentTextEmerald}>SOLAR</Text>
        </View>

        {/* 16:00 - 18:00 Neutral (Dark) */}
        <View style={[styles.segment, styles.neutralSegment, { flex: 1 }]} />

        {/* 18:00 - 22:00 Severe Peak (Amber) */}
        <View style={[styles.segment, styles.peakSegment, { flex: 2 }]}>
          <Text style={styles.segmentTextAmber}>PEAK</Text>
        </View>

        {/* 22:00 - 24:00 Night Base (Cyan) */}
        <View style={[styles.segment, styles.nightBaseSegment, { flex: 1 }]} />
      </View>

      {/* Time Markers */}
      <View style={styles.markersRow}>
        <Text style={styles.timeMarker}>00:00</Text>
        <Text style={styles.timeMarker}>08:00</Text>
        <Text style={styles.timeMarker}>16:00</Text>
        <Text style={styles.timeMarker}>20:00</Text>
        <Text style={styles.timeMarker}>24:00</Text>
      </View>

      {/* Legend Strip */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(0, 229, 153, 0.6)' }]} />
          <Text style={styles.legendLabel}>Solar Shift (Free)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(124, 211, 255, 0.6)' }]} />
          <Text style={styles.legendLabel}>Off-Peak (Base)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(254, 183, 0, 0.8)' }]} />
          <Text style={[styles.legendLabel, { color: colors.secondaryContainer }]}>Evening Peak (₨ 42+)</Text>
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
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  clockIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatmapTrack: {
    flexDirection: 'row',
    height: 32,
    gap: 3,
    width: '100%',
  },
  segment: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offPeakSegment: {
    backgroundColor: 'rgba(124, 211, 255, 0.25)',
  },
  solarSegment: {
    backgroundColor: 'rgba(0, 229, 153, 0.25)',
  },
  neutralSegment: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  peakSegment: {
    backgroundColor: 'rgba(254, 183, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(254, 183, 0, 0.5)',
  },
  nightBaseSegment: {
    backgroundColor: 'rgba(124, 211, 255, 0.2)',
  },
  segmentTextCyan: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.tertiaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  segmentTextEmerald: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  segmentTextAmber: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  markersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  timeMarker: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderGhost,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
