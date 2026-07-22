import { HeroUIProvider } from "@heroui/react";
import type { PropsWithChildren } from "react";

export function KobaGlueMapHeroUIProvider({ children }: PropsWithChildren) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
