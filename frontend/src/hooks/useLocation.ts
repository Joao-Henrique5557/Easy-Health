import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";

export interface Coords {
  latitude: number;
  longitude: number;
}

interface LocationState {
  coords: Coords | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

/**
 * Encapsula a API de localização do Android/iOS via expo-location.
 * Usado no modo emergência e na busca por atendimento (distância real).
 * Pede permissão em runtime — nunca assume que já foi concedida.
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    loading: false,
    error: null,
    permissionDenied: false,
  });

  const requestLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setState({ coords: null, loading: false, error: "Permissão negada", permissionDenied: true });
      return null;
    }

    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setState({ coords, loading: false, error: null, permissionDenied: false });
      return coords;
    } catch (e) {
      setState({
        coords: null,
        loading: false,
        error: "Não foi possível obter sua localização",
        permissionDenied: false,
      });
      return null;
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { ...state, refresh: requestLocation };
}
