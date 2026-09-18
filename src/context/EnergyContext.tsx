import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { dualUtilityService, ThermalComparisonResult } from '../services/dualUtilityService';
import {
  streamingService,
  ModbusTelemetryPacket,
  FeederNodeStatus,
  StreamQualityMetrics,
  StreamTransport,
} from '../services/streamingService';
import { getPKTTimeString, isPKTPeakHour } from '../utils/timeUtils';

export interface ApplianceRelay {
  id: string;
  name: string;
  roomOrZone: string;
  drawKw: number;
  costPerHourPkr: number;
  statusText: string;
  iconName: string;
  accentColor: 'primary' | 'secondary' | 'error' | 'muted';
  isOn: boolean;
  isLocked: boolean;
  isImmutable: boolean;
  tag: string;
  hasCompressor?: boolean;
  cooldownSecondsRemaining?: number;
}

export interface EnergyTelemetry {
  solarKw: number;
  solarWatts: number;
  houseLoadKw: number;
  houseLoadWatts: number;
  gridKw: number;
  gridWatts: number;
  batterySoc: number;
  batteryAmps: number;
  batteryVolts: number;
  gridVolts: number;
  frequencyHz: number;
  netRevenuePkr: number;
  powerFactor: number;
  inverterModel: string;
  inverterEff: number;
  inverterMaxSurgeKw: number;
  inverterStatus: 'GRID_TIED' | 'ISLANDED_BLACKOUT' | 'SURGE_PROTECT';
  dailySolarGenKwh: number;
  dailyStorageKwh: number;
  dailyNetGridKwh: number;
}

export interface NepraSlabStatus {
  tierName: string;
  currentUnits: number;
  capUnits: number;
  remainingUnits: number;
  breachRatio: number;
  penaltyPerUnitPkr: number;
  avoidedPenaltiesPkr: number;
  projectedBillPkr: number;
  unregulatedBillPkr: number;
}

export interface FeederOutageSentinel {
  feederId: string;
  feederName: string;
  status: 'normal' | 'trip-warning';
  activeDropCount: number;
  recommendedReserveSoc: number;
  lastUpdated: string;
}

export interface SolarSoilingHealth {
  clearSkyYieldRatio: number;
  status: 'optimal' | 'dust-warning' | 'needs-cleaning';
  dustImpactWatts: number;
}

export interface ReflexEventLog {
  id: string;
  timestamp: string;
  type: 'OVERLOAD_SURGE_SHED' | 'REVERSE_FEED_BLOCKED' | 'PEAK_GLIDE_ENGAGED';
  action: string;
  executionMs: number;
}

interface EnergyContextType {
  telemetry: EnergyTelemetry;
  relays: ApplianceRelay[];
  nepraStatus: NepraSlabStatus;
  ampThreshold: number;
  toastMessage: string | null;
  feederSentinel: FeederOutageSentinel;
  soilingHealth: SolarSoilingHealth;
  netBillingActive: boolean;
  thermalComparison: ThermalComparisonResult;
  streamMetrics: StreamQualityMetrics;
  feederNodes: FeederNodeStatus[];
  reflexEngineLog: ReflexEventLog[];
  toggleRelay: (id: string, pin?: string) => Promise<{ success: boolean; requiresPin?: boolean; message: string }>;
  shedNonCritical: () => void;
  sellBatteryToGrid: () => void;
  setAmpThreshold: (val: number) => void;
  reArbitrageBill: () => Promise<void>;
  toggleNetBillingMode: () => void;
  simulateFeederTrip: () => void;
  restoreFeederSync: () => void;
  toggleSimulatedFiberOutage: () => void;
  hideToast: () => void;
  
  // Manual Override Methods
  isManualMode: boolean;
  setManualMode: (enabled: boolean) => void;
  setManualSolarKw: (kw: number) => void;
  setManualLoadKw: (kw: number) => void;
  setManualBatterySoc: (soc: number) => void;
}

const INITIAL_RELAYS: ApplianceRelay[] = [
  {
    id: 'relay-ac',
    name: 'Inverter AC Master',
    roomOrZone: 'Master Suite • 24°C Comfort Eco Mode',
    drawKw: 1.18,
    costPerHourPkr: 54.2,
    statusText: '1.18 kW • ₨ 54.2/hr',
    iconName: 'mode-fan',
    accentColor: 'primary',
    isOn: true,
    isLocked: false,
    isImmutable: false,
    tag: 'SOLAR+BATT',
    hasCompressor: true,
    cooldownSecondsRemaining: 0,
  },
  {
    id: 'relay-pump',
    name: 'Solar Geyser & Pump',
    roomOrZone: 'Borewell Pump #1 • Tank 65% Full',
    drawKw: 0.85,
    costPerHourPkr: 38.0,
    statusText: '0.85 kW • Auto-shed rule',
    iconName: 'water-heater',
    accentColor: 'secondary',
    isOn: true,
    isLocked: false,
    isImmutable: false,
    tag: 'STANDBY',
    hasCompressor: true,
    cooldownSecondsRemaining: 0,
  },
  {
    id: 'relay-ev',
    name: 'EV Wallbox Charger',
    roomOrZone: 'Level 2 Fast 32A • Tesla Model Y',
    drawKw: 7.2,
    costPerHourPkr: 24.5,
    statusText: 'Paused • Waiting for 10 PM',
    iconName: 'ev-station',
    accentColor: 'error',
    isOn: false,
    isLocked: true,
    isImmutable: false,
    tag: 'PEAK LOCKED',
    hasCompressor: false,
    cooldownSecondsRemaining: 0,
  },
  {
    id: 'relay-server',
    name: 'Homelab Server & Comms',
    roomOrZone: 'Router, CCTV, NAS & Medical Backup',
    drawKw: 0.4,
    costPerHourPkr: 14.0,
    statusText: 'Dual Inverter Redundancy',
    iconName: 'dns',
    accentColor: 'primary',
    isOn: true,
    isLocked: false,
    isImmutable: true,
    tag: 'CRITICAL',
    hasCompressor: false,
    cooldownSecondsRemaining: 0,
  },
];

const INITIAL_TELEMETRY: EnergyTelemetry = {
  solarKw: 3.45,
  solarWatts: 3450,
  houseLoadKw: 2.6,
  houseLoadWatts: 2600,
  gridKw: 0.85,
  gridWatts: 850,
  batterySoc: 84,
  batteryAmps: 16.6,
  batteryVolts: 51.2,
  gridVolts: 228.4,
  frequencyHz: 50.02,
  netRevenuePkr: 14280,
  powerFactor: 0.98,
  inverterModel: 'Deye 8kW Hybrid (RS-485 Modbus)',
  inverterEff: 97.4,
  inverterMaxSurgeKw: 5.0,
  inverterStatus: 'GRID_TIED',
  dailySolarGenKwh: 18.4,
  dailyStorageKwh: 9.2,
  dailyNetGridKwh: -4.1,
};

const INITIAL_NEPRA: NepraSlabStatus = {
  tierName: 'Slab 3: 201 - 300 kWh',
  currentUnits: 284,
  capUnits: 300,
  remainingUnits: 16,
  breachRatio: 94.6,
  penaltyPerUnitPkr: 18.5,
  avoidedPenaltiesPkr: 17350,
  projectedBillPkr: 16850,
  unregulatedBillPkr: 34200,
};

const INITIAL_FEEDER: FeederOutageSentinel = {
  feederId: 'FDR_LHR_14',
  feederName: 'Lahore Urban Feeder 14 (LESCO 11kV)',
  status: 'normal',
  activeDropCount: 0,
  recommendedReserveSoc: 80,
  lastUpdated: 'Live sync (10s mesh)',
};

const INITIAL_SOILING: SolarSoilingHealth = {
  clearSkyYieldRatio: 96.4,
  status: 'optimal',
  dustImpactWatts: 85,
};

const INITIAL_METRICS: StreamQualityMetrics = {
  transport: 'CLOUD_WSS',
  streamRateHz: 3.3,
  latencyMs: 118,
  jitterMs: 14,
  packetsReceived: 0,
  lastPacketTimestamp: Date.now(),
  isFiberCutSimulated: false,
};

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [telemetry, setTelemetry] = useState<EnergyTelemetry>(INITIAL_TELEMETRY);
  const [relays, setRelays] = useState<ApplianceRelay[]>(INITIAL_RELAYS);
  const [nepraStatus] = useState<NepraSlabStatus>(INITIAL_NEPRA);
  const [ampThreshold, setAmpThresholdState] = useState<number>(28);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [feederSentinel, setFeederSentinel] = useState<FeederOutageSentinel>(INITIAL_FEEDER);
  const [soilingHealth] = useState<SolarSoilingHealth>(INITIAL_SOILING);
  const [netBillingActive, setNetBillingActive] = useState<boolean>(true);
  const [streamMetrics, setStreamMetrics] = useState<StreamQualityMetrics>(INITIAL_METRICS);
  const [feederNodes, setFeederNodes] = useState<FeederNodeStatus[]>([]);
  const [reflexEngineLog, setReflexEngineLog] = useState<ReflexEventLog[]>([
    {
      id: 'reflex-init',
      timestamp: 'Just now',
      type: 'REVERSE_FEED_BLOCKED',
      action: 'Net-Billing Zero Spill: 850W surplus diverted to LFP battery',
      executionMs: 18,
    },
  ]);

  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  // Ref tracking for instant reflex loop without stale closures
  const relaysRef = useRef<ApplianceRelay[]>(relays);
  relaysRef.current = relays;
  const netBillingRef = useRef<boolean>(netBillingActive);
  netBillingRef.current = netBillingActive;

  // Compressor Cooldown Tickers
  useEffect(() => {
    const timer = setInterval(() => {
      setRelays((prev) =>
        prev.map((r) => {
          if (r.cooldownSecondsRemaining && r.cooldownSecondsRemaining > 0) {
            return {
              ...r,
              cooldownSecondsRemaining: r.cooldownSecondsRemaining - 1,
            };
          }
          return r;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Wire Sub-Second Streaming Service
  useEffect(() => {
    // 1. Telemetry subscription (3.3 Hz ticks)
    const unsubTelemetry = streamingService.subscribeTelemetry((pkt: ModbusTelemetryPacket) => {
      setTelemetry((prev) => ({
        ...prev,
        solarKw: pkt.solarKw,
        solarWatts: pkt.solarWatts,
        houseLoadKw: pkt.houseLoadKw,
        houseLoadWatts: pkt.houseLoadWatts,
        gridKw: pkt.gridKw,
        gridWatts: pkt.gridWatts,
        batterySoc: pkt.batterySoc,
        batteryAmps: pkt.batteryAmps,
        batteryVolts: pkt.batteryVolts,
        gridVolts: pkt.gridVolts,
        frequencyHz: pkt.frequencyHz,
        powerFactor: pkt.powerFactor,
        inverterStatus: pkt.inverterStatus,
      }));

      // --- DUAL-ENGINE: 1. INSTANT REFLEX ENGINE (0 to 100ms) ---
      evaluateInstantReflexRules(pkt);
    });

    // 2. Crowdsourced Feeder Mesh Subscription
    const unsubFeeder = streamingService.subscribeFeederMesh((nodes, isTripped) => {
      setFeederNodes(nodes);
      const droppedCount = nodes.filter((n) => n.status === 'GRID_COLLAPSE' || n.gridVolts < 140).length;

      setFeederSentinel((prev) => ({
        ...prev,
        status: isTripped ? 'trip-warning' : 'normal',
        activeDropCount: droppedCount,
        recommendedReserveSoc: isTripped ? 90 : 80,
        lastUpdated: 'Live Crowdsourced Mesh (10s)',
      }));

      if (isTripped) {
        showToast(`⚠️ 11kV Feeder 14 TRIPPED across ${droppedCount}/5 nodes! Battery reserve locked at 90%.`);
      }
    });

    // 3. Quality Metrics Subscription
    const unsubMetrics = streamingService.subscribeMetrics((metrics) => {
      setStreamMetrics(metrics);
    });

    return () => {
      unsubTelemetry();
      unsubFeeder();
      unsubMetrics();
    };
  }, []);

  // INSTANT REFLEX ENGINE LOGIC (0 to 100ms In-Memory Execution)
  const evaluateInstantReflexRules = (pkt: ModbusTelemetryPacket) => {
    const isGridBlackout = pkt.gridVolts === 0 || pkt.frequencyHz < 45;
    const currentHouseLoad = pkt.houseLoadWatts;
    const inverterLimitWatts = pkt.inverterMaxSurgeKw * 1000; // e.g. 5000 W

    // Rule A: Over-Load Breaker Surge Protection
    // If grid cuts and load > inverter surge limit, trip heavy inductive load within <50ms
    if (isGridBlackout && currentHouseLoad > inverterLimitWatts) {
      const activeRelays = relaysRef.current;
      const acRelay = activeRelays.find((r) => r.id === 'relay-ac' && r.isOn);
      const pumpRelay = activeRelays.find((r) => r.id === 'relay-pump' && r.isOn);

      const targetToTrip = acRelay || pumpRelay;
      if (targetToTrip) {
        const executionStart = Date.now();

        // Immediately trip contactor
        setRelays((prev) =>
          prev.map((r) => {
            if (r.id === targetToTrip.id) {
              return {
                ...r,
                isOn: false,
                cooldownSecondsRemaining: r.hasCompressor ? 180 : 0,
                statusText: '⚡ Shed in 38ms by Overload Breaker',
              };
            }
            return r;
          })
        );

        streamingService.manualUpdateLoad(-targetToTrip.drawKw);

        const executionMs = Math.max(12, Date.now() - executionStart);
        const logEntry: ReflexEventLog = {
          id: `reflex-${Date.now()}`,
          timestamp: getPKTTimeString(),
          type: 'OVERLOAD_SURGE_SHED',
          action: `Tripped ${targetToTrip.name} in ${executionMs}ms (${pkt.houseLoadKw}kW > 5.0kW inverter capacity)`,
          executionMs,
        };

        setReflexEngineLog((prev) => [logEntry, ...prev.slice(0, 9)]);
        showToast(`⚡ REFLEX ACTION (${executionMs}ms): Tripped ${targetToTrip.name} to avoid inverter surge shutdown!`);
        triggerHaptic();
      }
    }

    // Rule B: Instant Reverse-Feed Blocker under Net Billing
    if (netBillingRef.current && pkt.gridWatts < -200 && pkt.batterySoc < 95) {
      // Divert surplus to storage
      const logEntry: ReflexEventLog = {
        id: `reflex-divert-${Date.now()}`,
        timestamp: getPKTTimeString(),
        type: 'REVERSE_FEED_BLOCKED',
        action: `Diverted ${Math.abs(pkt.gridWatts)}W surplus away from wholesale grid export into LFP battery`,
        executionMs: 24,
      };
      // Log occasionally without spamming
      setReflexEngineLog((prev) => {
        if (prev.length > 0 && prev[0].type === 'REVERSE_FEED_BLOCKED' && Date.now() - Number(prev[0].id.split('-')[2] || 0) < 15000) {
          return prev;
        }
        return [logEntry, ...prev.slice(0, 9)];
      });
    }
  };

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Ignore haptic errors on unsupported devices
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4200);
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  const toggleRelay = async (
    id: string,
    pinCandidate?: string
  ): Promise<{ success: boolean; requiresPin?: boolean; message: string }> => {
    const target = relays.find((r) => r.id === id);
    if (!target) return { success: false, message: 'Relay not found' };

    if (target.isImmutable) {
      showToast('Homelab & Medical Backup relay is immutable to prevent outage.');
      return { success: false, message: 'Circuit is protected by safety interlock.' };
    }

    // Compressor Safety Lock Check: Prevents rapid re-ignition within 3 mins (180s)
    if (target.hasCompressor && !target.isOn && (target.cooldownSecondsRemaining || 0) > 0) {
      const msg = `Compressor safety lock active (${target.cooldownSecondsRemaining}s remaining). Wait to prevent compressor burnout.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    // EV Wallbox Charger peak window protection requires PIN
    if (target.isLocked && !target.isOn && isPKTPeakHour()) {
      if (!pinCandidate) {
        return {
          success: false,
          requiresPin: true,
          message: 'Wallbox locked during peak window (17:00-21:00). Enter safety PIN to override.',
        };
      }
      if (pinCandidate !== '2468') {
        showToast('Incorrect Safety PIN. Overdraw protection retained.');
        return { success: false, message: 'Invalid PIN.' };
      }
    }

    triggerHaptic();

    // Bi-Directional Sub-120ms Relay Dispatch over WebSocket/MQTT
    const nextState = !target.isOn;
    const cmdResult = await streamingService.dispatchRelayCommand(id, nextState);

    setRelays((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            isOn: nextState,
            cooldownSecondsRemaining: !nextState && r.hasCompressor ? 180 : 0,
            statusText: nextState ? `${r.drawKw} kW • Active Draw` : 'Contactor shed • 0 W',
          };
        }
        return r;
      })
    );

    // Update real-time load in stream engine
    streamingService.manualUpdateLoad(nextState ? target.drawKw : -target.drawKw);

    const msg = nextState
      ? `${target.name} engaged (${cmdResult.roundTripMs}ms ack via ${cmdResult.transportUsed})`
      : `${target.name} shed (${cmdResult.roundTripMs}ms ack via ${cmdResult.transportUsed})`;
    showToast(msg);

    return { success: true, message: msg };
  };

  const shedNonCritical = () => {
    triggerHaptic();
    setRelays((prev) =>
      prev.map((r) => {
        if (r.isImmutable) return r;
        return {
          ...r,
          isOn: false,
          cooldownSecondsRemaining: r.hasCompressor ? 180 : 0,
          statusText: 'Auto-shed by NEPRA Sentinel rule',
        };
      })
    );
    streamingService.setHouseLoadExact(0.6);
    showToast('All non-critical contactors shed. Consumption frozen at Slab 3.');
  };

  const sellBatteryToGrid = () => {
    triggerHaptic();
    setTelemetry((prev) => ({
      ...prev,
      gridKw: 4.8,
      netRevenuePkr: prev.netRevenuePkr + 3410,
    }));
    showToast('High-tariff Battery Export engaged: Inverting 4.8 kW @ ₨ 54/kWh');
  };

  const setAmpThreshold = (val: number) => {
    setAmpThresholdState(val);
  };

  const reArbitrageBill = async () => {
    triggerHaptic();
    await new Promise((r) => setTimeout(r, 1200));
    showToast('Arbitrage applied: Saved ₨ 3,410 by shifting 34 kWh away from Slab 4.');
  };

  const toggleNetBillingMode = () => {
    triggerHaptic();
    setNetBillingActive((prev) => !prev);
    const next = !netBillingActive;
    showToast(
      next
        ? 'Net Billing Mode Active: Export minimized (Rs. 11/kWh). Auto-absorbing on-site.'
        : 'Legacy Net Metering Mode: 1:1 Import/Export units active.'
    );
  };

  const simulateFeederTrip = () => {
    triggerHaptic();
    streamingService.triggerGridOutageSimulation();
  };

  const restoreFeederSync = () => {
    triggerHaptic();
    streamingService.restoreGridSimulation();
    showToast('11kV Feeder synchronized. Voltage & 50Hz frequency nominal.');
  };

  const toggleSimulatedFiberOutage = () => {
    triggerHaptic();
    const newTransport = streamingService.toggleSimulatedFiberOutage();
    showToast(
      newTransport === 'LOCAL_LAN_WS'
        ? 'Fiber Blackout Detected! Switched to Local LAN WebSocket (mDNS @ 8ms)'
        : 'Broadband Restored! Reconnected to Cloud WebSocket Gateway (118ms)'
    );
  };

  const thermalComparison = dualUtilityService.calculateWinterHeatingParity(
    telemetry.solarKw - telemetry.houseLoadKw,
    isPKTPeakHour()
  );

  const handleSetManualMode = (enabled: boolean) => {
    setIsManualMode(enabled);
    streamingService.setManualMode(enabled);
    showToast(enabled ? 'Manual Telemetry Mode Active' : 'Auto Simulation Restored');
  };

  return (
    <EnergyContext.Provider
      value={{
        telemetry,
        relays,
        nepraStatus,
        ampThreshold,
        toastMessage,
        feederSentinel,
        soilingHealth,
        netBillingActive,
        thermalComparison,
        streamMetrics,
        feederNodes,
        reflexEngineLog,
        toggleRelay,
        shedNonCritical,
        sellBatteryToGrid,
        setAmpThreshold,
        reArbitrageBill,
        toggleNetBillingMode,
        simulateFeederTrip,
        restoreFeederSync,
        toggleSimulatedFiberOutage,
        hideToast,
        isManualMode,
        setManualMode: handleSetManualMode,
        setManualSolarKw: streamingService.setManualSolarBase.bind(streamingService),
        setManualLoadKw: streamingService.setManualLoadBase.bind(streamingService),
        setManualBatterySoc: streamingService.setManualBatterySoc.bind(streamingService),
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = (): EnergyContextType => {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};
