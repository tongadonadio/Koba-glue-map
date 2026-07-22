import type { LatLngLiteral } from "@/lib/geo";

export type SafeZone = {
  id: string;
  center: LatLngLiteral;
  paths: LatLngLiteral[][];
  areaSquareMeters: number;
  minDistanceMeters: number;
};
