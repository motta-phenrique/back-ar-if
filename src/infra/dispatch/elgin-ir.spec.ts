import { describe, expect, it } from "vitest";
import { encodeElgin, ElginState, toHex } from "./elgin-ir";

// Quadros de estado reais, decodificados das capturas do controle Elgin.
const base: ElginState = {
  power: true,
  mode: "HEAT",
  temp: 27,
  fan: "AUTO",
  swingVertical: false,
  swingHorizontal: false,
};

const captures: [string, Partial<ElginState>, string][] = [
  ["aquecer 24 swingH", { temp: 24, swingHorizontal: true }, "23cb260100240107000000000849"],
  ["aquecer 25 swingH", { temp: 25, swingHorizontal: true }, "23cb260100240106000000000848"],
  ["aquecer 26 swingH", { temp: 26, swingHorizontal: true }, "23cb260100240105000000000847"],
  ["aquecer 27 swingH", { swingHorizontal: true }, "23cb260100240104000000000846"],
  ["aquecer 27 swingH+V", { swingHorizontal: true, swingVertical: true }, "23cb26010024010438000000087e"],
  ["aquecer 27 swingV", { swingVertical: true }, "23cb260100240104380000000076"],
  ["aquecer 27 sem swing", {}, "23cb26010024010400000000003e"],
  ["fan 4 barras", { fan: "LOW" }, "23cb260100240104020000000040"],
  ["fan 8 barras", { fan: "MEDIUM" }, "23cb260100240104030000000041"],
  ["fan 12 barras", { fan: "HIGH" }, "23cb260100240104050000000043"],
  ["turbo", { temp: 31, fan: "HIGH", turbo: true }, "23cb26010024410005000000007f"],
  ["desligar", { power: false, fan: "HIGH" }, "23cb26010020010405000000003f"],
];

describe("encodeElgin", () => {
  it.each(captures)("%s", (_, patch, expected) => {
    expect(toHex(encodeElgin({ ...base, ...patch }))).toBe(expected);
  });

  // As capturas em refrigerar vieram com o bit 0x80 do byte 12 ligado (função
  // ainda não identificada). Fora esse bit, o resto tem que bater.
  const cool = [
    "23cb26010024030f0500000080d0", "23cb26010024030e0500000080cf",
    "23cb26010024030d0500000080ce", "23cb26010024030c0500000080cd",
    "23cb26010024030b0500000080cc", "23cb26010024030a0500000080cb",
    "23cb2601002403090500000080ca", "23cb2601002403080500000080c9",
    "23cb2601002403070500000080c8", "23cb2601002403060500000080c7",
    "23cb2601002403050500000080c6", "23cb2601002403040500000080c5",
    "23cb2601002403030500000080c4", "23cb2601002403020500000080c3",
    "23cb2601002403010500000080c2", "23cb2601002403000500000080c1",
  ];

  it.each(cool.map((hex, i) => [16 + i, hex] as const))(
    "refrigerar %i°C",
    (temp, hex) => {
      const bytes = encodeElgin({ ...base, mode: "COOL", fan: "HIGH", temp });
      bytes[12] |= 0x80;
      bytes[13] = (bytes[13] + 0x80) & 0xff;
      expect(toHex(bytes)).toBe(hex);
    },
  );
});
