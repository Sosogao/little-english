export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysIsoDate(days: number, from = new Date()) {
  const nextDate = new Date(from);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().slice(0, 10);
}
