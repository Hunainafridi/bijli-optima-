import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { useEnergy } from '../../context/EnergyContext';
import { colors } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ManualOverridePanel: React.FC = () => {
  const {
    isManualMode,
    setManualMode,
    setManualSolarKw,
    setManualLoadKw,
    setManualBatterySoc,
    telemetry,
  } = useEnergy();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="tune" size={20} color={isManualMode ? colors.primaryBright : colors.textSecondary} />
          <Text style={[styles.title, isManualMode && styles.activeTitle]}>Manual Override</Text>
        </View>
        <Switch
          value={isManualMode}
          onValueChange={setManualMode}
          trackColor={{ false: colors.borderSubtle, true: 'rgba(0, 229, 153, 0.4)' }}
          thumbColor={isManualMode ? colors.primaryBright : colors.textSecondary}
        />
      </View>

      {isManualMode && (
        <View style={styles.controls}>
          {/* Solar Slider */}
          <View style={styles.sliderGroup}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Solar Generation</Text>
              <Text style={styles.sliderValue}>{telemetry.solarKw.toFixed(2)} kW</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={0.1}
              value={telemetry.solarKw}
              onValueChange={setManualSolarKw}
              minimumTrackTintColor="#FEBE10"
              maximumTrackTintColor={colors.borderGhost}
              thumbTintColor="#FEBE10"
            />
          </View>

          {/* Load Slider */}
          <View style={styles.sliderGroup}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>House Load</Text>
              <Text style={styles.sliderValue}>{telemetry.houseLoadKw.toFixed(2)} kW</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={0.1}
              value={telemetry.houseLoadKw}
              onValueChange={setManualLoadKw}
              minimumTrackTintColor="#FF4C4C"
              maximumTrackTintColor={colors.borderGhost}
              thumbTintColor="#FF4C4C"
            />
          </View>

          {/* Battery SOC Slider */}
          <View style={styles.sliderGroup}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Battery SOC</Text>
              <Text style={styles.sliderValue}>{telemetry.batterySoc}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={telemetry.batterySoc}
              onValueChange={setManualBatterySoc}
              minimumTrackTintColor="#00E599"
              maximumTrackTintColor={colors.borderGhost}
              thumbTintColor="#00E599"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 19, 28, 0.85)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  activeTitle: {
    color: colors.primaryBright,
  },
  controls: {
    marginTop: 16,
    gap: 16,
  },
  sliderGroup: {},
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  sliderValue: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
