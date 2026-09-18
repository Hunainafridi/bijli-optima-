import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy, ApplianceRelay } from '../../context/EnergyContext';

interface QuickRelayListProps {
  onRequirePin: (relay: ApplianceRelay) => void;
}

export const QuickRelayList: React.FC<QuickRelayListProps> = ({ onRequirePin }) => {
  const { relays, toggleRelay } = useEnergy();

  const handleToggle = async (relay: ApplianceRelay) => {
    const result = await toggleRelay(relay.id);
    if (result.requiresPin) {
      onRequirePin(relay);
    }
  };

  const activeCount = relays.filter((r) => r.isOn).length;

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <MaterialCommunityIcons name="toggle-switch" size={20} color={colors.primaryBright} />
          <Text style={styles.headerTitle}>Automated Load Relays</Text>
        </View>
        <Text style={styles.activeCounter}>
          {activeCount} / {relays.length} ON
        </Text>
      </View>

      {/* Appliance Rows */}
      <View style={styles.relayStack}>
        {relays.slice(0, 3).map((relay) => {
          const isPrimary = relay.accentColor === 'primary';
          const isSecondary = relay.accentColor === 'secondary';
          const iconColor = isPrimary
            ? colors.primaryBright
            : isSecondary
            ? colors.secondaryContainer
            : colors.textMuted;

          return (
            <View key={relay.id} style={styles.relayRow}>
              {/* Left Icon & Meta */}
              <View style={styles.leftInfo}>
                <View style={[styles.iconBox, { borderColor: iconColor }]}>
                  <MaterialCommunityIcons
                    name={
                      relay.id === 'relay-ac'
                        ? 'fan'
                        : relay.id === 'relay-pump'
                        ? 'water-boiler'
                        : 'ev-station'
                    }
                    size={18}
                    color={iconColor}
                  />
                </View>
                <View style={styles.textColumn}>
                  <Text style={styles.applianceName} numberOfLines={1}>
                    {relay.name}
                  </Text>
                  <Text style={styles.applianceMeta} numberOfLines={1}>
                    {relay.statusText}
                  </Text>
                </View>
              </View>

              {/* Right Toggle */}
              <Switch
                value={relay.isOn}
                onValueChange={() => handleToggle(relay)}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryBright }}
                thumbColor={relay.isOn ? '#FFFFFF' : '#B0B5BA'}
                ios_backgroundColor={colors.surfaceContainerHighest}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(28, 32, 40, 0.6)',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  activeCounter: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  relayStack: {
    gap: 8,
  },
  relayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(24, 28, 36, 0.65)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  applianceName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  applianceMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
