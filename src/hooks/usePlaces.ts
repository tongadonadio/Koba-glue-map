import { useEffect, useRef, useState } from "react";

import { subscribeToCityPlaces, type CityPlacesSnapshot } from "@/firebase/places";
import type { CityId } from "@/types/map";

type UsePlacesResult = {
  cannabis: CityPlacesSnapshot["cannabis"];
  restricted: CityPlacesSnapshot["restricted"];
  updatedAt: string | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Live subscription to a city's cannabis/restricted place datasets in
 * Firestore. Because it uses `onSnapshot`, re-running `npm run sync` updates
 * every open tab without a reload.
 */
export function usePlaces(cityId: CityId): UsePlacesResult {
  const [snapshot, setSnapshot] = useState<CityPlacesSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    hasLoadedRef.current = false;
    setSnapshot(null);
    setError(null);

    const unsubscribe = subscribeToCityPlaces(
      cityId,
      (next) => {
        hasLoadedRef.current = true;
        setSnapshot(next);
      },
      (err) => setError(err)
    );

    return unsubscribe;
  }, [cityId]);

  return {
    cannabis: snapshot?.cannabis ?? [],
    restricted: snapshot?.restricted ?? [],
    updatedAt: snapshot?.meta?.updatedAt ?? null,
    isLoading: !snapshot && !error,
    error
  };
}
