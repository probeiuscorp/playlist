export interface Mood {
  /**
   * - High: Living on a Prayer
   * - Low: Athair ar Neamh
   * 
   * Mixing higher and low intensity songs immediately after each other does not make a cohesive playlist. Intensity should be continuous.
   */
  intensity: number;
  /**
   * - High: Anima
   * - Low:
   * 
   * Too many high-soul songs detracts from their quality. Many low-soul songs must be mixed in.
   */
  soul: number;
  /**
   * - High: Fields of Gold
   * - Low: Never Gonna Give You Up
   * 
   * Songs with different gravity should not mix.
   */
  gravity: number;
  sentimental: number;
}

export const A_LOT = 4;
export const A_BIT = 2;

export const enum Weight {
  EVERYWHERE = 42,
  ABUNDANT = 34,
  COMMON = 28,
  STANDARD = 24,
  RARE = 16,
  LEGENDARY = 12,
}

export const enum Intensity {
  MOST = 68,
  MUCH = 52,
  INTENSE = 36,
  STANDARD = 24,
  SOOTHING = 12,
  PEACE = 4,
}

export const enum Soul {
  MOST = 68,
  MUCH = 52,
  MORE = 36,
  STANDARD = 24,
  LITTLE = 12,
  LEAST = 4,
};

export const enum Gravity {
  SERIOUS = 68,
  GRAVE = 52,
  HEAVY = 36,
  STANDARD = 24,
  LIGHT = 12,
  MEME = 4,
}
