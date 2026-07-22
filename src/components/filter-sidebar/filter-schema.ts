import { createDefaultFiltersForCity, defaultCityId } from "@/lib/config/cities";
import {
  cannabisCategoryOptions,
  restrictedCategoryOptions
} from "@/lib/constants/categories";
import type { MapFilterState } from "@/types/map";

export const defaultFilterState: MapFilterState = createDefaultFiltersForCity(defaultCityId);

export { cannabisCategoryOptions, restrictedCategoryOptions };
