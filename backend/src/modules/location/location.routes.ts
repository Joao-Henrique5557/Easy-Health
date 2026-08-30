import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { badRequest } from "../../middleware/errors";
import { haversineKm } from "../../lib/geo";

// Rotas de localização/mapas — seção 21.10 do readme (uso interno,
// integração com serviços externos). Não são chamadas pelo app hoje —
// expo-location já resolve coordenadas no device — mas ficam documentadas
// e implementadas aqui porque outras partes do backend (busca por
// endereço digitado, por exemplo) vão precisar delas no futuro.
//
// Implementado com Nominatim (OpenStreetMap), que não exige chave de API
// — decisão tomada na pesquisa de APIs do projeto como alternativa
// gratuita ao Google Geocoding.
export const locationRouter = Router();

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
// Nominatim exige um User-Agent identificável — sem isso, as requisições
// podem ser bloqueadas pela política de uso deles.
const USER_AGENT = "EasyHealthApp/1.0 (projeto academico IFAL)";

locationRouter.get(
  "/geocode",
  asyncHandler(async (req, res) => {
    const endereco = String(req.query.endereco ?? "");
    if (!endereco) throw badRequest("Informe o parâmetro 'endereco'.");

    const url = `${NOMINATIM_BASE}/search?format=json&limit=1&q=${encodeURIComponent(endereco)}`;
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!response.ok) throw badRequest("Não foi possível geocodificar este endereço agora.");

    const data = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
    if (data.length === 0) throw badRequest("Endereço não encontrado.");

    res.json({ latitude: Number(data[0].lat), longitude: Number(data[0].lon), enderecoFormatado: data[0].display_name });
  })
);

locationRouter.get(
  "/reverse-geocode",
  asyncHandler(async (req, res) => {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw badRequest("Informe latitude e longitude válidas.");
    }

    const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!response.ok) throw badRequest("Não foi possível converter estas coordenadas agora.");

    const data = (await response.json()) as { display_name?: string };
    res.json({ endereco: data.display_name ?? null });
  })
);

locationRouter.get(
  "/distancia",
  asyncHandler(async (req, res) => {
    const origemLat = Number(req.query.origemLat);
    const origemLng = Number(req.query.origemLng);
    const destinoLat = Number(req.query.destinoLat);
    const destinoLng = Number(req.query.destinoLng);

    if ([origemLat, origemLng, destinoLat, destinoLng].some(Number.isNaN)) {
      throw badRequest("Informe origemLat, origemLng, destinoLat e destinoLng.");
    }

    const distanciaKm = Number(haversineKm(origemLat, origemLng, destinoLat, destinoLng).toFixed(2));
    res.json({ distanciaKm });
  })
);
