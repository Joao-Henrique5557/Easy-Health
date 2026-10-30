function formatDecimal(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(1) : null;
}

module.exports = { formatDecimal };
