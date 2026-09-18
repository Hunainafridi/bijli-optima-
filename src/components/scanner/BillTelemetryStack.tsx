import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';
import { ScannedBillResult } from '../../services/api';

interface BillTelemetryStackProps {
  billData: ScannedBillResult;
  onProcessComplete?: () => void;
  onManualPdfPress?: () => void;
}

export const BillTelemetryStack: React.FC<BillTelemetryStackProps> = ({
  billData,
  onProcessComplete,
  onManualPdfPress,
}) => {
  const { reArbitrageBill } = useEnergy();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);

  const handleProcessBill = async () => {
    setIsProcessing(true);
    try {
      await reArbitrageBill();
      setIsProcessed(true);
      onProcessComplete?.();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Primary Ident & Slab Card */}
      <View style={styles.cardContainer}>
        {/* Top Reference Row */}
        <View style={styles.cardHeader}>
          <View style={styles.refInfoRow}>
            <MaterialCommunityIcons name="badge-account-horizontal-outline" size={20} color={colors.primaryBright} />
            <View style={styles.refColumn}>
              <Text style={styles.refLabel}>CONSUMER REF ID</Text>
              <Text style={styles.refValue}>{billData.consumerRef}</Text>
            </View>
          </View>

          <View style={styles.slabBadge}>
            <View style={styles.amberDot} />
            <Text style={styles.slabBadgeText}>NEPRA SLAB-{billData.nepraSlabTier}</Text>
          </View>
        </View>

        {/* Meter Units Split Row */}
        <View style={styles.unitsGrid}>
          {/* Off-Peak Box */}
          <View style={styles.unitBox}>
            <View style={styles.unitBoxHeader}>
              <Text style={styles.unitBoxLabel}>OFF-PEAK DRAW</Text>
              <MaterialCommunityIcons name="weather-sunset-down" size={16} color={colors.primaryBright} />
            </View>
            <Text style={styles.unitNumber}>
              {billData.offPeakUnitsKwh.toLocaleString()}{' '}
              <Text style={styles.unitSuffix}>kWh</Text>
            </Text>
            <Text style={[styles.rateLabel, { color: colors.primaryBright }]}>
              Rate: ₨ {billData.offPeakRatePkr.toFixed(2)}/unit
            </Text>
          </View>

          {/* Peak Box */}
          <View style={styles.unitBox}>
            <View style={styles.unitBoxHeader}>
              <Text style={styles.unitBoxLabel}>PEAK DRAW (17-21H)</Text>
              <MaterialCommunityIcons name="weather-sunset-up" size={16} color={colors.secondaryContainer} />
            </View>
            <Text style={[styles.unitNumber, { color: colors.secondaryContainer }]}>
              {billData.peakUnitsKwh.toLocaleString()}{' '}
              <Text style={styles.unitSuffix}>kWh</Text>
            </Text>
            <Text style={[styles.rateLabel, { color: colors.secondaryContainer }]}>
              Rate: ₨ {billData.peakRatePkr.toFixed(2)}/unit
            </Text>
          </View>
        </View>

        {/* NEPRA Slab Progress Accumulator */}
        <View style={styles.accumulatorSection}>
          <View style={styles.accumRow}>
            <Text style={styles.accumLeft}>
              MONTHLY BILLED UNITS:{' '}
              <Text style={styles.accumUnitsBold}>{billData.totalBilledUnitsKwh} kWh</Text>
            </Text>
            <Text style={styles.accumRight}>6 kWh TO TIER 4 SURCHARGE</Text>
          </View>

          {/* Segmented Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, { width: '33%', backgroundColor: colors.primaryBright }]} />
            <View style={[styles.progressSegment, { width: '33%', backgroundColor: colors.primaryBright, marginHorizontal: 2 }]} />
            <View style={[styles.progressSegment, { width: '31%', backgroundColor: colors.secondaryContainer }]} />
            <View style={[styles.progressSegment, { width: '3%', backgroundColor: colors.surfaceContainerHighest }]} />
          </View>

          {/* Slab Markers */}
          <View style={styles.markerRow}>
            <Text style={styles.markerText}>0</Text>
            <Text style={styles.markerText}>100</Text>
            <Text style={styles.markerText}>200</Text>
            <Text style={[styles.markerText, { color: colors.secondaryContainer, fontWeight: '700' }]}>
              300 (CRITICAL)
            </Text>
            <Text style={styles.markerText}>700+</Text>
          </View>
        </View>
      </View>

      {/* 2. Financial Reconciliation Tile */}
      <View style={styles.cardContainer}>
        <View style={styles.financeHeader}>
          <View>
            <Text style={styles.financeLabel}>NET PAYABLE AMOUNT</Text>
            <View style={styles.financeAmountRow}>
              <Text style={styles.financeAmount}>₨ {billData.netPayablePkr.toLocaleString()}</Text>
              <Text style={styles.dueDateText}>DUE {billData.dueDate.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.creditBox}>
            <View style={styles.creditBoxTop}>
              <MaterialCommunityIcons name="solar-power-variant" size={14} color={colors.primaryBright} />
              <Text style={styles.creditBoxTitle}>NET CREDIT</Text>
            </View>
            <Text style={styles.creditAmount}>-₨ {Math.abs(billData.netSolarCreditPkr).toLocaleString()}</Text>
          </View>
        </View>

        {/* Taxes and Surcharges Row */}
        <View style={styles.taxesRow}>
          <View style={styles.surchargeItem}>
            <MaterialCommunityIcons name="history" size={14} color={colors.tertiaryContainer} />
            <Text style={styles.taxText}>FC Surcharge: ₨ {billData.fuelAdjustmentFpaPkr.toLocaleString()}</Text>
          </View>
          <Text style={styles.taxText}>GST + ED: ₨ {billData.gstAndGovtTaxesPkr.toLocaleString()}</Text>
        </View>
      </View>

      {/* 3. Action Controller */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.processButton, isProcessed && styles.processedButton]}
          onPress={handleProcessBill}
          disabled={isProcessing}
          activeOpacity={0.85}
        >
          {isProcessing ? (
            <>
              <ActivityIndicator color={colors.onPrimary} size="small" />
              <Text style={styles.processButtonText}>OPTIMIZING LOAD TARIFFS...</Text>
            </>
          ) : isProcessed ? (
            <>
              <MaterialCommunityIcons name="check-decagram" size={20} color={colors.onPrimaryContainer} />
              <Text style={styles.processButtonText}>ARBITRAGE APPLIED (SAVED ₨ 3,410)</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color={colors.onPrimary} />
              <Text style={styles.processButtonText}>PROCESS BILL & RE-ARBITRAGE</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Sub Controls: Auto trigger & Manual PDF */}
        <View style={styles.subControls}>
          <View style={styles.autoTriggerRow}>
            <Switch
              value={autoScanEnabled}
              onValueChange={setAutoScanEnabled}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryBright }}
              thumbColor={autoScanEnabled ? '#FFFFFF' : '#B0B5BA'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
            <Text style={styles.autoTriggerText}>Auto-trigger on target lock</Text>
          </View>

          <TouchableOpacity style={styles.manualPdfBtn} onPress={onManualPdfPress} activeOpacity={0.7}>
            <MaterialCommunityIcons name="file-upload-outline" size={16} color={colors.tertiaryContainer} />
            <Text style={styles.manualPdfText}>Manual PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: '100%',
  },
  cardContainer: {
    backgroundColor: 'rgba(38, 42, 51, 0.9)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  refInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refColumn: {},
  refLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  refValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  slabBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  amberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
  },
  slabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  unitsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  unitBox: {
    flex: 1,
    backgroundColor: 'rgba(24, 28, 36, 0.7)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  unitBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitBoxLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  unitNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 3,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  unitSuffix: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.textMuted,
  },
  rateLabel: {
    fontSize: 9,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  accumulatorSection: {
    gap: 6,
    marginTop: 4,
  },
  accumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accumLeft: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  accumUnitsBold: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  accumRight: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 1,
  },
  progressSegment: {
    height: '100%',
    borderRadius: 2,
  },
  markerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  markerText: {
    fontSize: 8,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  financeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  financeAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  financeAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  dueDateText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.errorBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  creditBox: {
    backgroundColor: 'rgba(10, 14, 22, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
  },
  creditBoxTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creditBoxTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryBright,
    letterSpacing: 0.6,
  },
  creditAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryBright,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  taxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderGhost,
    paddingTop: 8,
  },
  surchargeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taxText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionSection: {
    gap: 8,
    marginTop: 4,
  },
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryBright,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: colors.primaryBright,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  processedButton: {
    backgroundColor: colors.primaryContainer,
  },
  processButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.onPrimary,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  subControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  autoTriggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  autoTriggerText: {
    fontSize: 11,
    color: colors.textPrimary,
  },
  manualPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  manualPdfText: {
    fontSize: 11,
    color: colors.tertiaryContainer,
    fontWeight: '600',
  },
});
