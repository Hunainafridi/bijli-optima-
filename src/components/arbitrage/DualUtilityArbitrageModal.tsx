import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

interface DualUtilityArbitrageModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DualUtilityArbitrageModal: React.FC<DualUtilityArbitrageModalProps> = ({
  visible,
  onClose,
}) => {
  const { thermalComparison, telemetry } = useEnergy();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="fire" size={20} color={colors.secondaryContainer} />
              </View>
              <View>
                <Text style={styles.title}>Gas vs. Electric Arbitrage</Text>
                <Text style={styles.subtitle}>DUAL-UTILITY THERMAL COST EQUIVALENCE (SNGPL / LESCO)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Bilingual Strategic Recommendation Banner */}
          <View style={styles.advisoryCard}>
            <View style={styles.advisoryHeader}>
              <MaterialCommunityIcons name="shield-star" size={18} color={colors.primaryBright} />
              <Text style={styles.advisoryTitle}>AI THERMAL ARBITRAGE ADVISORY</Text>
            </View>
            <Text style={styles.advisoryUrdu}>{thermalComparison.advisoryRomanUrdu}</Text>
            <Text style={styles.advisoryEng}>{thermalComparison.advisoryEnglish}</Text>
          </View>

          {/* Thermal Cost Comparison Matrix */}
          <View style={styles.matrixContainer}>
            <Text style={styles.matrixLabel}>WATER HEATING HOURLY THERMAL COST</Text>
            <View style={styles.matrixGrid}>
              {/* Option 1: Solar Electric */}
              <View style={[styles.matrixCard, styles.matrixCardRecommended]}>
                <View style={styles.optionHeader}>
                  <MaterialCommunityIcons name="solar-power-variant" size={16} color={colors.primaryBright} />
                  <Text style={[styles.optionTitle, { color: colors.primaryBright }]}>Solar Electric</Text>
                </View>
                <Text style={styles.optionCost}>₨ {thermalComparison.solarCostPerHourPkr}</Text>
                <Text style={styles.optionUnit}>/ hour</Text>
                <View style={styles.optPill}>
                  <Text style={styles.optPillText}>OPTIMAL MIDDAY</Text>
                </View>
              </View>

              {/* Option 2: SNGPL Gas */}
              <View style={styles.matrixCard}>
                <View style={styles.optionHeader}>
                  <MaterialCommunityIcons name="gas-cylinder" size={16} color={colors.secondaryContainer} />
                  <Text style={styles.optionTitle}>SNGPL Gas</Text>
                </View>
                <Text style={[styles.optionCost, { color: colors.secondaryContainer }]}>
                  ₨ {thermalComparison.gasCostPerHourPkr}
                </Text>
                <Text style={styles.optionUnit}>/ hour</Text>
                <Text style={styles.optionSub}>Rs. 1,850/MMBTU</Text>
              </View>

              {/* Option 3: Grid Electric */}
              <View style={styles.matrixCard}>
                <View style={styles.optionHeader}>
                  <MaterialCommunityIcons name="transmission-tower" size={16} color={colors.errorBright} />
                  <Text style={styles.optionTitle}>Grid Electric</Text>
                </View>
                <Text style={[styles.optionCost, { color: colors.errorBright }]}>
                  ₨ {thermalComparison.gridElectricCostPerHourPkr}
                </Text>
                <Text style={styles.optionUnit}>/ hour</Text>
                <Text style={styles.optionSub}>Rs. 58.5/kWh Peak</Text>
              </View>
            </View>
          </View>

          {/* Savings Projection Card */}
          <View style={styles.savingsCard}>
            <View style={styles.savingsLeft}>
              <Text style={styles.savingsLabel}>MONTHLY PROJECTED SAVINGS</Text>
              <Text style={styles.savingsAmount}>₨ {thermalComparison.monthlyProjectedSavingsPkr.toLocaleString()}</Text>
            </View>
            <View style={styles.solarSurplusBox}>
              <Text style={styles.surplusLabel}>ACTIVE SOLAR SURPLUS</Text>
              <Text style={styles.surplusValue}>{Math.max(0, telemetry.solarKw - telemetry.houseLoadKw).toFixed(1)} kW</Text>
            </View>
          </View>

          {/* Footer Done Action */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>Apply Thermal Setting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 14, 0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surfaceContainer,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(254, 183, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.secondaryContainer,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  closeBtn: {
    padding: 4,
  },
  advisoryCard: {
    backgroundColor: 'rgba(0, 229, 153, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
    gap: 6,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  advisoryTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryBright,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  advisoryUrdu: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  advisoryEng: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  matrixContainer: {
    gap: 8,
  },
  matrixLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  matrixGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  matrixCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    alignItems: 'center',
  },
  matrixCardRecommended: {
    borderColor: colors.borderGlowPrimary,
    backgroundColor: 'rgba(0, 229, 153, 0.08)',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  optionCost: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  optionUnit: {
    fontSize: 9,
    color: colors.textMuted,
  },
  optPill: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  optPillText: {
    fontSize: 7,
    fontWeight: '800',
    color: colors.onPrimaryContainer,
    letterSpacing: 0.6,
  },
  optionSub: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  savingsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  savingsLeft: {},
  savingsLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  savingsAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryBright,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  solarSurplusBox: {
    alignItems: 'flex-end',
  },
  surplusLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  surplusValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.secondaryContainer,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  doneBtn: {
    backgroundColor: colors.primaryBright,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});
