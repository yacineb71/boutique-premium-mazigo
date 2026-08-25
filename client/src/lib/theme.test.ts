import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, resolveStoredTheme, useTheme } from "@/contexts/ThemeContext";

describe("theme preference", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
    if (originalDocument) {
      Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
    } else {
      Reflect.deleteProperty(globalThis, "document");
    }
  });

  it("uses the default theme during server rendering", () => {
    Reflect.deleteProperty(globalThis, "window");

    expect(resolveStoredTheme("light")).toBe("light");
    expect(resolveStoredTheme("dark")).toBe("dark");
  });

  it("toggles the real provider, updates the document and persists the preference", () => {
    const storage = {
      value: "light",
      getItem: vi.fn(() => storage.value),
      setItem: vi.fn((_key: string, value: string) => { storage.value = value; }),
    };
    const classList = { add: vi.fn(), remove: vi.fn() };
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: storage },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: { documentElement: { classList } },
    });

    function ThemeProbe() {
      const { theme, toggleTheme } = useTheme();
      return createElement("button", { "data-theme": theme, onClick: toggleTheme });
    }

    let renderer!: ReturnType<typeof create>;
    act(() => {
      renderer = create(createElement(ThemeProvider, { switchable: true }, createElement(ThemeProbe)));
    });
    expect(renderer.root.findByType("button").props["data-theme"]).toBe("light");

    act(() => {
      renderer.root.findByType("button").props.onClick();
    });

    expect(renderer.root.findByType("button").props["data-theme"]).toBe("dark");
    expect(classList.add).toHaveBeenCalledWith("dark");
    expect(storage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("restores only valid stored preferences", () => {
    const getItem = vi.fn().mockReturnValueOnce("dark").mockReturnValueOnce("invalid");
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: { getItem } },
    });

    expect(resolveStoredTheme("light")).toBe("dark");
    expect(resolveStoredTheme("light")).toBe("light");
  });
});
