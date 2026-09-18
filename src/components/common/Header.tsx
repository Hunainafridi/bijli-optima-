import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useEnergy } from '../../context/EnergyContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HeaderProps {
  onProfilePress?: () => void;
  onDualUtilityPress?: () => void;
  onFeederMeshPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onProfilePress,
  onDualUtilityPress,
  onFeederMeshPress,
}) => {
  const { user } = useAuth();
  const { telemetry, feederSentinel, streamMetrics, toggleSimulatedFiberOutage } = useEnergy();

  const isFeederTrip = feederSentinel.status === 'trip-warning';
  const isLocalLan = streamMetrics.transport === 'LOCAL_LAN_WS';
  const isGridDead = telemetry.gridVolts === 0;

  return (
    <View style={styles.container}>
      {/* Left: Brand Identity & Grid Sync Status */}
      <View style={styles.brandRow}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleColumn}>
          <View style={styles.titleRow}>
            <Text style={styles.appName}>BijliOptima</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v2.5 LIVE</Text>
            </View>
          </View>

          {/* Interactive Feeder Sync / Trip Status */}
          <TouchableOpacity
            style={styles.syncStatusRow}
            onPress={onFeederMeshPress}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.syncPulseDot,
                isFeederTrip && { backgroundColor: colors.errorBright },
                !isFeederTrip && isGridDead && { backgroundColor: colors.secondaryContainer },
              ]}
            />
            <Text
              style={[
                styles.syncStatusText,
                isFeederTrip && { color: colors.errorBright },
                !isFeederTrip && isGridDead && { color: colors.secondaryContainer },
              ]}
            >
              {isFeederTrip
                ? 'FEEDER 14: TRIP WARNING'
                : isGridDead
                ? 'GRID: ISLAND BLACKOUT'
                : 'FEEDER 14: SYNCHRONIZED'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Right: Transport Mode Switcher, Dual Utility & Telemetry Hz */}
      <View style={styles.rightSection}>
        {/* Local LAN vs Cloud Failover Pill (Tap to simulate fiber outage) */}
        <TouchableOpacity
          style={[
            styles.transportPill,
            isLocalLan && styles.transportPillLan,
          ]}
          onPress={toggleSimulatedFiberOutage}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={isLocalLan ? 'wifi' : 'cloud-check'}
            size={12}
            color={isLocalLan ? '#7CD3FF' : colors.primaryBright}
          />
          <Text style={[styles.transportPillText, isLocalLan && { color: '#7CD3FF' }]}>
            {isLocalLan ? `LAN ${streamMetrics.latencyMs}ms` : `WSS ${streamMetrics.latencyMs}ms`}
          </Text>
        </TouchableOpacity>

        {onDualUtilityPress && (
          <TouchableOpacity
            style={styles.gasArbitrageBtn}
            onPress={onDualUtilityPress}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="fire" size={15} color={colors.secondaryContainer} />
            <Text style={styles.gasArbitrageText}>GAS</Text>
          </TouchableOpacity>
        )}

        <View style={styles.telemetryBox}>
          <Text style={styles.telemetryLabel}>TELEMETRY</Text>
          <Text style={[styles.telemetryValue, isGridDead && { color: colors.errorBright }]}>
            {isGridDead ? '0.00 Hz' : `${telemetry.frequencyHz.toFixed(2)} Hz`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.avatarButton}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../../assets/avatar.png')}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 42,
    paddingBottom: 12,
    backgroundColor: 'rgba(15, 19, 28, 0.94)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGhost,
    zIndex: 100,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logo: {
    width: 30,
    height: 30,
  },
  titleColumn: {
    flexDirection: 'column',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  versionBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  versionText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  syncPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryBright,
  },
  syncStatusText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryBright,
    letterSpacing: 0.8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transportPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
  },
  transportPillLan: {
    backgroundColor: 'rgba(124, 211, 255, 0.12)',
    borderColor: 'rgba(124, 211, 255, 0.3)',
  },
  transportPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  telemetryBox: {
    alignItems: 'flex-end',
  },
  telemetryLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  telemetryValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  avatarButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.borderGlowPrimary,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHigh,
  },
  avatarImage: {
    width: 32,
    height: 32,
  },
  gasArbitrageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(254, 183, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(254, 183, 0, 0.3)',
  },
  gasArbitrageText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
