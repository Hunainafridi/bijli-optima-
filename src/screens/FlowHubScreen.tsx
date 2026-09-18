import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NepraSentinelBanner } from '../components/flow/NepraSentinelBanner';
import { NetRevenueCard } from '../components/flow/NetRevenueCard';
import { OrbitalEnergyHub } from '../components/flow/OrbitalEnergyHub';
import { ManualOverridePanel } from '../components/dashboard/ManualOverridePanel';
import { SparklineRow } from '../components/flow/SparklineCard';
import { BillScanShortcut } from '../components/flow/BillScanShortcut';
import { QuickRelayList } from '../components/flow/QuickRelayList';
import { ApplianceRelay, useEnergy } from '../context/EnergyContext';

interface FlowHubScreenProps {
  onNavigateToScan: () => void;
  onRequirePin: (relay: ApplianceRelay) => void;
}

export const FlowHubScreen: React.FC<FlowHubScreenProps> = ({
  onNavigateToScan,
  onRequirePin,
}) => {
  const { shedNonCritical } = useEnergy();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. NEPRA Slab Sentinel Pulsar */}
      <NepraSentinelBanner onTrimPress={shedNonCritical} />

      {/* 2. Telemetry Hero Net Revenue Banner */}
      <NetRevenueCard />

      {/* 1. Real-Time Energy Hub */}
      <View style={styles.hubWrapper}>
        <OrbitalEnergyHub />
      </View>

      {/* 2. Manual Controls */}
      <ManualOverridePanel />

      {/* 4. Real-Time kWh Sparkline Metrics */}
      <SparklineRow />

      {/* 5. Dynamic Bill Utility Scanner Shortcut */}
      <BillScanShortcut onScanPress={onNavigateToScan} />

      {/* 6. Active Relay Shedding Quick Row */}
      <QuickRelayList onRequirePin={onRequirePin} />

      {/* Bottom Spacer for Floating Tab Bar */}
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
  hubWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  bottomSpacer: {
    height: 90,
  },
});
