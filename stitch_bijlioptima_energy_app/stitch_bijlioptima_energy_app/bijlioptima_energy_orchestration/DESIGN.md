---
name: BijliOptima Energy Orchestration
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bacbbe'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#849589'
  outline-variant: '#3b4a41'
  surface-tint: '#00e297'
  primary: '#6dffba'
  on-primary: '#003822'
  primary-container: '#00e599'
  on-primary-container: '#00613e'
  inverse-primary: '#006c46'
  secondary: '#ffdb9d'
  on-secondary: '#412d00'
  secondary-container: '#feb700'
  on-secondary-container: '#6b4b00'
  tertiary: '#c7eaff'
  on-tertiary: '#003548'
  tertiary-container: '#7cd3ff'
  on-tertiary-container: '#005b79'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#4dffb2'
  primary-fixed-dim: '#00e297'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#005234'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#ffba20'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#c2e8ff'
  tertiary-fixed-dim: '#75d1ff'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#004d67'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

The design system merges the structural authority of neo-brutalism with the spatial refinement and optical fluidity of modern Apple design. Built for high-frequency energy management, distributed grid visibility, and slab-rate mitigation, the interface communicates zero-latency telemetry, uncompromising precision, and sovereign control over utility overheads.

### Visual Aesthetic & Persona
- **Neo-Fluid Precision:** Monolithic architectural layouts paired with luminous frosted glass structures. Tactile data surfaces sit on deep, non-reflective obsidian foundations.
- **Tone & Mood:** Hyper-focused, operational, protective, and analytical. It strips away domestic energy cliches (leaf vectors, playful gradients) in favor of mission-critical telemetry, dynamic load allocation, and immediate economic feedback.
- **Target Audience:** Modern homeowners, industrial-solar hybrid operators, and energy-conscious citizens navigating complex tariff structures, peak-load penalties, and multi-source switching (Grid, Solar, Battery, Genset).

## Colors

The palette operates on a zero-distraction dark paradigm, driving cognitive recognition through deliberate spectral accents representing distinct power states and regulatory tiers.

### Surface Architecture
- **Obsidian Core (Base Canvas):** `#090D14` - Ground-level environment absorbing visual noise.
- **Obsidian Surface (Structural Tier):** `#0B0F17` - Foundational container color.
- **Glass Underlay (Card Fill):** `rgba(18, 26, 38, 0.65)` with `backdrop-filter: blur(24px) saturate(180%)`.
- **Glass Elevated (Modals & Flying Sheets):** `rgba(26, 37, 54, 0.85)` with `backdrop-filter: blur(32px)`.

### Power Spectrum & Functional Roles
- **Radiant Emerald (`#00E599`):** Represents optimal generation, self-sustaining solar flow, net-metering export, and economic surplus.
- **Solar Amber (`#FFB800`):** Peak tariff zones, active NEPRA slab threshold alerts, genset runtime warnings, and dynamic draw friction.
- **Hyper-Cyan (`#00C2FF`):** Grid sync status, battery discharge calibration, telemetry streams, and ambient algorithmic orchestration.
- **Critical Volt (`#FF3B30`):** Overdraw penalties, reverse current warnings, and catastrophic slab boundary breach.
- **Neutral Scales:**
  - `Text Primary`: `#F2F5F8` (100% white-doped luminance for instant legibility).
  - `Text Secondary`: `#8E9BAE` (Muted telemetry labels and contextual units).
  - `Border Ghost`: `rgba(255, 255, 255, 0.08)` (Structural delimiter).
  - `Border Glow`: Variable active states keyed to accent states at `rgba(color, 0.35)`.

## Typography

The typographic hierarchy divides computational readout from interface instruction. 

- **Display & Headlines (Space Grotesk):** Provides technological friction and geometric authority. Used for total yield sums, power states, and high-impact operational titles.
- **Body & Editorial (Geist):** Clean, neutral, high-legibility sans-serif optimized for low-friction information ingestion at small sizes on OLED screens.
- **Telemetry & Metrics (JetBrains Mono):** Monospaced precision for units (`kW`, `kWh`, `V`, `Hz`, `PKR`), real-time consumption numbers, slab count-downs, and timestamps. Enforces non-shifting tabular alignment during live data streaming.

## Layout & Spacing

The layout utilizes a dynamic fluid grid optimized for vertical mobile scanning with structural density.

### Mobile Grid Archetype
- **Canvas Bounds:** `margin: 1.25rem` (20px) outer edge constraint for thumb-safe mobile interactions.
- **Vertical Rhythm:** 4px baseline sub-grid. Dynamic UI modules conform to 8px multiples (`space-xs` through `space-xl`).
- **Gutter:** 16px fluid column gap for multi-metric side-by-side tiles (e.g., Solar Production vs. Grid Draw).

### Responsive Adaptation
- **Mobile (<640px):** Single-column stacked telemetry stream. Bottom-sheet utility overlays with safe-area hardware insets (`env(safe-area-inset-bottom)`).
- **Tablet / Split-Screen (640px - 1024px):** Dual-column layout. Primary live bus-bar power flow graph pinned left; actionable slab controls and appliance switches grouped right.

## Elevation & Depth

Depth is established through optical luminosity and chromatic atmospheric glow rather than standard diffuse drop shadows.

### Glass Stack Hierarchy
1. **L0 Ground Canvas:** Solid `#090D14`. No elevation.
2. **L1 Frosted Modules:** Background `rgba(18, 26, 38, 0.65)`, backdrop blur 24px, 1px border stroke `rgba(255, 255, 255, 0.08)`.
3. **L2 Active Cards & Interactive Nodes:** Background `rgba(22, 33, 50, 0.75)`, backdrop blur 28px. The 1px outline reflects the state of the active energy source (`rgba(0, 229, 153, 0.3)` for Solar, `rgba(255, 184, 0, 0.3)` for Peak Slab).
4. **L3 Floating Overlays & Emergency Drawers:** Background `rgba(14, 20, 31, 0.92)`, backdrop blur 40px, directional neon rim-light from top-edge: `inset 0 1px 0 0 rgba(255, 255, 255, 0.15)`.

### Chromatic Ambient Glow
Instead of neutral black shadows, elevated elements emit a calibrated, low-spread ambient glow keyed to their operational state:
- Solar Generation Card: `0 12px 32px -8px rgba(0, 229, 153, 0.12)`
- Slab Breach Threshold: `0 12px 32px -8px rgba(255, 184, 0, 0.15)`

## Shapes

The design system enforces a disciplined geometric syntax. Corners are rounded with intent—balancing tactile friendliness with technical rigor.

- **Base Radius (`rounded`, 0.5rem / 8px):** Applied to internal chips, numeric pills, mini gauges, and input containers.
- **Card Radius (`rounded-lg`, 1rem / 16px):** Standard across all frosted surface panels, metrics cards, and graphical canvas containers.
- **Overlay Radius (`rounded-xl`, 1.5rem / 24px):** Reserved for primary bottom sheets, slab warning modals, and persistent navigation docks.
- **Pills (`rounded-full`, 9999px):** Applied strictly to real-time status indicators (e.g., `OFF-PEAK ACTIVE`), operational toggle thumbs, and floating action telemetry triggers.

## Components

### Buttons
- **Primary (Action / Switch):** Solid `#00E599` fill, label in `#090D14` (JetBrains Mono bold). 1px solid border matching background. Active scale down: `transform: scale(0.98)`.
- **Warning (Slab Mitigation / Shed Load):** High-contrast `#FFB800` outline, `rgba(255, 184, 0, 0.1)` background, text in `#FFB800`.
- **Secondary (Telemetry Toggles):** Frosted glass `rgba(255, 255, 255, 0.05)`, border 1px `rgba(255, 255, 255, 0.1)`, text in `#F2F5F8`.

### Status Badges & Slab Alerts
- **NEPRA Slab Alert Pill:** High-density component with monospaced tracking. Features a live pulsing dot (6px) alongside slab tier text (e.g., `SLAB 3: 301-400 UNITS`). Transitions from Hyper-Cyan to Solar Amber at 80% consumption, flashing Critical Volt at 95% threshold.
- **Grid Sync Indicator:** 20px height pill with monospaced phase frequency readouts (`50.02 Hz | NORMAL`).

### Cards & Telemetry Nodes
- **Power Flow Card:** Frosted canvas containing SVG particle flow paths between Solar, Battery, Grid, and In-House Consumption. Border features dynamic gradient matching dominant energy flow.
- **Unit Accumulator Card:** Massive numerical readout in Space Grotesk, unit identifier in JetBrains Mono. Bottom edge contains a segmented neon threshold progress bar dividing NEPRA slabs (100, 200, 300, 700 units).

### Input Fields & Controls
- **Numerical Capacity Stepper:** Dark embedded well (`#06090F`) with recessed inset shadow. Segmented controls bound by 1px ghost borders.
- **Toggle Switches:** Track is 48px wide x 24px high. Inactive: `#1A2333`. Active: Radiant Emerald `#00E599` with an internal linear gradient shift. Thumb is pure optical white `#FFFFFF` with rigid circular footprint.

### Data Lists
- **Appliance Draw Rows:** 56px height per row. Left-aligned hardware icon enclosed in a `rounded` frosted frame, appliance designation in Geist Medium, live draw (`2.4 kW`) and current cost/hour pinned right in JetBrains Mono tabular figures. Separated by `1px solid rgba(255, 255, 255, 0.04)`.