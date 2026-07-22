/**
 * Manual data refresh: fetches cannabis + restricted places from Google
 * Places for the reference city and writes them to Firestore. Run with
 * `npm run sync`. No scheduling — rerun this whenever you want fresh data.
 */
import "dotenv/config";
import admin from "firebase-admin";

import { fetchCannabisPlaces, fetchRestrictedPlaces } from "../src/lib/google-places";
import { cannabisCategoryList, restrictedCategoryList } from "../src/lib/constants/categories";
import { defaultCityId } from "../src/lib/config/cities";
import { referenceCity } from "../src/lib/config/reference-city";

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
  const db = admin.firestore();

  const { center, bounds, segments, radiusMeters } = referenceCity;

  console.log(`Syncing "${defaultCityId}" from Google Places…`);

  const [cannabisResponse, restrictedResponse] = await Promise.all([
    fetchCannabisPlaces({
      location: center,
      bounds,
      boundsSegments: segments,
      radius: radiusMeters,
      categories: cannabisCategoryList
    }),
    fetchRestrictedPlaces({
      location: center,
      bounds,
      boundsSegments: segments,
      radius: radiusMeters,
      categories: restrictedCategoryList
    })
  ]);

  const updatedAt = new Date().toISOString();
  const cityRef = db.collection("cities").doc(defaultCityId);
  const datasetsRef = cityRef.collection("datasets");

  await Promise.all([
    cityRef.set({
      updatedAt,
      bounds,
      radiusMeters,
      cannabisCategories: cannabisCategoryList,
      restrictedCategories: restrictedCategoryList
    }),
    datasetsRef.doc("cannabis").set({ features: cannabisResponse.features }),
    datasetsRef.doc("restricted").set({ features: restrictedResponse.features })
  ]);

  console.log(
    `Synced "${defaultCityId}" at ${updatedAt} — cannabis=${cannabisResponse.features.length}, restricted=${restrictedResponse.features.length}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to sync places", error);
    process.exit(1);
  });
