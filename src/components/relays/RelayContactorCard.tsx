import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { ApplianceRelay, useEnergy } from '../../context/EnergyContext';

interface RelayContactorCardProps {
  relay: ApplianceRelay;
  onRequirePin: (relay: ApplianceRelay) => void;
}

export const RelayContactorCard: React.FC<RelayContactorCardProps> = ({
  relay,
  onRequirePin,
}) => {
  const { toggleRelay } = useEnergy();

  const handleToggle = async () => {
    const result = await toggleRelay(relay.id);
    if (result.requiresPin) {
      onRequirePin(relay);
    }
  };

  const isPrimary = relay.accentColor === 'primary';
  const isSecondary = relay.accentColor === 'secondary';
  const isError = relay.accentColor === 'error';

  const badgeBg = isPrimary
    ? 'rgba(0, 229, 153, 0.15)'
    : isSecondary
    ? 'rgba(254, 183, 0, 0.15)'
    : isError
    ? 'rgba(255, 59, 48, 0.15)'
    : colors.surfaceContainerHighest;

  const badgeColor = isPrimary
    ? colors.primaryBright
    : isSecondary
    ? colors.secondaryContainer
    : isError
    ? colors.errorBright
    : colors.textSecondary;

  return (
    <View style={styles.card}>
      {/* Upper Information Row */}
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <View style={[styles.iconBox, { backgroundColor: badgeBg }]}>
            <MaterialCommunityIcons
              name={
                relay.id === 'relay-ac'
                  ? 'fan'
                  : relay.id === 'relay-pump'
                  ? 'water-pump'
                  : relay.id === 'relay-ev'
                  ? 'ev-station'
                  : 'server'
              }
              size={22}
              color={badgeColor}
            />
          </View>
          <View style={styles.textColumn}>
            <View style={styles.nameRow}>
              <Text style={styles.applianceName} numberOfLines={1}>
                {relay.name}
              </Text>
              <View style={[styles.tagPill, { backgroundColor: badgeBg }]}>
                <Text style={[styles.tagPillText, { color: badgeColor }]}>{relay.tag}</Text>
              </View>
            </View>
            <Text style={styles.roomText} numberOfLines={1}>
              {relay.roomOrZone}
            </Text>
          </View>
        </View>

        {/* Right Switch / Contactor Button */}
        {relay.isImmutable ? (
          <View style={styles.immutableBadge}>
            <MaterialCommunityIcons name="shield-check" size={14} color={colors.primaryBright} />
            <Text style={styles.immutableText}>IMMUTABLE</Text>
          </View>
        ) : (relay.cooldownSecondsRemaining || 0) > 0 ? (
          <TouchableOpacity
            style={styles.cooldownBadge}
            onPress={handleToggle}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="timer-sand" size={14} color={colors.secondaryContainer} />
            <Text style={styles.cooldownText}>{relay.cooldownSecondsRemaining}s COOL</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.contactorToggle,
              relay.isOn ? styles.toggleOn : styles.toggleOff,
            ]}
            onPress={handleToggle}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.toggleThumb,
                relay.isOn ? styles.thumbRight : styles.thumbLeft,
              ]}
            >
              <MaterialCommunityIcons
                name={
                  relay.isLocked && !relay.isOn
                    ? 'lock'
                    : relay.isOn
                    ? 'lightning-bolt'
                    : 'clock-outline'
                }
                size={14}
                color={
                  relay.isLocked && !relay.isOn
                    ? colors.errorBright
                    : relay.isOn
                    ? colors.primaryBright
                    : colors.surfaceContainer
                }
              />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Sub-Strip: Power Draw and Savings Meta */}
      <View style={styles.subStrip}>
        <View style={styles.drawCol}>
          <Text style={styles.drawValue}>{relay.drawKw} kW</Text>
          <Text style={styles.drawLabel}>
            {relay.id === 'relay-pump' || relay.id === 'relay-ev' ? 'Rating' : 'Draw'}
          </Text>
        </View>

        <View style={styles.centerMeta}>
          {(relay.cooldownSecondsRemaining || 0) > 0 ? (
            <Text style={styles.cooldownNotice}>Hardware Cool-down Active (Anti-Burnout)</Text>
          ) : relay.id === 'relay-ac' ? (
            <Text style={styles.gridZero}>Grid 0 W • ₨ 0.00/hr Discom</Text>
          ) : relay.id === 'relay-pump' ? (
            <View style={styles.nextRunRow}>
              <MaterialCommunityIcons name="calendar-clock" size={12} color={colors.secondaryContainer} />
              <Text style={styles.nextRunText}>Next Run: 11:30 AM Solar Peak</Text>
            </View>
          ) : relay.id === 'relay-ev' ? (
            <Text style={styles.autoUnlockText}>Auto-unlocks at 22:00</Text>
          ) : (
            <Text style={styles.uptimeText}>Dual Inverter Redundancy</Text>
          )}
        </View>

        <View style={styles.rightBenefit}>
          {relay.id === 'relay-ac' ? (
            <View style={styles.optimizedRow}>
              <MaterialCommunityIcons name="check-circle" size={13} color={colors.primaryBright} />
              <Text style={styles.optimizedText}>Optimized</Text>
            </View>
          ) : relay.id === 'relay-pump' ? (
            <Text style={styles.benefitText}>₨ 150 saved</Text>
          ) : relay.id === 'relay-ev' ? (
            <Text style={[styles.benefitText, { color: colors.primaryBright }]}>₨ 24.5/kWh Saving</Text>
          ) : (
            <Text style={[styles.benefitText, { color: colors.primaryBright }]}>99.99% Uptime</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(28, 32, 40, 0.85)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  applianceName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  tagPillText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  roomText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  immutableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  immutableText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  contactorToggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: colors.primaryBright,
  },
  toggleOff: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  thumbRight: {
    alignSelf: 'flex-end',
  },
  thumbLeft: {
    alignSelf: 'flex-start',
  },
  subStrip: {
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
  drawCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  drawValue: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  drawLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  centerMeta: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  gridZero: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  nextRunRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nextRunText: {
    fontSize: 9,
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  autoUnlockText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  uptimeText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  rightBenefit: {
    alignItems: 'flex-end',
  },
  optimizedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  optimizedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  benefitText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cooldownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(254, 183, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(254, 183, 0, 0.4)',
  },
  cooldownText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cooldownNotice: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.secondaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
