import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

interface FeederMeshRadarModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FeederMeshRadarModal: React.FC<FeederMeshRadarModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    feederSentinel,
    feederNodes,
    streamMetrics,
    reflexEngineLog,
    simulateFeederTrip,
    restoreFeederSync,
    toggleSimulatedFiberOutage,
  } = useEnergy();

  const isTripped = feederSentinel.status === 'trip-warning';
  const isLocalLan = streamMetrics.transport === 'LOCAL_LAN_WS';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header Row */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.radarIconBox,
                  isTripped && { backgroundColor: 'rgba(255, 59, 48, 0.2)' },
                ]}
              >
                <MaterialCommunityIcons
                  name={isTripped ? 'radar' : 'transmission-tower'}
                  size={24}
                  color={isTripped ? colors.errorBright : colors.primaryBright}
                />
              </View>
              <View>
                <Text style={styles.modalTitle}>11kV Crowdsourced Feeder Radar</Text>
                <Text style={styles.modalSubtitle}>
                  {feederSentinel.feederName} • 10s Telemetry Ping
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <MaterialCommunityIcons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Status Summary Banner */}
            <View
              style={[
                styles.summaryBanner,
                isTripped ? styles.summaryBannerTripped : styles.summaryBannerNormal,
              ]}
            >
              <View style={styles.summaryTop}>
                <View style={styles.summaryPill}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isTripped ? colors.errorBright : colors.primaryBright },
                    ]}
                  />
                  <Text
                    style={[
                      styles.summaryPillText,
                      { color: isTripped ? colors.errorBright : colors.primaryBright },
                    ]}
                  >
                    {isTripped ? 'FEEDER STATUS: TRIPPED' : 'FEEDER STATUS: SYNCHRONIZED'}
                  </Text>
                </View>
                <Text style={styles.reserveSocBadge}>
                  LOCK RESERVE: {feederSentinel.recommendedReserveSoc}% SoC
                </Text>
              </View>
              <Text style={styles.summaryDescription}>
                {isTripped
                  ? `Preemptive Grid Blackout active! 4/5 neighborhood smart nodes reported complete grid voltage collapse. Reserve battery locked at 90% to guarantee home survival.`
                  : `5 residential smart edge bridges reporting nominal 228V / 50.0Hz across the 11kV branch. No upstream phase collapses detected.`}
              </Text>
            </View>

            {/* Live Neighborhood Feeder Mesh Nodes */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>DISTRIBUTION BRANCH SMART NODES (5)</Text>
              <Text style={styles.sectionSub}>10s PING TELEMETRY</Text>
            </View>

            <View style={styles.nodesList}>
              {feederNodes.map((node) => {
                const isNodeDead = node.status === 'GRID_COLLAPSE' || node.gridVolts < 100;
                return (
                  <View
                    key={node.nodeId}
                    style={[
                      styles.nodeItem,
                      isNodeDead && styles.nodeItemDead,
                    ]}
                  >
                    <View style={styles.nodeItemLeft}>
                      <View
                        style={[
                          styles.nodeStatusDot,
                          { backgroundColor: isNodeDead ? colors.errorBright : colors.primaryBright },
                        ]}
                      />
                      <View>
                        <Text style={styles.nodeLabel}>{node.label}</Text>
                        <Text style={styles.nodePing}>
                          Ping: {node.lastPingMsAgo}ms ago • {node.hasSolarBattery ? 'Solar + Batt' : 'Grid Only'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.nodeItemRight}>
                      <Text
                        style={[
                          styles.nodeVolts,
                          isNodeDead && { color: colors.errorBright },
                        ]}
                      >
                        {isNodeDead ? '0.0 V' : `${node.gridVolts.toFixed(1)} V`}
                      </Text>
                      <Text style={styles.nodeHz}>
                        {isNodeDead ? '0.00 Hz' : `${node.frequencyHz.toFixed(2)} Hz`}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Instant Reflex Engine Activity Log */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>INSTANT REFLEX ENGINE LOG (0-100ms)</Text>
              <Text style={styles.sectionSub}>DETERMINISTIC IN-MEMORY</Text>
            </View>

            <View style={styles.reflexLogCard}>
              {reflexEngineLog.map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logTop}>
                    <View style={styles.logTypeRow}>
                      <MaterialCommunityIcons
                        name={
                          log.type === 'OVERLOAD_SURGE_SHED'
                            ? 'flash-alert'
                            : 'swap-horizontal-bold'
                        }
                        size={14}
                        color={
                          log.type === 'OVERLOAD_SURGE_SHED'
                            ? colors.errorBright
                            : colors.primaryBright
                        }
                      />
                      <Text
                        style={[
                          styles.logType,
                          {
                            color:
                              log.type === 'OVERLOAD_SURGE_SHED'
                                ? colors.errorBright
                                : colors.primaryBright,
                          },
                        ]}
                      >
                        {log.type}
                      </Text>
                    </View>
                    <Text style={styles.logTime}>
                      {log.timestamp} • <Text style={styles.logSpeed}>{log.executionMs}ms</Text>
                    </Text>
                  </View>
                  <Text style={styles.logAction}>{log.action}</Text>
                </View>
              ))}
            </View>

            {/* Edge Offline Survivability Box */}
            <View style={styles.survivabilityCard}>
              <View style={styles.survHeader}>
                <MaterialCommunityIcons
                  name={isLocalLan ? 'wifi-check' : 'cloud-sync'}
                  size={20}
                  color={isLocalLan ? '#7CD3FF' : colors.primaryBright}
                />
                <View style={styles.survHeaderTexts}>
                  <Text style={styles.survTitle}>Edge Offline Survivability</Text>
                  <Text style={styles.survSubtitle}>
                    Active Transport: {isLocalLan ? 'Local LAN (mDNS @ 8ms)' : 'Cloud WSS (118ms)'}
                  </Text>
                </View>
              </View>
              <Text style={styles.survText}>
                During fiber or 4G blackouts, BijliOptima automatically switches from Cloud WebSockets to Local LAN mDNS (`ws://esp32-bijlioptima.local:81`). Monitoring, relay trip safeguards, and battery reserve locks continue uninterrupted.
              </Text>
            </View>

            {/* Simulation Controls */}
            <View style={styles.simControlsRow}>
              <TouchableOpacity
                style={[
                  styles.simBtn,
                  isTripped ? styles.simBtnRestore : styles.simBtnTrip,
                ]}
                onPress={isTripped ? restoreFeederSync : simulateFeederTrip}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={isTripped ? 'refresh' : 'alert-decagram'}
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.simBtnText}>
                  {isTripped ? 'Restore 11kV Feeder Sync' : 'Simulate 4/5 Node Feeder Trip'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fiberSimBtn}
                onPress={toggleSimulatedFiberOutage}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={isLocalLan ? 'cloud-upload' : 'wifi-off'}
                  size={16}
                  color={colors.textPrimary}
                />
                <Text style={styles.fiberSimText}>
                  {isLocalLan ? 'Reconnect Cloud Fiber' : 'Simulate Fiber Cut (LAN Mode)'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.88)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#0F131C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGhost,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radarIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    flexGrow: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  summaryBanner: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  summaryBannerNormal: {
    backgroundColor: 'rgba(0, 229, 153, 0.08)',
    borderColor: 'rgba(0, 229, 153, 0.3)',
  },
  summaryBannerTripped: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderColor: 'rgba(255, 59, 48, 0.5)',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  reserveSocBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textPrimary,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  summaryDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionSub: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  nodesList: {
    gap: 8,
  },
  nodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  nodeItemDead: {
    borderColor: 'rgba(255, 59, 48, 0.4)',
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
  },
  nodeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  nodeStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nodeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nodePing: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  nodeItemRight: {
    alignItems: 'flex-end',
  },
  nodeVolts: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  nodeHz: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  reflexLogCard: {
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    gap: 10,
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGhost,
    paddingBottom: 8,
  },
  logTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  logType: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logTime: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logSpeed: {
    color: colors.primaryBright,
    fontWeight: '700',
  },
  logAction: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  survivabilityCard: {
    backgroundColor: 'rgba(124, 211, 255, 0.08)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(124, 211, 255, 0.25)',
    gap: 8,
  },
  survHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  survHeaderTexts: {
    flex: 1,
  },
  survTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  survSubtitle: {
    fontSize: 9,
    color: '#7CD3FF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  survText: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  simControlsRow: {
    gap: 10,
    marginTop: 4,
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  simBtnTrip: {
    backgroundColor: '#FF3B30',
  },
  simBtnRestore: {
    backgroundColor: '#00E599',
  },
  simBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  fiberSimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  fiberSimText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
