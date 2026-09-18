// Dual-Utility Gas vs. Electric Arbitrage Engine
// Computes live thermal cost equivalents (Rs/MMBTU vs Rs/kWh) for winter water heating & space heating

export interface ThermalComparisonResult {
  solarCostPerHourPkr: number;
  gasCostPerHourPkr: number;
  gridElectricCostPerHourPkr: number;
  recommendedUtility: 'solar-electric' | 'natural-gas' | 'grid-electric';
  monthlyProjectedSavingsPkr: number;
  advisoryRomanUrdu: string;
  advisoryEnglish: string;
}

export const dualUtilityService = {
  // SNGPL / SSGC Tariff Parameters
  GAS_RATE_PER_MMBTU: 1850, // Rs. per MMBTU for residential non-protected
  MMBTU_TO_KWH_FACTOR: 293.07, // 1 MMBTU = 293.07 kWh thermal energy
  GAS_GEYSER_EFFICIENCY: 0.62, // Traditional atmospheric burner efficiency ~60-65%
  ELECTRIC_GEYSER_EFFICIENCY: 0.95, // Immersion element efficiency ~95%
  GRID_PEAK_KWH_RATE: 58.5,
  GRID_OFFPEAK_KWH_RATE: 34.2,

  /**
   * Calculates thermal parity between electric immersion and natural gas burner
   * Standard domestic water heating requirement: 3.5 kW electric equivalent (or ~12,000 BTU/hr)
   */
  calculateWinterHeatingParity(solarSurplusKw: number, isPeakHour: boolean): ThermalComparisonResult {
    const requiredThermalKw = 3.5;

    // 1. Solar Electric Cost: If surplus solar >= 3 kW, cost is zero marginal rupees
    const solarCoverRatio = Math.min(1, solarSurplusKw / requiredThermalKw);
    const gridImportNeededKw = requiredThermalKw * (1 - solarCoverRatio);
    const activeElectricRate = isPeakHour ? this.GRID_PEAK_KWH_RATE : this.GRID_OFFPEAK_KWH_RATE;
    const solarElectricCostPerHour = gridImportNeededKw * activeElectricRate;

    // 2. Natural Gas Cost: (Required Energy in MMBTU / Efficiency) * Gas Rate
    // 3.5 kWh = 0.01194 MMBTU
    const requiredMmbtu = (requiredThermalKw / this.MMBTU_TO_KWH_FACTOR) / this.GAS_GEYSER_EFFICIENCY;
    const gasCostPerHour = requiredMmbtu * this.GAS_RATE_PER_MMBTU;

    // 3. Pure Grid Electric Cost (without solar)
    const gridElectricCostPerHour = (requiredThermalKw / this.ELECTRIC_GEYSER_EFFICIENCY) * activeElectricRate;

    // Decision Logic
    let recommended: 'solar-electric' | 'natural-gas' | 'grid-electric' = 'solar-electric';
    let advisoryUrdu = '';
    let advisoryEng = '';

    if (solarSurplusKw >= 2.8) {
      recommended = 'solar-electric';
      advisoryUrdu = 'Abhi Solar surplus 3 kW se zyada hai. Geyser ko Electric par chalayein, gas band rakhain (Rs. 0/hr).';
      advisoryEng = 'High solar surplus available. Run electric geyser element to capture zero-cost solar energy.';
    } else if (gasCostPerHour < solarElectricCostPerHour) {
      recommended = 'natural-gas';
      advisoryUrdu = `Dhoop kam hai aur grid rate Rs. ${activeElectricRate.toFixed(1)}/unit hai. Gas geyser chalana Rs. ${(solarElectricCostPerHour - gasCostPerHour).toFixed(0)}/hr sasta paray ga.`;
      advisoryEng = `Insufficient solar. SNGPL natural gas is cheaper than grid electricity by Rs. ${(solarElectricCostPerHour - gasCostPerHour).toFixed(0)}/hr.`;
    } else {
      recommended = 'solar-electric';
      advisoryUrdu = 'Solar + Battery support active hai. Electric heating behtar hai.';
      advisoryEng = 'Solar with battery support provides optimal thermal efficiency.';
    }

    const monthlyProjectedSavings = Math.round(Math.abs(gridElectricCostPerHour - Math.min(solarElectricCostPerHour, gasCostPerHour)) * 3 * 30);

    return {
      solarCostPerHourPkr: Number(solarElectricCostPerHour.toFixed(1)),
      gasCostPerHourPkr: Number(gasCostPerHour.toFixed(1)),
      gridElectricCostPerHourPkr: Number(gridElectricCostPerHour.toFixed(1)),
      recommendedUtility: recommended,
      monthlyProjectedSavingsPkr: monthlyProjectedSavings,
      advisoryRomanUrdu: advisoryUrdu,
      advisoryEnglish: advisoryEng,
    };
  },
};
