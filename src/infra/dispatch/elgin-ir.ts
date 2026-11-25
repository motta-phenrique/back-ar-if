/**
 * Codificador IR dos ares Elgin, levantado a partir das capturas do controle.
 * Cada comando leva o estado inteiro do aparelho em 14 bytes (LSB primeiro):
 *
 *   0-4  23 CB 26 01 00   cabeçalho fixo
 *   5    0x24 ligado / 0x20 desligado
 *   6    modo (nibble baixo) | 0x40 turbo
 *   7    31 - temperatura
 *   8    ventilação (3 bits baixos) | 0x38 oscilação vertical
 *   9-11 00
 *   12   0x08 oscilação horizontal | 0x20 meio grau
 *   13   checksum = soma dos bytes 0..12
 *
 * O controle ainda manda antes um quadro fixo (`ELGIN_PREAMBLE`), igual em
 * todas as capturas.
 *
 * Parece ser o protocolo TCL112AC da IRremoteESP8266, mas o encoder fica aqui
 * pra que o firmware só precise disparar bytes, sem saber marca.
 */

export const ELGIN_PREAMBLE = [
  0x23, 0xcb, 0x26, 0x02, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x65,
];

// Mesmos valores dos enums `AcMode` e `AcFan` do Prisma.
export type ElginMode = "HEAT" | "DRY" | "COOL" | "FAN";
export type ElginFan = "AUTO" | "LOW" | "MEDIUM" | "HIGH";

export interface ElginState {
  power: boolean;
  mode: ElginMode;
  /** 16 a 31 °C. */
  temp: number;
  fan: ElginFan;
  swingVertical: boolean;
  swingHorizontal: boolean;
  turbo?: boolean;
}

const MODE: Record<ElginMode, number> = { HEAT: 1, DRY: 2, COOL: 3, FAN: 7 };
const FAN: Record<ElginFan, number> = { AUTO: 0, LOW: 2, MEDIUM: 3, HIGH: 5 };

export function encodeElgin(state: ElginState): number[] {
  const temp = Math.min(31, Math.max(16, Math.trunc(state.temp)));

  const bytes = [
    0x23,
    0xcb,
    0x26,
    0x01,
    0x00,
    state.power ? 0x24 : 0x20,
    MODE[state.mode] | (state.turbo ? 0x40 : 0),
    31 - temp,
    FAN[state.fan] | (state.swingVertical ? 0x38 : 0),
    0x00,
    0x00,
    0x00,
    state.swingHorizontal ? 0x08 : 0,
  ];

  bytes.push(bytes.reduce((sum, b) => sum + b, 0) & 0xff);

  return bytes;
}

export function toHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}
