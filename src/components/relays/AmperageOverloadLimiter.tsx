import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

export const AmperageOverloadLimiter: React.FC = () => {
  const { ampThreshold, setAmpThreshold, sellBatteryToGrid } = useEnergy();

  const handleStep = (delta: number) => {
    const next = Math.max(15, Math.min(50, ampThreshold + delta));
    setAmpThreshold(next);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Main Bus Overload Threshold</Text>
          <Text style={styles.subtitle}>Threshold trip cuts tertiary contactors automatically.</Text>
        </View>
        <Text style={styles.ampValue}>{ampThreshold} / 40 A</Text>
      </View>

      {/* Amperage Stepper Controls */}
      <View style={styles.sliderSimulation}>
        <TouchableOpacity style={styles.stepperBtn} onPress={() => handleStep(-2)} activeOpacity={0.7}>
          <MaterialCommunityIcons name="minus" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Visual Threshold Bar */}
        <View style={styles.trackContainer}>
          <View
            style={[
              styles.trackActive,
              { width: `${((ampThreshold - 15) / 35) * 100}%` },
            ]}
          />
        </View>

        <TouchableOpacity style={styles.stepperBtn} onPress={() => handleStep(2)} activeOpacity={0.7}>
          <MaterialCommunityIcons name="plus" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Markers */}
      <View style={styles.markerRow}>
        <Text style={styles.markerText}>15A (Conservation)</Text>
        <Text style={styles.markerText}>40A (Normal Breaker)</Text>
        <Text style={styles.markerText}>50A (Boost)</Text>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.sellGridBtn}
          onPress={sellBatteryToGrid}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="upload" size={18} color={colors.onPrimary} />
          <Text style={styles.sellGridText}>Sell Battery to Grid (₨ 54/kWh)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetBtn} onPress={() => setAmpThreshold(28)} activeOpacity={0.7}>
          <MaterialCommunityIcons name="restart" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ampValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sliderSimulation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  trackContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 4,
    overflow: 'hidden',
  },
  trackActive: {
    height: '100%',
    backgroundColor: colors.primaryBright,
  },
  markerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  markerText: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  sellGridBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryBright,
    borderRadius: 10,
    paddingVertical: 12,
    shadowColor: colors.primaryBright,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  sellGridText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.onPrimary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
});
