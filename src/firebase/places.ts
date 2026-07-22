import { doc, onSnapshot } from "firebase/firestore";

import { db } from "@/firebase/client";
import type { PlaceFeature } from "@/types/places";
import type { CityId } from "@/types/map";

export type CityMeta = {
  updatedAt: string | null;
  bounds?: { north: number; south: number; east: number; west: number };
  radiusMeters?: number;
  cannabisCategories?: string[];
  restrictedCategories?: string[];
};

export type CityPlacesSnapshot = {
  meta: CityMeta | null;
  cannabis: PlaceFeature[];
  restricted: PlaceFeature[];
};

export const cityMetaRef = (cityId: CityId) => doc(db, "cities", cityId);
export const cityCannabisRef = (cityId: CityId) => doc(db, "cities", cityId, "datasets", "cannabis");
export const cityRestrictedRef = (cityId: CityId) => doc(db, "cities", cityId, "datasets", "restricted");

/**
 * Subscribes to the three city documents and calls `onChange` whenever any of
 * them updates (e.g. right after a manual `npm run sync` writes fresh data).
 */
export function subscribeToCityPlaces(
  cityId: CityId,
  onChange: (snapshot: CityPlacesSnapshot) => void,
  onError: (error: Error) => void
) {
  const state: CityPlacesSnapshot = { meta: null, cannabis: [], restricted: [] };

  const emit = () => onChange({ ...state });

  const unsubMeta = onSnapshot(
    cityMetaRef(cityId),
    (snapshot) => {
      state.meta = (snapshot.data() as CityMeta | undefined) ?? null;
      emit();
    },
    onError
  );

  const unsubCannabis = onSnapshot(
    cityCannabisRef(cityId),
    (snapshot) => {
      state.cannabis = (snapshot.data()?.features as PlaceFeature[] | undefined) ?? [];
      emit();
    },
    onError
  );

  const unsubRestricted = onSnapshot(
    cityRestrictedRef(cityId),
    (snapshot) => {
      state.restricted = (snapshot.data()?.features as PlaceFeature[] | undefined) ?? [];
      emit();
    },
    onError
  );

  return () => {
    unsubMeta();
    unsubCannabis();
    unsubRestricted();
  };
}
