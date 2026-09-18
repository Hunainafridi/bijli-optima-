import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { PeakWindowBanner } from '../components/relays/PeakWindowBanner';
import { PowerRoutingBus } from '../components/relays/PowerRoutingBus';
import { RelayContactorCard } from '../components/relays/RelayContactorCard';
import { ArbitrageRuleEngine } from '../components/relays/ArbitrageRuleEngine';
import { AmperageOverloadLimiter } from '../components/relays/AmperageOverloadLimiter';
import { AutonomousOrchestrationSuite } from '../components/orchestration/AutonomousOrchestrationSuite';
import { ApplianceRelay, useEnergy } from '../context/EnergyContext';

interface LoadRelaysScreenProps {
  onRequirePin: (relay: ApplianceRelay) => void;
  onOpenRadar?: () => void;
}

export const LoadRelaysScreen: React.FC<LoadRelaysScreenProps> = ({
  onRequirePin,
  onOpenRadar,
}) => {
  const { relays, shedNonCritical } = useEnergy();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Active Peak Slab Arbitrage Alert Banner */}
      <PeakWindowBanner />

      {/* 2. Power Routing Telemetry HUD */}
      <PowerRoutingBus />

      {/* 3. Autonomous Orchestration Suite: Feeder Outage, Net Billing & Soiling */}
      <AutonomousOrchestrationSuite onOpenRadar={onOpenRadar} />

      {/* 4. Heavy Appliance Relays Module Header */}
      <View style={styles.relaysHeaderRow}>
        <View>
          <Text style={styles.relaysHeading}>Heavy Appliance Relays</Text>
          <Text style={styles.relaysSub}>Automated sub-metered contactors & priority sheds</Text>
        </View>
        <TouchableOpacity
          style={styles.shedAllBtn}
          onPress={shedNonCritical}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="power" size={15} color={colors.secondaryContainer} />
          <Text style={styles.shedAllText}>Shed Non-Crit</Text>
        </TouchableOpacity>
      </View>

      {/* Relays Cards Stack */}
      <View style={styles.relaysList}>
        {relays.map((relay) => (
          <RelayContactorCard
            key={relay.id}
            relay={relay}
            onRequirePin={onRequirePin}
          />
        ))}
      </View>

      {/* 4. Smart Relay Arbitrage Rule Engine */}
      <ArbitrageRuleEngine />

      {/* 5. Manual Amperage Load Limiter & Peak Export Trigger */}
      <AmperageOverloadLimiter />

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
  relaysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  relaysHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  relaysSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  shedAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(254, 183, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(254, 183, 0, 0.3)',
  },
  shedAllText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.secondaryContainer,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  relaysList: {
    gap: 10,
  },
  bottomSpacer: {
    height: 90,
  },
});
