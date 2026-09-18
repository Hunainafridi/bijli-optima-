import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

export const PowerRoutingBus: React.FC = () => {
  const { telemetry, streamMetrics } = useEnergy();

  const isLocalLan = streamMetrics.transport === 'LOCAL_LAN_WS';
  const isGridDead = telemetry.gridVolts === 0;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="routes" size={18} color={colors.primaryBright} />
          <Text style={styles.headerTitle}>DYNAMIC POWER ROUTING BUS</Text>
        </View>
        <View style={styles.zeroSpillPill}>
          <View style={[styles.greenDot, isGridDead && { backgroundColor: colors.errorBright }]} />
          <Text style={[styles.zeroSpillText, isGridDead && { color: colors.errorBright }]}>
            {isGridDead ? 'ISLAND MICROGRID' : 'ZERO GRID SPILL'}
          </Text>
        </View>
      </View>

      {/* Bus Routing Flow Container */}
      <View style={styles.busMatrixCard}>
        {/* Nodes Row with Connecting SVG Wave Lines */}
        <View style={styles.flowRow}>
          {/* 1. Solar Source */}
          <View style={styles.flowNode}>
            <View style={[styles.nodeIcon, { backgroundColor: 'rgba(0, 229, 153, 0.15)' }]}>
              <MaterialCommunityIcons name="solar-power-variant" size={22} color={colors.primaryBright} />
            </View>
            <Text style={styles.nodeKw}>{telemetry.solarKw.toFixed(2)} kW</Text>
            <Text style={styles.nodeName}>Solar PV</Text>
          </View>

          {/* SVG Wave Conduits: Solar -> Hybrid Bus */}
          <View style={styles.waveContainer}>
            <Svg width="100%" height={26} viewBox="0 0 70 26">
              <Path
                d="M 0,13 Q 18,0 35,13 T 70,13"
                fill="none"
                stroke="rgba(0, 229, 153, 0.6)"
                strokeWidth={Math.min(3.5, Math.max(1.8, telemetry.solarKw * 0.7))}
              />
              <Circle cx={35} cy={13} r={3} fill={colors.primaryBright} />
            </Svg>
            <View style={styles.busPill}>
              <Text style={styles.busPillText}>HYBRID BUS</Text>
            </View>
          </View>

          {/* 2. Total In-House Draw */}
          <View style={styles.flowNode}>
            <View style={[styles.nodeIcon, { backgroundColor: 'rgba(254, 183, 0, 0.15)' }]}>
              <MaterialCommunityIcons name="home-lightning-bolt-outline" size={22} color={colors.secondaryContainer} />
            </View>
            <Text style={styles.nodeKw}>{telemetry.houseLoadKw.toFixed(2)} kW</Text>
            <Text style={styles.nodeName}>Total Draw</Text>
          </View>

          {/* SVG Wave Conduits: Hybrid -> Batt Invert */}
          <View style={styles.waveContainer}>
            <Svg width="100%" height={26} viewBox="0 0 70 26">
              <Path
                d="M 0,13 Q 18,26 35,13 T 70,13"
                fill="none"
                stroke="rgba(254, 183, 0, 0.6)"
                strokeWidth={Math.min(3.5, Math.max(1.8, telemetry.houseLoadKw * 0.7))}
              />
              <Circle cx={35} cy={13} r={3} fill={colors.secondaryContainer} />
            </Svg>
            <View style={[styles.busPill, { backgroundColor: 'rgba(254, 183, 0, 0.15)' }]}>
              <Text style={[styles.busPillText, { color: colors.secondaryContainer }]}>
                {telemetry.batteryAmps >= 0 ? 'BATT CHG' : 'BATT INVERT'}
              </Text>
            </View>
          </View>

          {/* 3. Discom Grid Bypass */}
          <View style={[styles.flowNode, { opacity: isGridDead ? 0.4 : 0.85 }]}>
            <View
              style={[
                styles.nodeIcon,
                { backgroundColor: isGridDead ? 'rgba(255, 59, 48, 0.12)' : colors.surfaceContainerHigh },
              ]}
            >
              <MaterialCommunityIcons
                name={isGridDead ? 'transmission-tower-off' : 'power-plug-outline'}
                size={22}
                color={isGridDead ? colors.errorBright : colors.textMuted}
              />
            </View>
            <Text
              style={[
                styles.nodeKw,
                isGridDead && { color: colors.errorBright },
              ]}
            >
              {isGridDead ? '0.0 kW' : `${telemetry.gridKw.toFixed(1)} kW`}
            </Text>
            <Text style={[styles.nodeName, isGridDead && { color: colors.errorBright }]}>
              {isGridDead ? 'Feeder Out' : 'Discom'}
            </Text>
          </View>
        </View>

        {/* Micro-switching strip */}
        <View style={styles.latencyStrip}>
          <View style={styles.latencyLeft}>
            <View style={[styles.greenDot, isLocalLan && { backgroundColor: '#7CD3FF' }]} />
            <Text style={styles.latencyLabel}>
              {isLocalLan ? 'Local ESP32 LAN WebSocket (mDNS)' : 'Cloud WebSocket MQTT Gateway'}
            </Text>
          </View>
          <Text style={[styles.latencyValue, isLocalLan && { color: '#7CD3FF' }]}>
            {streamMetrics.latencyMs}ms Roundtrip (Sub-120ms Ack)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  zeroSpillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryBright,
  },
  zeroSpillText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryBright,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  busMatrixCard: {
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    gap: 12,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flowNode: {
    alignItems: 'center',
    width: 64,
  },
  nodeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  nodeKw: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  nodeName: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  waveContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  busPill: {
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  busPillText: {
    fontSize: 7,
    fontWeight: '800',
    color: colors.primaryBright,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  latencyStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  latencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  latencyLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  latencyValue: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
