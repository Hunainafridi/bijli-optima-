import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export type TabKey = 'flow' | 'ocr' | 'relays' | 'tariff';

interface BottomTabBarProps {
  activeTab: TabKey;
  onTabSelect: (tab: TabKey) => void;
  onOpenCopilot: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabSelect,
  onOpenCopilot,
}) => {
  return (
    <View style={styles.container}>
      {/* Tab 1: Flow */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabSelect('flow')}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={22}
            color={activeTab === 'flow' ? colors.primaryBright : colors.textMuted}
          />
          {activeTab === 'flow' && <View style={styles.activeIndicatorDot} />}
        </View>
        <Text style={[styles.tabLabel, activeTab === 'flow' ? styles.activeTabLabel : styles.inactiveTabLabel]}>
          Flow
        </Text>
      </TouchableOpacity>

      {/* Tab 2: OCR */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabSelect('ocr')}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="text-box-search-outline"
            size={22}
            color={activeTab === 'ocr' ? colors.primaryBright : colors.textMuted}
          />
          {activeTab === 'ocr' && <View style={styles.activeIndicatorDot} />}
        </View>
        <Text style={[styles.tabLabel, activeTab === 'ocr' ? styles.activeTabLabel : styles.inactiveTabLabel]}>
          OCR
        </Text>
      </TouchableOpacity>

      {/* Center: AI Copilot Orb Trigger */}
      <TouchableOpacity
        style={styles.copilotOrbButton}
        onPress={onOpenCopilot}
        activeOpacity={0.85}
      >
        <View style={styles.copilotOrbInner}>
          <MaterialCommunityIcons name="robot" size={24} color={colors.onPrimary} />
        </View>
        <Text style={styles.copilotOrbLabel}>AI Copilot</Text>
      </TouchableOpacity>

      {/* Tab 3: Relays */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabSelect('relays')}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="toggle-switch"
            size={22}
            color={activeTab === 'relays' ? colors.primaryBright : colors.textMuted}
          />
          {activeTab === 'relays' && <View style={styles.activeIndicatorDot} />}
        </View>
        <Text style={[styles.tabLabel, activeTab === 'relays' ? styles.activeTabLabel : styles.inactiveTabLabel]}>
          Relays
        </Text>
      </TouchableOpacity>

      {/* Tab 4: Tariff */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabSelect('tariff')}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={22}
            color={activeTab === 'tariff' ? colors.primaryBright : colors.textMuted}
          />
          {activeTab === 'tariff' && <View style={styles.activeIndicatorDot} />}
        </View>
        <Text style={[styles.tabLabel, activeTab === 'tariff' ? styles.activeTabLabel : styles.inactiveTabLabel]}>
          Tariff
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    backgroundColor: 'rgba(10, 14, 22, 0.95)',
    borderTopWidth: 1,
    borderTopColor: colors.borderGhost,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    zIndex: 999,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicatorDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primaryBright,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  activeTabLabel: {
    color: colors.primaryBright,
    fontWeight: '700',
  },
  inactiveTabLabel: {
    color: colors.textMuted,
  },
  copilotOrbButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  copilotOrbInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBright,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0A0E16',
    shadowColor: colors.primaryBright,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  copilotOrbLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryBright,
    marginTop: 2,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
