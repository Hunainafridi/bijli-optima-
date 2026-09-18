import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export const TariffModelContextCard: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Left: Provider and Model */}
      <View style={styles.leftRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="shield-check" size={20} color={colors.primaryBright} />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.providerLabel}>NEPRA / LESCO TARIFF MODEL</Text>
          <Text style={styles.modelName}>Tiered Residential A-1</Text>
        </View>
      </View>

      {/* Right: Defense Active */}
      <View style={styles.defensePill}>
        <View style={styles.pulseDot} />
        <Text style={styles.defenseText}>DEFENSE ACTIVE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {},
  providerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modelName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  defensePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(254, 183, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(254, 183, 0, 0.3)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
  },
  defenseText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.secondaryContainer,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
