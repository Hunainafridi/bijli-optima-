import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TariffModelContextCard } from '../components/tariff/TariffModelContextCard';
import { RadialSlabGauge } from '../components/tariff/RadialSlabGauge';
import { SlabLadder } from '../components/tariff/SlabLadder';
import { BillProjectionCard } from '../components/tariff/BillProjectionCard';
import { TouHeatmap } from '../components/tariff/TouHeatmap';
import { BatterySimulationDrawer } from '../components/tariff/BatterySimulationDrawer';

export const TariffAnalyticsScreen: React.FC = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Top System Context & Utility Authority Indicator */}
      <TariffModelContextCard />

      {/* 2. Hero Slab Radial Gauge & Critical Warning Card */}
      <RadialSlabGauge />

      {/* 3. Slab Ladder Execution Architecture */}
      <SlabLadder />

      {/* 4. Predictive 30-Day Bill Forecast Card */}
      <BillProjectionCard />

      {/* 5. Daily Hourly Tariff Heat Map */}
      <TouHeatmap />

      {/* 6. Action & Expansion Suite (Battery Simulator & Audit Export) */}
      <BatterySimulationDrawer />

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
