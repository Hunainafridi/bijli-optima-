import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

export const BatterySimulationDrawer: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExported, setIsExported] = useState(false);
  const { reArbitrageBill } = useEnergy();

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setIsExported(true);
      setTimeout(() => setIsExported(false), 3500);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Simulation Button */}
      <TouchableOpacity
        style={styles.simBtn}
        onPress={() => setDrawerOpen((prev) => !prev)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="battery-charging-high" size={20} color={colors.onPrimaryContainer} />
        <Text style={styles.simBtnText}>SIMULATE BATTERY CAPACITY EXPANSION</Text>
      </TouchableOpacity>

      {/* Audit Report PDF Button */}
      <TouchableOpacity
        style={styles.exportBtn}
        onPress={handleExportPdf}
        disabled={isExporting}
        activeOpacity={0.85}
      >
        {isExporting ? (
          <>
            <ActivityIndicator size="small" color={colors.primaryBright} />
            <Text style={styles.exportBtnText}>COMPILING TARIFF BREAKDOWN...</Text>
          </>
        ) : isExported ? (
          <>
            <MaterialCommunityIcons name="file-check-outline" size={18} color={colors.primaryBright} />
            <Text style={[styles.exportBtnText, { color: colors.primaryBright }]}>
              AUDIT_REPORT_AUG2026.PDF DOWNLOADED
            </Text>
          </>
        ) : (
          <>
            <MaterialCommunityIcons name="file-pdf-box" size={18} color={colors.tertiaryContainer} />
            <Text style={styles.exportBtnText}>EXPORT DISCO VERIFIED AUDIT REPORT</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Modeler Drawer Sheet */}
      {drawerOpen && (
        <View style={styles.drawerCard}>
          <View style={styles.drawerHeader}>
            <View style={styles.drawerTitleRow}>
              <MaterialCommunityIcons name="tune" size={18} color={colors.primaryBright} />
              <Text style={styles.drawerTitle}>Expansion Modeler</Text>
            </View>
            <TouchableOpacity onPress={() => setDrawerOpen(false)} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.drawerDesc}>
            Adding a 5.12 kWh LiFePO4 battery module will eliminate evening peak grid reliance, freezing consumption at Slab 2.
          </Text>

          {/* Module ROI Box */}
          <View style={styles.moduleBox}>
            <Text style={styles.moduleName}>Add +5.12 kWh LiFePO4 Storage</Text>
            <Text style={styles.moduleSavings}>₨ -4,200/mo</Text>
          </View>

          {/* Apply Button */}
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => {
              reArbitrageBill();
              setDrawerOpen(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.applyBtnText}>Apply To Scenario Engine</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: '100%',
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryContainer,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  simBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.onPrimaryContainer,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 12,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  exportBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  drawerCard: {
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginTop: 4,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  drawerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 2,
  },
  drawerDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  moduleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  moduleName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  moduleSavings: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  applyBtn: {
    backgroundColor: colors.surfaceBright,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
