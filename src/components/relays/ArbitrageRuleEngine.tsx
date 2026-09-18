import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export const ArbitrageRuleEngine: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="shield-lock-open-outline" size={18} color={colors.secondaryContainer} />
          <Text style={styles.titleText}>Arbitrage Rule Engine</Text>
        </View>
        <View style={styles.activePill}>
          <Text style={styles.activePillText}>4 ACTIVE RULES</Text>
        </View>
      </View>

      {/* Rules List */}
      <View style={styles.ruleStack}>
        {/* Rule 1 */}
        <View style={styles.ruleBox}>
          <MaterialCommunityIcons
            name="check-circle"
            size={18}
            color={colors.primaryBright}
            style={styles.ruleIcon}
          />
          <View style={styles.ruleTextCol}>
            <Text style={styles.ruleHeading}>NEPRA Slab Overrun Prevention</Text>
            <Text style={styles.ruleDesc}>
              If projected monthly draw exceeds 300 units, force 100% solar self-consumption and battery clip.
            </Text>
          </View>
        </View>

        {/* Rule 2 */}
        <View style={styles.ruleBox}>
          <MaterialCommunityIcons
            name="timelapse"
            size={18}
            color={colors.secondaryContainer}
            style={styles.ruleIcon}
          />
          <View style={styles.ruleTextCol}>
            <Text style={styles.ruleHeading}>Night Tariff Pre-Charge Buffer</Text>
            <Text style={styles.ruleDesc}>
              Charge 15kWh LiFePO4 battery pack at off-peak rates (₨ 22/kWh) between 01:00 and 05:00.
            </Text>
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
    gap: 12,
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
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  activePill: {
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  ruleStack: {
    gap: 8,
  },
  ruleBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    padding: 10,
    borderRadius: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  ruleIcon: {
    marginTop: 2,
  },
  ruleTextCol: {
    flex: 1,
  },
  ruleHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ruleDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
});
