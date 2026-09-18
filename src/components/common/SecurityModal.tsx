import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface SecurityModalProps {
  visible: boolean;
  mode: 'pin-override' | 'security-status';
  title?: string;
  description?: string;
  onSuccess: (pin?: string) => void;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  visible,
  mode,
  title = 'High-Voltage Breaker Authorization',
  description = 'Wallbox charger is locked during 17:00–21:00 peak hours to protect NEPRA Slab 3. Enter safety PIN to override.',
  onSuccess,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleConfirm = () => {
    if (mode === 'pin-override') {
      if (!pin) {
        setErrorText('Please enter 4-digit PIN (Default: 2468)');
        return;
      }
      if (pin !== '2468') {
        setErrorText('Invalid Safety PIN. Overdraw protection retained.');
        return;
      }
      setErrorText('');
      setPin('');
      onSuccess(pin);
    } else {
      onSuccess();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons
                name={mode === 'pin-override' ? 'shield-lock-outline' : 'shield-check'}
                size={24}
                color={colors.secondaryContainer}
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>SAFETY INTERLOCK PROTOCOL</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <Text style={styles.description}>{description}</Text>

          {mode === 'pin-override' ? (
            <View style={styles.pinSection}>
              <Text style={styles.pinLabel}>ENTER OPERATIONAL SAFETY PIN</Text>
              <TextInput
                style={styles.pinInput}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={pin}
                onChangeText={(val) => {
                  setPin(val);
                  setErrorText('');
                }}
                placeholder="••••"
                placeholderTextColor={colors.textDim}
                autoFocus
              />
              <Text style={styles.hintText}>Default Security PIN: 2468</Text>
              {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
            </View>
          ) : (
            <View style={styles.securityStack}>
              <View style={styles.securityRow}>
                <MaterialCommunityIcons name="check-decagram" size={18} color={colors.primaryBright} />
                <Text style={styles.securityRowText}>Hardware Keystore: AES-256 Active</Text>
              </View>
              <View style={styles.securityRow}>
                <MaterialCommunityIcons name="lock-outline" size={18} color={colors.primaryBright} />
                <Text style={styles.securityRowText}>Account Isolation: Scoped to UID</Text>
              </View>
              <View style={styles.securityRow}>
                <MaterialCommunityIcons name="shield-airplane" size={18} color={colors.primaryBright} />
                <Text style={styles.securityRowText}>Anti-Tamper: Parameterized OCR Validator</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>
                {mode === 'pin-override' ? 'Authorize Contactor' : 'Done'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 14, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(254, 183, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.secondaryContainer,
    letterSpacing: 1,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  closeBtn: {
    padding: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  pinSection: {
    marginBottom: 16,
  },
  pinLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  pinInput: {
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderGhost,
    color: colors.primaryBright,
    fontSize: 22,
    letterSpacing: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  hintText: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 6,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 11,
    color: colors.errorBright,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  securityStack: {
    gap: 10,
    marginBottom: 16,
    backgroundColor: colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 10,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityRowText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primaryBright,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});
