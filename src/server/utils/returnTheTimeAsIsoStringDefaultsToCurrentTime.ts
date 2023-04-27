export default function returnTheTimeAsIsoStringDefaultsToCurrentTime(
  date: Date = new Date()
) {
  const isoString = date.toISOString();
  return isoString;
}
