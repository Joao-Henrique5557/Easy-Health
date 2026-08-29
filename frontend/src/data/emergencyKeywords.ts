export const EMERGENCY_KEYWORDS = [
  "socorro",
  "emergência",
  "emergencia",
  "não consigo respirar",
  "nao consigo respirar",
  "engasgado",
  "engasgada",
  "desmaiou",
  "desmaiei",
  "convulsão",
  "convulsao",
  "sangrando muito",
  "hemorragia",
  "infarto",
  "parada cardiaca",
  "parada cardíaca",
  "acidente grave",
  "não está respirando",
  "nao esta respirando",
  "inconsciente",
];

export function isEmergencyText(text: string): boolean {
  const t = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((k) => t.includes(k));
}
