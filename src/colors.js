export function normalizeHex(value) {
  if (typeof value !== 'string') return null;
  const hex = value.trim().replace(/^#/, '').toLowerCase();
  if (/^[a-f0-9]{3}$/.test(hex)) return `#${[...hex].map((character) => character.repeat(2)).join('')}`;
  return /^[a-f0-9]{6}$/.test(hex) ? `#${hex}` : null;
}

// Относительная яркость sRGB по формуле WCAG.
export function luminance(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) throw new Error('Нужен HEX-цвет из 3 или 6 символов.');
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(normalized.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function contrastRatio(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// Порог проверяем до округления числа для экрана.
export function contrastChecks(ratio) {
  return [
    { title: 'Обычный текст', level: 'AA', required: 4.5, passed: ratio >= 4.5 },
    { title: 'Крупный текст', level: 'AA', required: 3, passed: ratio >= 3 },
    { title: 'Обычный текст', level: 'AAA', required: 7, passed: ratio >= 7 },
  ];
}

export const EXAMPLES = [
  { name: 'Светлая', text: '#26314d', background: '#ffffff' },
  { name: 'Тёмная', text: '#f3f5fa', background: '#202b42' },
  { name: 'Жёлтая', text: '#303047', background: '#f0bb54' },
  { name: 'Слабый контраст', text: '#aaaaaa', background: '#ffffff' },
];
