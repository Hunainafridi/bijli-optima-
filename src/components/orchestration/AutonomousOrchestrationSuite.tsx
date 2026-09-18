import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

interface AutonomousOrchestrationSuiteProps {
  onOpenRadar?: () => void;
}

export const AutonomousOrchestrationSuite: React.FC<AutonomousOrchestrationSuiteProps> = ({
  onOpenRadar,
}) => {
  const {
    feederSentinel,
    soilingHealth,
    netBillingActive,
    streamMetrics,
    reflexEngineLog,
    toggleNetBillingMode,
    simulateFeederTrip,
    restoreFeederSync,
    toggleSimulatedFiberOutage,
  } = useEnergy();

  const isFeederWarning = feederSentinel.status === 'trip-warning';
  const isLocalLan = streamMetrics.transport === 'LOCAL_LAN_WS';

  return (
    <View style={styles.container}>
      {/* 1. Instant Reflex Engine (0-100ms) Status Card */}
      <View style={styles.reflexCard}>
        <View style={styles.reflexHeader}>
          <View style={styles.reflexTitleRow}>
            <MaterialCommunityIcons name="lightning-bolt-circle" size={20} color={colors.primaryBright} />
            <View>
              <Text style={styles.reflexTitle}>Instant Reflex Engine (0-100ms)</Text>
              <Text style={styles.reflexSubtitle}>Deterministic In-Memory Overload & Divert Rules</Text>
            </View>
          </View>
          <View style={styles.reflexPill}>
            <Text style={styles.reflexPillText}>
              {reflexEngineLog.length > 0 ? `${reflexEngineLog[0].executionMs}ms REFLEX` : '18ms REFLEX'}
            </Text>
          </View>
        </View>
        <Text style={styles.reflexDesc}>
          Guarantees sub-50ms breaker trip if 11kV grid cuts while load exceeds 5.0kW inverter capacity, preventing sudden blackouts and hard inverter shutdowns.
        </Text>
      </View>

      {/* 2. Crowdsourced 11kV Feeder Outage Early Warning Sentinel */}
      <View
        style={[
          styles.feederCard,
          isFeederWarning ? styles.feederCardAlert : styles.feederCardNormal,
        ]}
      >
        <View style={styles.feederHeader}>
          <View style={styles.feederTitleRow}>
            <MaterialCommunityIcons
              name={isFeederWarning ? 'alert-decagram' : 'transmission-tower'}
              size={20}
              color={isFeederWarning ? colors.errorBright : colors.primaryBright}
            />
            <View>
              <Text style={styles.feederTitle}>11kV Feeder Outage Early Warning</Text>
              <Text style={styles.feederName}>{feederSentinel.feederName}</Text>
            </View>
          </View>

          <View style={styles.feederActionRow}>
            {onOpenRadar && (
              <TouchableOpacity
                style={styles.radarBtn}
                onPress={onOpenRadar}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="radar" size={14} color={colors.primaryBright} />
                <Text style={styles.radarBtnText}>Radar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.testTripBtn, isFeederWarning && styles.testTripBtnActive]}
              onPress={isFeederWarning ? restoreFeederSync : simulateFeederTrip}
              activeOpacity={0.8}
            >
              <Text style={styles.testTripText}>
                {isFeederWarning ? 'RESTORE' : 'TEST TRIP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isFeederWarning ? (
          <View style={styles.feederAlertBox}>
            <Text style={styles.feederAlertText}>
              Unannounced grid drop detected across {feederSentinel.activeDropCount} homes on Feeder 14! Battery reserves locked at {feederSentinel.recommendedReserveSoc}% to survive local feeder blackout.
            </Text>
          </View>
        ) : (
          <View style={styles.feederNormalRow}>
            <View style={styles.normalPill}>
              <View style={styles.greenDot} />
              <Text style={styles.normalPillText}>FEEDER STABLE</Text>
            </View>
            <Text style={styles.feederTelemetryMeta}>
              Sync verified across 5 smart residential nodes (10s mesh)
            </Text>
          </View>
        )}
      </View>

      {/* 3. Edge Offline Survivability Box */}
      <View style={styles.edgeSurvCard}>
        <View style={styles.edgeSurvHeader}>
          <View style={styles.edgeSurvLeft}>
            <MaterialCommunityIcons
              name={isLocalLan ? 'wifi-check' : 'cloud-sync'}
              size={20}
              color={isLocalLan ? '#7CD3FF' : colors.primaryBright}
            />
            <View>
              <Text style={styles.edgeSurvTitle}>Edge Offline Survivability</Text>
              <Text style={styles.edgeSurvSub}>
                {isLocalLan
                  ? 'Local LAN WebSocket active (mDNS @ 8ms latency)'
                  : 'Cloud WSS MQTT Gateway active (118ms latency)'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.fiberCutBtn, isLocalLan && styles.fiberCutBtnLan]}
            onPress={toggleSimulatedFiberOutage}
            activeOpacity={0.8}
          >
            <Text style={[styles.fiberCutText, isLocalLan && { color: '#7CD3FF' }]}>
              {isLocalLan ? 'Fiber Reconnect' : 'Simulate Cut'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Self-Consumption Maximization vs Net Billing Mode */}
      <View style={styles.netBillingCard}>
        <View style={styles.nbHeader}>
          <View style={styles.nbLeft}>
            <MaterialCommunityIcons name="swap-vertical-bold" size={20} color={colors.primaryBright} />
            <View>
              <Text style={styles.nbTitle}>Net Billing Self-Consumption Engine</Text>
              <Text style={styles.nbSubtitle}>
                {netBillingActive
                  ? 'Minimizing export (Rs. 11/kWh) by absorbing surplus into home loads'
                  : 'Legacy 1:1 Net Metering mode active'}
              </Text>
            </View>
          </View>
          <Switch
            value={netBillingActive}
            onValueChange={toggleNetBillingMode}
            trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryBright }}
            thumbColor={netBillingActive ? '#FFFFFF' : '#B0B5BA'}
          />
        </View>

        <View style={styles.nbStatsRow}>
          <View style={styles.nbStat}>
            <Text style={styles.nbStatLabel}>EXPORT RETURN</Text>
            <Text style={styles.nbStatVal}>~₨ 11.20 <Text style={styles.nbStatUnit}>/ kWh</Text></Text>
          </View>
          <View style={styles.nbStat}>
            <Text style={styles.nbStatLabel}>GRID IMPORT COST</Text>
            <Text style={[styles.nbStatVal, { color: colors.secondaryContainer }]}>
              ₨ 58.50 <Text style={styles.nbStatUnit}>/ kWh</Text>
            </Text>
          </View>
          <View style={styles.nbStat}>
            <Text style={styles.nbStatLabel}>ARBITRAGE ADVANTAGE</Text>
            <Text style={[styles.nbStatVal, { color: colors.primaryBright }]}>+₨ 47.30</Text>
          </View>
        </View>
      </View>

      {/* 5. Solar Yield & Soiling / Dust Health Tracker */}
      <View style={styles.soilingCard}>
        <View style={styles.soilingHeader}>
          <View style={styles.soilingLeft}>
            <MaterialCommunityIcons name="weather-sunny-alert" size={20} color={colors.secondaryContainer} />
            <View>
              <Text style={styles.soilingTitle}>Solar Soiling & Degradation Sentinel</Text>
              <Text style={styles.soilingSubtitle}>5-Day Rolling Clear-Sky Theoretical Variance</Text>
            </View>
          </View>
          <View style={styles.soilingPill}>
            <Text style={styles.soilingPillText}>{soilingHealth.clearSkyYieldRatio}% CLEAR SKY</Text>
          </View>
        </View>
        <Text style={styles.soilingText}>
          Panel output is running within optimal parameters. Estimated dust loss is negligible (~{soilingHealth.dustImpactWatts} Watts). Next scheduled cleaning window: in 12 days.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: '100%',
  },
  reflexCard: {
    backgroundColor: 'rgba(28, 32, 40, 0.85)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
    gap: 8,
  },
  reflexHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reflexTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  reflexTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reflexSubtitle: {
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 1,
  },
  reflexPill: {
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  reflexPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  reflexDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  feederCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  feederCardNormal: {
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderColor: colors.borderGhost,
  },
  feederCardAlert: {
    backgroundColor: 'rgba(147, 0, 10, 0.25)',
    borderColor: 'rgba(255, 59, 48, 0.5)',
  },
  feederHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feederTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  feederTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  feederName: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  feederActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
  },
  radarBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  testTripBtn: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  testTripBtnActive: {
    backgroundColor: colors.errorBright,
  },
  testTripText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  feederAlertBox: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    padding: 8,
    borderRadius: 8,
  },
  feederAlertText: {
    fontSize: 11,
    color: colors.error,
    lineHeight: 16,
    fontWeight: '600',
  },
  feederNormalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  normalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryBright,
  },
  normalPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  feederTelemetryMeta: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  edgeSurvCard: {
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  edgeSurvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  edgeSurvLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  edgeSurvTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  edgeSurvSub: {
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 1,
  },
  fiberCutBtn: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  fiberCutBtnLan: {
    backgroundColor: 'rgba(124, 211, 255, 0.15)',
    borderColor: 'rgba(124, 211, 255, 0.3)',
  },
  fiberCutText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  netBillingCard: {
    backgroundColor: 'rgba(28, 32, 40, 0.85)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    gap: 12,
  },
  nbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nbLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  nbTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nbSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
    marginTop: 2,
  },
  nbStatsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  nbStat: {
    flex: 1,
  },
  nbStatLabel: {
    fontSize: 7,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  nbStatVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  nbStatUnit: {
    fontSize: 9,
    fontWeight: '400',
    color: colors.textMuted,
  },
  soilingCard: {
    backgroundColor: 'rgba(28, 32, 40, 0.85)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    gap: 8,
  },
  soilingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  soilingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  soilingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  soilingSubtitle: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  soilingPill: {
    backgroundColor: 'rgba(254, 183, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  soilingPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  soilingText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
