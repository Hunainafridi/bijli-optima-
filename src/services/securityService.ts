// Security Service: Input sanitization, validation, and anti-tampering guards

export const securityService = {
  /**
   * Validates Pakistani DISCO consumer reference numbers
   * Typical format: 14 digits plus optional billing division code/sub-segment
   * e.g., "08-11234-5829104 U" or "24112345829104U"
   */
  isValidConsumerRef(ref: string): boolean {
    if (!ref || typeof ref !== 'string') return false;
    const clean = ref.trim().replace(/[\s-]/g, '');
    // Must be 14-16 alphanumeric characters without malicious control characters
    return /^[0-9]{14}[A-Za-z0-9]?$/.test(clean);
  },

  /**
   * Sanitizes text strings against prompt/script injection
   */
  sanitizeString(input: string): string {
    if (!input) return '';
    return input
      .replace(/[<>'"`;\\]/g, '')
      .trim()
      .slice(0, 120);
  },

  /**
   * Ensures numerical energy readings are within physical plausibility bounds
   */
  clampTelemetryValue(val: number, min = 0, max = 500): number {
    if (isNaN(val) || !isFinite(val)) return min;
    return Math.max(min, Math.min(max, val));
  },

  /**
   * Mask sensitive account identifiers for presentation (e.g. "08-****-5829104 U")
   */
  maskConsumerRef(ref: string): string {
    if (!ref || ref.length < 8) return ref || '';
    const parts = ref.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-****-${parts[2]}`;
    }
    return `${ref.slice(0, 4)}****${ref.slice(-4)}`;
  },
};
