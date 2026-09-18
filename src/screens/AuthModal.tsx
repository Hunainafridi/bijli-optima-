import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenSecurityStatus: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onClose,
  onOpenSecurityStatus,
}) => {
  const { user, logout, loginWithGoogle } = useAuth();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Energy Operations Account</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* User Details */}
          {user ? (
            <View style={styles.profileSection}>
              <View style={styles.avatarRow}>
                <Image
                  source={require('../../assets/avatar.png')}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                <View style={styles.userMeta}>
                  <View style={styles.verifiedRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <MaterialCommunityIcons name="check-decagram" size={16} color={colors.primaryBright} />
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{user.role}</Text>
                  </View>
                </View>
              </View>

              {/* Utility Telemetry Credentials */}
              <View style={styles.credentialsGrid}>
                <View style={styles.credItem}>
                  <Text style={styles.credLabel}>DISCO PROVIDER</Text>
                  <Text style={styles.credValue}>{user.discoProvider}</Text>
                </View>
                <View style={styles.credItem}>
                  <Text style={styles.credLabel}>GRID ZONE</Text>
                  <Text style={styles.credValue}>{user.gridZone}</Text>
                </View>
              </View>

              {/* Security Status Trigger Button */}
              <TouchableOpacity
                style={styles.securityAuditBtn}
                onPress={onOpenSecurityStatus}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="shield-check" size={18} color={colors.primaryBright} />
                <View style={styles.auditTextCol}>
                  <Text style={styles.auditTitle}>Hardware Security Vault Active</Text>
                  <Text style={styles.auditSubtitle}>AES-256 Token Encryption • Zero Key Leaks</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Logout / Switch Account */}
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={async () => {
                  await logout();
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="logout" size={16} color={colors.errorBright} />
                <Text style={styles.logoutText}>Sign Out of Google Session</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loggedOutSection}>
              <MaterialCommunityIcons name="google" size={40} color={colors.primaryBright} />
              <Text style={styles.loggedOutHeading}>Sign In with Google</Text>
              <Text style={styles.loggedOutDesc}>
                Connect your real Gmail account for strict per-user bill isolation and encrypted cloud sync.
              </Text>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={async () => {
                  await loginWithGoogle();
                  onClose();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.loginBtnText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 14, 0.85)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.surfaceContainer,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  profileSection: {
    gap: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primaryBright,
  },
  userMeta: {
    flex: 1,
    gap: 3,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondaryContainer,
    letterSpacing: 0.5,
  },
  credentialsGrid: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  credItem: {},
  credLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  credValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  securityAuditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 229, 153, 0.1)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
  },
  auditTextCol: {
    flex: 1,
  },
  auditTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryBright,
  },
  auditSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.errorBright,
  },
  loggedOutSection: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  loggedOutHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  loggedOutDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  loginBtn: {
    backgroundColor: colors.primaryBright,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  loginBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});
