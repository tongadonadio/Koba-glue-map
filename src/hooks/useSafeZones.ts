import { useMemo } from "react";

import { computeSafeZones } from "@/lib/club-zones";
import { getCityClubSafeDistance } from "@/lib/config/cities";
import type { CityId } from "@/types/map";
import type { PlaceFeature } from "@/types/places";

/**
 * Computes club-enabled/restricted zone polygons in the browser from every
 * restricted place in the city, regardless of which categories the sidebar
 * currently has checked. The sidebar's "Sensitive Places" filter only
 * controls which markers are drawn — zone legality can't depend on which
 * pins the user happens to be looking at.
 */
export function useSafeZones(
  cityId: CityId,
  restrictedPlaces: PlaceFeature[],
  enabled: boolean
) {
  return useMemo(() => {
    if (!enabled) {
      return { enabledZones: [], restrictedPolygons: [] };
    }

    return computeSafeZones(restrictedPlaces, {
      cityId,
      bufferDistanceMeters: getCityClubSafeDistance(cityId)
    });
  }, [cityId, restrictedPlaces, enabled]);
}
