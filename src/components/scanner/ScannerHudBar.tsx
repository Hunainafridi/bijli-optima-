import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface ScannerHudBarProps {
  flashActive: boolean;
  onToggleFlash: () => void;
  confidenceScore?: number;
}

export const ScannerHudBar: React.FC<ScannerHudBarProps> = ({
  flashActive,
  onToggleFlash,
  confidenceScore = 99.4,
}) => {
  return (
    <View style={styles.container}>
      {/* Left: Core status */}
      <View style={styles.leftRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="text-box-search-outline" size={18} color={colors.primaryBright} />
          <View style={styles.pulseDot} />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.coreTitle}>GEMINI-2.5 OCR CORE</Text>
          <Text style={styles.coreSub}>AUTO-SEGMENTATION: ACTIVE</Text>
        </View>
      </View>

      {/* Right: Confidence & Flash */}
      <View style={styles.rightRow}>
        <View style={styles.confBadge}>
          <Text style={styles.confLabel}>CONF:</Text>
          <Text style={styles.confValue}>{confidenceScore}%</Text>
        </View>

        <TouchableOpacity
          style={[styles.flashBtn, flashActive && styles.flashBtnActive]}
          onPress={onToggleFlash}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={flashActive ? 'flash' : 'flash-outline'}
            size={18}
            color={flashActive ? colors.onPrimary : colors.textSecondary}
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
    backgroundColor: 'rgba(28, 32, 40, 0.85)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryBright,
  },
  textCol: {},
  coreTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryBright,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  coreSub: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  confValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  flashBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashBtnActive: {
    backgroundColor: colors.primaryBright,
  },
});
