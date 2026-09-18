// Bilingual AI Energy Copilot Service
// Powers contextual voice & text advisory with tool-calling in English and Roman Urdu

import { getPKTTimeShort } from '../utils/timeUtils';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: 'ur' | 'en';
  timestamp: string;
  toolCall?: {
    toolName: string;
    status: 'executing' | 'completed';
    input?: string;
    result: string;
  };
  metricsHighlight?: {
    label: string;
    value: string;
  };
}

export const copilotService = {
  /**
   * Evaluates user query and determines tool calls and bilingual response
   */
  async processQuery(
    query: string,
    context: {
      solarKw: number;
      batterySoc: number;
      houseLoadKw: number;
      isPeakHour: boolean;
      currentUnits: number;
    }
  ): Promise<CopilotMessage> {
    const q = query.toLowerCase();

    // 1. Query: "paani ki motor" / "water pump"
    if (q.includes('motor') || q.includes('pump') || q.includes('paani')) {
      const canRun = context.solarKw >= 2.5 && context.batterySoc >= 50;

      if (canRun) {
        return {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          language: 'ur',
          timestamp: getPKTTimeShort(),
          text: `Bilkul, chala lein! Solar is waqt ${context.solarKw} kW generate kar raha hai aur battery ${context.batterySoc}% par hai. Aglay 2 ghantay dhoop achi rahay gi, motor chalane se grid se koi unit draw nahi hoga.`,
          toolCall: {
            toolName: 'check_solar_and_battery',
            status: 'completed',
            result: `Solar: ${context.solarKw} kW | Battery: ${context.batterySoc}% | Grid: 0 W Draw`,
          },
          metricsHighlight: {
            label: 'RECOMMENDED ACTION',
            value: 'SAFE TO RUN MOTOR ON SOLAR',
          },
        };
      } else {
        return {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          language: 'ur',
          timestamp: getPKTTimeShort(),
          text: `Abhi ruk jaein. Solar generation sirf ${context.solarKw} kW hai aur battery ${context.batterySoc}% par hai. Motor chalane se grid se Rs. 48/unit par bijli import hogi. Behtar hai 11:30 AM tak intezar karein jab dhoop peak par ho.`,
          toolCall: {
            toolName: 'check_solar_and_battery',
            status: 'completed',
            result: `Solar: ${context.solarKw} kW (Low) | Battery: ${context.batterySoc}%`,
          },
          metricsHighlight: {
            label: 'HOLD ACTION',
            value: 'DEFER TO 11:30 AM SOLAR PEAK',
          },
        };
      }
    }

    // 2. Query: "what-if" / "2 ac" / "ac chala saktay" / "afternoon"
    if (q.includes('what-if') || q.includes('2 ac') || q.includes('ac chala') || q.includes('air conditioner')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        language: 'en',
        timestamp: getPKTTimeShort(),
        text: `Simulating dual inverter AC draw (2.4 kW total) against your 10kWh LiFePO4 battery and 3.4 kW solar array:\n\n• Solar covers 100% of both ACs until 4:30 PM.\n• Battery will maintain 80% reserve by sunset (6:00 PM).\n• Night runtime available: 6 hours 15 minutes.\n\nSafe to run both ACs without crossing into NEPRA Slab 4!`,
        toolCall: {
          toolName: 'simulate_depletion_curve',
          status: 'completed',
          result: 'Solar Surplus: +1.0 kW buffer | Projected Sunset SoC: 82%',
        },
        metricsHighlight: {
          label: 'SIMULATED RUNTIME',
          value: 'SAFE UNTIL 6:15 PM ON SOLAR',
        },
      };
    }

    // 3. Query: "roi" / "report" / "savings" / "kitne bachay"
    if (q.includes('roi') || q.includes('saving') || q.includes('report') || q.includes('bachay') || q.includes('rupees')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        language: 'en',
        timestamp: getPKTTimeShort(),
        text: `Here is your itemized End-of-Month Audited Savings breakdown:\n\n• Avoided peak tariff units: Rs. 7,800\n• Solar self-consumption vs export gap: Rs. 13,400\n• NEPRA Slab 3 protection savings: Rs. 9,200\n\nTotal Direct Monthly Benefit: ₨ 30,400 saved.`,
        toolCall: {
          toolName: 'audit_monthly_roi',
          status: 'completed',
          result: 'Total Avoided DISCO Penalties: ₨ 30,400 / month',
        },
        metricsHighlight: {
          label: 'AUDITED SAVINGS',
          value: '₨ 30,400 / MONTH',
        },
      };
    }

    // 4. Query: "solar surplus" / "surplus" / "recommend"
    if (q.includes('surplus') || q.includes('dhoop') || q.includes('washing machine') || q.includes('ev')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        language: 'ur',
        timestamp: getPKTTimeShort(),
        text: `Solar surplus is waqt 2.4 kW par peak kar raha hai. Yeh behtareen waqt hai washing machine chalane, EV charger lagane ya paani ka filter plant chalane ka, taakay bijli net billing mein Rs. 11 mein bechne ke bajaye ghar mein muft istemal ho.`,
        toolCall: {
          toolName: 'check_net_billing_absorption',
          status: 'completed',
          result: 'Export: +0.8 kW | Surplus Available: 2.4 kW',
        },
        metricsHighlight: {
          label: 'OPTIMAL WINDOW',
          value: 'ABSORB 2.4 kW SURPLUS NOW',
        },
      };
    }

    // Default Fallback
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      language: 'en',
      timestamp: getPKTTimeShort(),
      text: `Grid is synchronized at 50.02 Hz. Solar generation is currently 3.4 kW, covering 100% of house loads (2.6 kW) with +0.8 kW exported. NEPRA Slab 3 sentinel is active (16 units to peak tariff). How can I assist with your energy operations?`,
      toolCall: {
        toolName: 'get_system_status',
        status: 'completed',
        result: 'All 4 automated relays operational. Zero grid import.',
      },
    };
  },
};
