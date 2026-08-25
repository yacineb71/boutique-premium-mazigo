type MetricPayload = {
  metric: string;
  value: number;
  path: string;
};

type UmamiWindow = Window & {
  umami?: { track: (event: string, data: MetricPayload) => void };
};

function report(metric: string, value: number) {
  if (!Number.isFinite(value) || typeof window === "undefined") return;
  const umami = (window as UmamiWindow).umami;
  umami?.track("mazigho_performance", { metric, value: Math.round(value), path: window.location.pathname });
}

export function startPerformanceMonitoring() {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") return () => undefined;

  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navigation) report("dom_content_loaded_ms", navigation.domContentLoadedEventEnd - navigation.startTime);

  const observers: PerformanceObserver[] = [];
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries.at(-1);
      if (lastEntry) report("lcp_ms", lastEntry.startTime);
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    observers.push(lcpObserver);
  } catch {
    // Certains navigateurs ne supportent pas LCP ; le site ne doit pas être affecté.
  }

  return () => observers.forEach((observer) => observer.disconnect());
}
