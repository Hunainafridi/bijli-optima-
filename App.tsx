import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/constants/colors';
import { AuthProvider } from './src/context/AuthContext';
import { EnergyProvider, useEnergy, ApplianceRelay } from './src/context/EnergyContext';
import { Header } from './src/components/common/Header';
import { BottomTabBar, TabKey } from './src/components/common/BottomTabBar';
import { ToastFeedback } from './src/components/common/ToastFeedback';
import { SecurityModal } from './src/components/common/SecurityModal';
import { AuthModal } from './src/screens/AuthModal';
import { FlowHubScreen } from './src/screens/FlowHubScreen';
import { BillScannerScreen } from './src/screens/BillScannerScreen';
import { LoadRelaysScreen } from './src/screens/LoadRelaysScreen';
import { TariffAnalyticsScreen } from './src/screens/TariffAnalyticsScreen';
import { BilingualCopilotModal } from './src/components/copilot/BilingualCopilotModal';
import { DualUtilityArbitrageModal } from './src/components/arbitrage/DualUtilityArbitrageModal';
import { FeederMeshRadarModal } from './src/components/orchestration/FeederMeshRadarModal';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('flow');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [securityModalMode, setSecurityModalMode] = useState<'pin-override' | 'security-status'>('pin-override');
  const [pendingRelay, setPendingRelay] = useState<ApplianceRelay | null>(null);
  const [copilotModalVisible, setCopilotModalVisible] = useState(false);
  const [dualUtilityModalVisible, setDualUtilityModalVisible] = useState(false);
  const [feederRadarVisible, setFeederRadarVisible] = useState(false);

  const { toastMessage, hideToast, toggleRelay } = useEnergy();

  const handleRequirePin = (relay: ApplianceRelay) => {
    setPendingRelay(relay);
    setSecurityModalMode('pin-override');
    setSecurityModalVisible(true);
  };

  const handleSecurityPinSuccess = (pin?: string) => {
    if (securityModalMode === 'pin-override' && pendingRelay && pin) {
      toggleRelay(pendingRelay.id, pin);
      setPendingRelay(null);
    }
    setSecurityModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.appContainer}>
        {/* Persistent Cybernetic Telemetry Header with Live Transport & Feeder Mesh Pill */}
        <Header
          onProfilePress={() => setProfileModalVisible(true)}
          onDualUtilityPress={() => setDualUtilityModalVisible(true)}
          onFeederMeshPress={() => setFeederRadarVisible(true)}
        />

        {/* Dynamic Screen Viewport */}
        <View style={styles.screenViewport}>
          {activeTab === 'flow' && (
            <FlowHubScreen
              onNavigateToScan={() => setActiveTab('ocr')}
              onRequirePin={handleRequirePin}
            />
          )}

          {activeTab === 'ocr' && <BillScannerScreen />}

          {activeTab === 'relays' && (
            <LoadRelaysScreen
              onRequirePin={handleRequirePin}
              onOpenRadar={() => setFeederRadarVisible(true)}
            />
          )}

          {activeTab === 'tariff' && <TariffAnalyticsScreen />}
        </View>

        {/* Global Contactor Dispatch Toast Feedback */}
        <ToastFeedback message={toastMessage} onDismiss={hideToast} />

        {/* Bottom Glass Navigation Dock with Center AI Copilot Orb */}
        <BottomTabBar
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          onOpenCopilot={() => setCopilotModalVisible(true)}
        />

        {/* High-Voltage Contactor Authorization & Keystore Modal */}
        <SecurityModal
          visible={securityModalVisible}
          mode={securityModalMode}
          title={
            securityModalMode === 'pin-override'
              ? 'High-Voltage Breaker Authorization'
              : 'Hardware Security Vault Active'
          }
          description={
            securityModalMode === 'pin-override'
              ? `Override requested for ${pendingRelay?.name || 'Contactor'}. Enter 4-digit Safety PIN to verify operator authority.`
              : 'AES-256 encrypted hardware storage via Android Keystore / iOS Keychain. All API tokens and tariff rules are tamper-proof.'
          }
          onSuccess={handleSecurityPinSuccess}
          onClose={() => {
            setSecurityModalVisible(false);
            setPendingRelay(null);
          }}
        />

        {/* User Profile / Operations Manager Sheet */}
        <AuthModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          onOpenSecurityStatus={() => {
            setProfileModalVisible(false);
            setSecurityModalMode('security-status');
            setSecurityModalVisible(true);
          }}
        />

        {/* Bilingual AI Energy Copilot Voice & Chat Modal */}
        <BilingualCopilotModal
          visible={copilotModalVisible}
          onClose={() => setCopilotModalVisible(false)}
        />

        {/* Dual-Utility Gas vs Electric Thermal Arbitrage Modal */}
        <DualUtilityArbitrageModal
          visible={dualUtilityModalVisible}
          onClose={() => setDualUtilityModalVisible(false)}
        />

        {/* 11kV Crowdsourced Feeder Distribution Mesh Radar Modal */}
        <FeederMeshRadarModal
          visible={feederRadarVisible}
          onClose={() => setFeederRadarVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <EnergyProvider>
        <MainAppContent />
      </EnergyProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D14',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#090D14',
    position: 'relative',
  },
  screenViewport: {
    flex: 1,
    backgroundColor: '#0F131C',
  },
});
