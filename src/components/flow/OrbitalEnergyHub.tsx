import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, Easing } from 'react-native';
import Svg, { Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';

// Web-safe: on web, Animated.createAnimatedComponent doesn't work with SVG elements.
// We use a JS-driven state approach for web, and native Animated for mobile.
const isWeb = Platform.OS === 'web';
const AnimatedCircle = isWeb ? Circle : Animated.createAnimatedComponent(Circle);

export const OrbitalEnergyHub: React.FC = () => {
  const { telemetry, streamMetrics, feederSentinel } = useEnergy();

  // Tactile node bounce animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Velocity-driven particle progress values (0 to 1) — native only
  const solarProgress = useRef(new Animated.Value(0)).current;
  const loadProgress = useRef(new Animated.Value(0)).current;
  const gridProgress = useRef(new Animated.Value(0)).current;
  const batteryProgress = useRef(new Animated.Value(0)).current;

  // Native Animated velocity loops
  useEffect(() => {
    if (isWeb) return; // Web uses JS state instead
    const solarSpeed = Math.max(400, Math.min(3000, Math.round(3000 - telemetry.solarKw * 500)));
    const solarLoop = Animated.loop(
      Animated.timing(solarProgress, { toValue: 1, duration: solarSpeed, easing: Easing.linear, useNativeDriver: false })
    );
    solarLoop.start();

    const loadSpeed = Math.max(500, Math.min(2800, Math.round(2800 - telemetry.houseLoadKw * 450)));
    const loadLoop = Animated.loop(
      Animated.timing(loadProgress, { toValue: 1, duration: loadSpeed, easing: Easing.linear, useNativeDriver: false })
    );
    loadLoop.start();

    let gridLoop: Animated.CompositeAnimation | null = null;
    if (telemetry.gridVolts > 0 && Math.abs(telemetry.gridKw) > 0.1) {
      const gridSpeed = Math.max(600, Math.min(2500, Math.round(2500 - Math.abs(telemetry.gridKw) * 400)));
      gridLoop = Animated.loop(
        Animated.timing(gridProgress, { toValue: 1, duration: gridSpeed, easing: Easing.linear, useNativeDriver: false })
      );
      gridLoop.start();
    } else {
      gridProgress.setValue(0);
    }

    const battSpeed = Math.max(600, Math.min(2600, Math.round(2600 - Math.abs(telemetry.batteryAmps) * 40)));
    const battLoop = Animated.loop(
      Animated.timing(batteryProgress, { toValue: 1, duration: battSpeed, easing: Easing.linear, useNativeDriver: false })
    );
    battLoop.start();

    return () => {
      solarLoop.stop();
      loadLoop.stop();
      if (gridLoop) gridLoop.stop();
      battLoop.stop();
    };
  }, [telemetry.solarKw, telemetry.houseLoadKw, telemetry.gridKw, telemetry.batteryAmps, telemetry.gridVolts]);

  // Web fallback: JS-driven particle positions using useState + setInterval
  const [webParticles, setWebParticles] = useState({ solarY: 52, loadY: 185, gridX: 52, battX: 248 });
  const webParticleProgress = useRef({ solar: 0, load: 0, grid: 0, batt: 0 });

  useEffect(() => {
    if (!isWeb) return;
    const FPS = 30;
    const TICK = 1000 / FPS;
    const interval = setInterval(() => {
      const p = webParticleProgress.current;
      const solarSpeed = Math.max(400, Math.min(3000, 3000 - telemetry.solarKw * 500));
      const loadSpeed = Math.max(500, Math.min(2800, 2800 - telemetry.houseLoadKw * 450));
      const gridSpeed = Math.max(600, Math.min(2500, 2500 - Math.abs(telemetry.gridKw) * 400));
      const battSpeed = Math.max(600, Math.min(2600, 2600 - Math.abs(telemetry.batteryAmps) * 40));

      p.solar = (p.solar + TICK / solarSpeed) % 1;
      p.load = (p.load + TICK / loadSpeed) % 1;
      p.grid = telemetry.gridVolts > 0 ? (p.grid + TICK / gridSpeed) % 1 : 0;
      p.batt = (p.batt + TICK / battSpeed) % 1;

      const exprt = telemetry.gridKw < 0;
      const charging = telemetry.batteryAmps > 0;
      setWebParticles({
        solarY: 52 + p.solar * 63,
        loadY: 185 + p.load * 63,
        gridX: exprt ? 115 - p.grid * 63 : 52 + p.grid * 63,
        battX: charging ? 185 + p.batt * 63 : 248 - p.batt * 63,
      });
    }, TICK);
    return () => clearInterval(interval);
  }, [telemetry.solarKw, telemetry.houseLoadKw, telemetry.gridKw, telemetry.batteryAmps, telemetry.gridVolts]);

  const triggerNodeBounce = () => {
    const nd = !isWeb; // useNativeDriver only on native
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.93, duration: 100, useNativeDriver: nd }),
      Animated.timing(scaleAnim, { toValue: 1.06, duration: 150, useNativeDriver: nd }),
      Animated.timing(scaleAnim, { toValue: 1.0, duration: 120, useNativeDriver: nd }),
    ]).start();
  };

  // Native-only: Animated interpolated coordinates / Web fallback numbers
  const solarParticleY = isWeb ? webParticles.solarY : solarProgress.interpolate({ inputRange: [0, 1], outputRange: [52, 115] });
  const loadParticleY = isWeb ? webParticles.loadY : loadProgress.interpolate({ inputRange: [0, 1], outputRange: [185, 248] });
  const isGridExport = telemetry.gridKw < 0;
  const gridParticleX = isWeb ? webParticles.gridX : gridProgress.interpolate({ inputRange: [0, 1], outputRange: isGridExport ? [115, 52] : [52, 115] });
  const isBatteryCharging = telemetry.batteryAmps > 0;
  const batteryParticleX = isWeb ? webParticles.battX : batteryProgress.interpolate({ inputRange: [0, 1], outputRange: isBatteryCharging ? [185, 248] : [248, 185] });

  const isGridDead = telemetry.gridVolts === 0;
  const isFeederWarning = feederSentinel.status === 'trip-warning';

  return (
    <View style={styles.container}>
      {/* Top Header Row of Hub */}
      <View style={styles.headerRow}>
        <View style={styles.syncPill}>
          <MaterialCommunityIcons
            name={isGridDead ? 'transmission-tower-off' : 'rotate-3d-variant'}
            size={14}
            color={isGridDead ? colors.errorBright : colors.primaryBright}
          />
          <Text style={[styles.syncPillText, isGridDead && { color: colors.errorBright }]}>
            {streamMetrics.streamRateHz.toFixed(1)} Hz STREAM • {streamMetrics.latencyMs}ms ({streamMetrics.transport === 'LOCAL_LAN_WS' ? 'LAN' : 'CLOUD'})
          </Text>
        </View>
        <TouchableOpacity style={styles.tuneBtn} onPress={triggerNodeBounce}>
          <MaterialCommunityIcons name="tune-variant" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Orbital Arena Container */}
      <View style={styles.orbitalArena}>
        {/* SVG Conduits and Concentric Reference Rings */}
        <Svg width={300} height={300} style={styles.svgConduitCanvas}>
          <Defs>
            <LinearGradient id="solarGrad" x1="150" y1="40" x2="150" y2="150" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#FEB700" />
              <Stop offset="100%" stopColor="#00E599" />
            </LinearGradient>
            <LinearGradient id="gridGrad" x1="40" y1="150" x2="150" y2="150" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor={isGridDead ? '#FF3B30' : '#00E599'} />
              <Stop offset="100%" stopColor={isGridDead ? '#93000A' : '#75D1FF'} />
            </LinearGradient>
            <LinearGradient id="batteryGrad" x1="260" y1="150" x2="150" y2="150" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#7CD3FF" />
              <Stop offset="100%" stopColor="#00E599" />
            </LinearGradient>
            <LinearGradient id="loadGrad" x1="150" y1="150" x2="150" y2="260" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#00E599" />
              <Stop offset="100%" stopColor="#DFE2EE" />
            </LinearGradient>
          </Defs>

          {/* Concentric Guide Rings */}
          <Circle
            cx={150}
            cy={150}
            r={118}
            stroke="rgba(49, 53, 62, 0.4)"
            strokeWidth={1.5}
            strokeDasharray="4,6"
            fill="none"
          />
          <Circle
            cx={150}
            cy={150}
            r={78}
            stroke="rgba(38, 42, 51, 0.6)"
            strokeWidth={1}
            fill="none"
          />

          {/* Bus Interconnect Conduits (thickness reflects instantaneous wattage) */}
          {/* Top: Solar -> Center */}
          <Line
            x1={150}
            y1={52}
            x2={150}
            y2={115}
            stroke="url(#solarGrad)"
            strokeWidth={Math.min(6, Math.max(2.5, telemetry.solarKw * 1.2))}
            strokeLinecap="round"
          />
          {/* Left: Grid -> Center */}
          <Line
            x1={52}
            y1={150}
            x2={115}
            y2={150}
            stroke="url(#gridGrad)"
            strokeWidth={isGridDead ? 2 : Math.min(5, Math.max(2, Math.abs(telemetry.gridKw) * 1.2))}
            strokeDasharray={isGridDead ? '4,4' : undefined}
            strokeLinecap="round"
          />
          {/* Right: Battery -> Center */}
          <Line
            x1={248}
            y1={150}
            x2={185}
            y2={150}
            stroke="url(#batteryGrad)"
            strokeWidth={Math.min(5, Math.max(2.5, Math.abs(telemetry.batteryAmps) * 0.15 + 2))}
            strokeLinecap="round"
          />
          {/* Bottom: Center -> Load */}
          <Line
            x1={150}
            y1={185}
            x2={150}
            y2={248}
            stroke="url(#loadGrad)"
            strokeWidth={Math.min(6, Math.max(2.5, telemetry.houseLoadKw * 1.2))}
            strokeLinecap="round"
          />

          {/* 60 FPS Animated Velocity Particle Beacons */}
          {telemetry.solarKw > 0.1 && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <AnimatedCircle cx={150} cy={solarParticleY as any} r={4.5} fill="#FEB700" />
          )}

          {!isGridDead && Math.abs(telemetry.gridKw) > 0.05 && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <AnimatedCircle cx={gridParticleX as any} cy={150} r={4} fill={colors.tertiaryContainer} />
          )}

          {Math.abs(telemetry.batteryAmps) > 0.5 && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <AnimatedCircle cx={batteryParticleX as any} cy={150} r={4} fill={colors.primaryBright} />
          )}

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <AnimatedCircle cx={150} cy={loadParticleY as any} r={4.5} fill={colors.textPrimary} />
        </Svg>

        {/* ORBITAL NODE 1: SOLAR (TOP) */}
        <TouchableOpacity style={[styles.nodeCard, styles.nodeTop]} onPress={triggerNodeBounce} activeOpacity={0.8}>
          <View style={[styles.nodeIconBox, { backgroundColor: 'rgba(254, 183, 0, 0.15)' }]}>
            <MaterialCommunityIcons name="solar-power-variant-outline" size={24} color={colors.secondaryContainer} />
            <Text style={[styles.nodeMetric, { color: colors.secondaryContainer }]}>
              {telemetry.solarKw.toFixed(2)} kW
            </Text>
          </View>
          <Text style={styles.nodeLabel}>SOLAR PV</Text>
        </TouchableOpacity>

        {/* ORBITAL NODE 2: DISCO NET (LEFT) */}
        <TouchableOpacity style={[styles.nodeCard, styles.nodeLeft]} onPress={triggerNodeBounce} activeOpacity={0.8}>
          <View
            style={[
              styles.nodeIconBox,
              { backgroundColor: isGridDead ? 'rgba(255, 59, 48, 0.15)' : 'rgba(124, 211, 255, 0.15)' },
            ]}
          >
            <MaterialCommunityIcons
              name={isGridDead ? 'transmission-tower-off' : 'transmission-tower'}
              size={24}
              color={isGridDead ? colors.errorBright : colors.tertiaryContainer}
            />
            <Text
              style={[
                styles.nodeMetric,
                { color: isGridDead ? colors.errorBright : colors.tertiaryContainer },
              ]}
            >
              {isGridDead ? '0.0 kW' : `${telemetry.gridKw >= 0 ? '+' : ''}${telemetry.gridKw.toFixed(2)} kW`}
            </Text>
          </View>
          <Text style={[styles.nodeLabel, isGridDead && { color: colors.errorBright }]}>
            {isGridDead ? 'GRID COLLAPSE' : 'DISCO NET'}
          </Text>
        </TouchableOpacity>

        {/* ORBITAL NODE 3: BATTERY ESS (RIGHT) */}
        <TouchableOpacity style={[styles.nodeCard, styles.nodeRight]} onPress={triggerNodeBounce} activeOpacity={0.8}>
          <View style={[styles.nodeIconBox, { backgroundColor: 'rgba(0, 229, 153, 0.15)' }]}>
            <MaterialCommunityIcons
              name={telemetry.batteryAmps >= 0 ? 'battery-charging-high' : 'battery-arrow-down'}
              size={24}
              color={colors.primaryBright}
            />
            <Text style={[styles.nodeMetric, { color: colors.primaryBright }]}>
              {telemetry.batterySoc}%
            </Text>
          </View>
          <Text style={styles.nodeLabel}>
            {telemetry.batteryAmps >= 0 ? `+${telemetry.batteryAmps.toFixed(1)}A` : `${telemetry.batteryAmps.toFixed(1)}A`}
          </Text>
        </TouchableOpacity>

        {/* ORBITAL NODE 4: HOME LOAD (BOTTOM) */}
        <TouchableOpacity style={[styles.nodeCard, styles.nodeBottom]} onPress={triggerNodeBounce} activeOpacity={0.8}>
          <View style={[styles.nodeIconBox, { backgroundColor: 'rgba(223, 226, 238, 0.12)' }]}>
            <MaterialCommunityIcons name="home-lightning-bolt-outline" size={24} color={colors.textPrimary} />
            <Text style={[styles.nodeMetric, { color: colors.textPrimary }]}>
              {telemetry.houseLoadKw.toFixed(2)} kW
            </Text>
          </View>
          <Text style={styles.nodeLabel}>HOME LOAD</Text>
        </TouchableOpacity>

        {/* CENTER HUB: Microgrid Fusion Core Crystal */}
        <Animated.View style={[styles.centralHub, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity onPress={triggerNodeBounce} activeOpacity={0.85} style={styles.centralHubContent}>
            <MaterialCommunityIcons
              name={telemetry.inverterStatus === 'SURGE_PROTECT' ? 'shield-alert' : 'lightning-bolt'}
              size={28}
              color={
                telemetry.inverterStatus === 'SURGE_PROTECT'
                  ? colors.secondaryContainer
                  : colors.primaryBright
              }
            />
            <Text style={styles.hubTitle}>
              {isGridDead ? 'ISLAND' : 'HYBRID'}
            </Text>
            <Text
              style={[
                styles.hubSubtitle,
                isGridDead && { color: colors.tertiaryContainer },
                telemetry.inverterStatus === 'SURGE_PROTECT' && { color: colors.secondaryContainer },
              ]}
            >
              {telemetry.inverterStatus === 'SURGE_PROTECT'
                ? 'SURGE SHIELD'
                : isGridDead
                ? 'OFF-GRID LIVE'
                : 'ISLAND READY'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Active Inverter Telemetry Sub-Strip */}
      <View style={styles.inverterStrip}>
        <View style={styles.inverterLeft}>
          <View
            style={[
              styles.inverterDot,
              isGridDead && { backgroundColor: colors.errorBright },
            ]}
          />
          <Text style={styles.inverterText}>
            Inverter: <Text style={styles.inverterModel}>{telemetry.inverterModel}</Text>
          </Text>
        </View>
        <Text style={styles.inverterEff}>
          {isGridDead ? '0.00 Hz' : `${telemetry.frequencyHz.toFixed(2)} Hz`} • Eff {telemetry.inverterEff}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(24, 28, 36, 0.9)',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
    marginBottom: 4,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(38, 42, 51, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  syncPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tuneBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(38, 42, 51, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  orbitalArena: {
    width: 300,
    height: 300,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  svgConduitCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  nodeCard: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  nodeTop: {
    top: -4,
  },
  nodeLeft: {
    left: -4,
  },
  nodeRight: {
    right: -4,
  },
  nodeBottom: {
    bottom: -4,
  },
  nodeIconBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGhost,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nodeMetric: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  nodeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 3,
    letterSpacing: 0.6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  centralHub: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(10, 14, 22, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 153, 0.4)',
    shadowColor: colors.primaryBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    zIndex: 15,
  },
  centralHubContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  hubSubtitle: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.primaryBright,
    letterSpacing: 1.2,
    marginTop: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inverterStrip: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderGhost,
  },
  inverterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inverterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryBright,
  },
  inverterText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  inverterModel: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  inverterEff: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
