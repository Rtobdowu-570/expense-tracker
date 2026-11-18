// Keeps amounts at whole cents so sums don't drift (0.1 + 0.2 -> 0.30000000000000004)
export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}
