import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScannerHudBar } from '../components/scanner/ScannerHudBar';
import { HolographicViewfinder } from '../components/scanner/HolographicViewfinder';
import { BillTelemetryStack } from '../components/scanner/BillTelemetryStack';
import { ScannedBillResult } from '../services/api';

const DEFAULT_BILL: ScannedBillResult = {
  id: 'bill_lesco_2026_09',
  consumerRef: '08-11234-5829104 U',
  providerName: 'LESCO URBAN (3-PHASE)',
  tariffCategory: 'A-1 Residential Tiered',
  billingMonth: 'September 2026',
  dueDate: '12 Nov 2026',
  offPeakUnitsKwh: 14892,
  peakUnitsKwh: 3120,
  totalBilledUnitsKwh: 294,
  offPeakRatePkr: 34.20,
  peakRatePkr: 48.95,
  netPayablePkr: 18450,
  netSolarCreditPkr: -6200,
  fuelAdjustmentFpaPkr: 1840,
  gstAndGovtTaxesPkr: 2930,
  nepraSlabTier: 3,
  isBreachRisk: true,
  confidenceScore: 99.4,
  barcodeVerified: true,
};

export const BillScannerScreen: React.FC = () => {
  const [flashActive, setFlashActive] = useState(false);
  const [customImageUri, setCustomImageUri] = useState<string | null>(null);
  const [billData] = useState<ScannedBillResult>(DEFAULT_BILL);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Top System Telemetry HUD Bar */}
      <ScannerHudBar
        flashActive={flashActive}
        onToggleFlash={() => setFlashActive((prev) => !prev)}
        confidenceScore={billData.confidenceScore}
      />

      {/* 2. Holographic Viewfinder Module */}
      <HolographicViewfinder
        imageUri={customImageUri}
        onImageSelected={(uri) => setCustomImageUri(uri)}
      />

      {/* 3. Live Extracted Telemetry Stack & Financial Reconciliation */}
      <BillTelemetryStack billData={billData} />

      {/* Bottom Spacer */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F131C',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 14,
  },
  bottomSpacer: {
    height: 90,
  },
});
