import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface BillScanShortcutProps {
  onScanPress: () => void;
}

export const BillScanShortcut: React.FC<BillScanShortcutProps> = ({ onScanPress }) => {
  return (
    <View style={styles.container}>
      {/* Cyan Glowing Aura */}
      <View style={styles.glowAura} />

      <View style={styles.contentRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="file-document-outline" size={24} color={colors.tertiaryContainer} />
        </View>

        <View style={styles.textColumn}>
          <Text style={styles.title} numberOfLines={1}>
            Monthly DISCO Tariff OCR
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Auto-extract tariff peak units, FPA taxes & adjustments
          </Text>
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={onScanPress} activeOpacity={0.8}>
          <Text style={styles.scanButtonText}>Scan</Text>
          <MaterialCommunityIcons name="qrcode-scan" size={16} color={colors.onTertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: 'rgba(28, 32, 40, 0.85)',
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    overflow: 'hidden',
    position: 'relative',
  },
  glowAura: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(124, 211, 255, 0.12)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scanButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onTertiary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
