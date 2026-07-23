import type { MapFilterState, CityId, RestrictedCategory } from "@/types/map";

type CityDefinition = {
  id: CityId;
  name: string;
  country: string;
  displayName: string;
  clubSafeDistanceMeters: number;
  restrictedCategories: RestrictedCategory[];
};

const cityDefinitions: Record<CityId, CityDefinition> = {
  montevideo: {
    id: "montevideo",
    name: "Montevideo",
    country: "Uruguay",
    displayName: "Montevideo, Uruguay",
    clubSafeDistanceMeters: 200,
    restrictedCategories: [
      "charter_school",
      "cultural_center",
      "kindergarten",
      "rehab_center",
      "school"
    ]
  }
};

export const defaultCityId: CityId = "montevideo";

export const cityOptions = Object.values(cityDefinitions).map((city) => ({
  id: city.id,
  label: city.displayName
}));

export function getCityDefinition(cityId: CityId): CityDefinition {
  const city = cityDefinitions[cityId];
  if (!city) {
    throw new Error(`City ${cityId} is not configured`);
  }
  return city;
}

export function getCityRestrictedCategories(cityId: CityId): RestrictedCategory[] {
  return [...getCityDefinition(cityId).restrictedCategories];
}

export function getCityClubSafeDistance(cityId: CityId) {
  return getCityDefinition(cityId).clubSafeDistanceMeters;
}

export function createDefaultFiltersForCity(cityId: CityId): MapFilterState {
  // Validates the city is configured; intentionally start with nothing
  // checked so the map opens empty until the user picks what to see.
  getCityDefinition(cityId);
  return {
    cityId,
    cannabisCategories: [],
    restrictedCategories: [],
    clubZoneMode: "enabled"
  };
}
