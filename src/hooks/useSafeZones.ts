import { useMemo } from "react";

import { computeSafeZones } from "@/lib/club-zones";
import { getCityClubSafeDistance } from "@/lib/config/cities";
import type { CityId, RestrictedCategory } from "@/types/map";
import type { PlaceFeature } from "@/types/places";

/**
 * Computes club-enabled/restricted zone polygons in the browser for whatever
 * restricted categories are currently selected. Replaces the old server-side
 * precomputed variant cache (`buildSafeZoneCache`) — since `computeSafeZones`
 * is pure geometry with no Node-only APIs, running it on demand here supports
 * any category combination instead of only the ones precomputed ahead of time.
 */
export function useSafeZones(
  cityId: CityId,
  restrictedPlaces: PlaceFeature[],
  restrictedCategories: RestrictedCategory[],
  enabled: boolean
) {
  return useMemo(() => {
    if (!enabled) {
      return { enabledZones: [], restrictedPolygons: [] };
    }

    const categorySet = new Set(restrictedCategories);
    const filteredPlaces = restrictedPlaces.filter(
      (place) => !place.restrictedCategory || categorySet.has(place.restrictedCategory)
    );

    return computeSafeZones(filteredPlaces, {
      cityId,
      bufferDistanceMeters: getCityClubSafeDistance(cityId)
    });
  }, [cityId, restrictedPlaces, restrictedCategories, enabled]);
}
