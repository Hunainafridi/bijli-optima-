import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

interface NepraSentinelBannerProps {
  onTrimPress?: () => void;
}

export const NepraSentinelBanner: React.FC<NepraSentinelBannerProps> = ({ onTrimPress }) => {
  const { nepraStatus } = useEnergy();

  return (
    <View style={styles.container}>
      {/* Amber Glowing Accent */}
      <View style={styles.glowAura} />

      <View style={styles.contentRow}>
        {/* Pulsing Alert Sentinel Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.pingRing} />
          <View style={styles.dotCore} />
        </View>

        {/* Text Information */}
        <View style={styles.textColumn}>
          <View style={styles.badgeRow}>
            <Text style={styles.sentinelTitle}>NEPRA Tier 2 Sentinel</Text>
            <View style={styles.riskPill}>
              <Text style={styles.riskText}>{nepraStatus.breachRatio}% Breach Risk</Text>
            </View>
          </View>
          <Text style={styles.unitsSubtitle} numberOfLines={1}>
            {nepraStatus.currentUnits} / {nepraStatus.capUnits} Units consumed •{' '}
            <Text style={styles.highlightText}>{nepraStatus.remainingUnits} units</Text> to peak slab
          </Text>
        </View>

        {/* Trim Button */}
        <TouchableOpacity
          style={styles.trimButton}
          onPress={onTrimPress}
          activeOpacity={0.8}
        >
          <Text style={styles.trimText}>Trim</Text>
          <MaterialCommunityIcons name="lightning-bolt" size={14} color={colors.secondaryContainer} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: 'rgba(38, 42, 51, 0.85)',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(254, 183, 0, 0.25)',
    overflow: 'hidden',
    position: 'relative',
  },
  glowAura: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(254, 183, 0, 0.15)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pingRing: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 186, 32, 0.4)',
  },
  dotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondaryContainer,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  sentinelTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryFixed,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  riskPill: {
    backgroundColor: 'rgba(254, 183, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondaryContainer,
  },
  unitsSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  highlightText: {
    color: colors.secondaryContainer,
    fontWeight: '700',
  },
  trimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(254, 183, 0, 0.3)',
  },
  trimText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryContainer,
  },
});
