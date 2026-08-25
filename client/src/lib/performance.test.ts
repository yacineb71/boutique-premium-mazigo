import { describe, expect, it } from "vitest";
import { startPerformanceMonitoring } from "./performance";

describe("performance monitoring", () => {
  it("is safe when no browser window is available", () => {
    const stop = startPerformanceMonitoring();
    expect(stop).toBeTypeOf("function");
    expect(() => stop()).not.toThrow();
  });
});
