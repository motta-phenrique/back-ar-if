export interface ZonedParts {
  /** Data local no formato "YYYY-MM-DD". */
  date: string;
  /** Hora local no formato "HH:mm", 24h. */
  time: string;
  /** Dia da semana local, 0 = domingo ... 6 = sábado. */
  weekday: number;
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone);

  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  formatterCache.set(timeZone, formatter);

  return formatter;
}

/**
 * Converte um instante absoluto para o que o relógio de parede marca naquele
 * fuso. É o caminho instante -> etiqueta local.
 */
export function getZonedParts(instant: Date, timeZone: string): ZonedParts {
  const parts = getFormatter(timeZone).formatToParts(instant);
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)!.value;

  const date = `${valueOf("year")}-${valueOf("month")}-${valueOf("day")}`;
  const time = `${valueOf("hour")}:${valueOf("minute")}`;
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();

  return { date, time, weekday };
}

function getOffsetMs(instant: Date, timeZone: string): number {
  const { date, time } = getZonedParts(instant, timeZone);
  const localAsIfUtc = new Date(`${date}T${time}:00Z`).getTime();
  const truncatedToMinute = Math.floor(instant.getTime() / 60_000) * 60_000;

  return localAsIfUtc - truncatedToMinute;
}

/**
 * Converte uma etiqueta local ("2026-07-30" às "10:00" em São Paulo) no
 * instante absoluto correspondente. É o caminho inverso do `getZonedParts`.
 *
 * O offset é aplicado duas vezes de propósito: o primeiro cálculo usa um
 * palpite que pode cair do lado errado de uma virada de horário de verão, e o
 * segundo corrige usando o instante já ajustado.
 */
export function zonedTimeToUtc(
  date: string,
  time: string,
  timeZone: string,
): Date {
  const guess = new Date(`${date}T${time}:00Z`);
  const firstOffset = getOffsetMs(guess, timeZone);
  const corrected = new Date(guess.getTime() - firstOffset);
  const secondOffset = getOffsetMs(corrected, timeZone);

  return new Date(guess.getTime() - secondOffset);
}
