import React, { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useLocation } from "wouter";

export const NAVIGATION_LOADER_DURATION_MS = 360;

export function shouldShowNavigationLoader(previousLocation: string, currentLocation: string): boolean {
  return previousLocation !== currentLocation;
}

interface NavigationLoaderViewProps {
  visible: boolean;
}

export function NavigationLoaderView({ visible }: NavigationLoaderViewProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Chargement de la page"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center"
    >
      <div className="mt-2 flex items-center gap-2 rounded-full bg-gray-950/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm">
        <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin text-teal-300" />
        <span>Chargement…</span>
      </div>
    </div>
  );
}

export function NavigationLoader() {
  const [location] = useLocation();
  const previousLocation = useRef(location);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldShowNavigationLoader(previousLocation.current, location)) {
      return;
    }

    previousLocation.current = location;
    setVisible(true);

    const timeoutId = globalThis.setTimeout(() => {
      setVisible(false);
    }, NAVIGATION_LOADER_DURATION_MS);

    return () => globalThis.clearTimeout(timeoutId);
  }, [location]);

  return <NavigationLoaderView visible={visible} />;
}
