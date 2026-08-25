import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const routeState = vi.hoisted(() => ({
  currentLocation: "/",
  navigateMock: vi.fn(),
}));

routeState.navigateMock.mockImplementation((nextLocation: string) => {
  routeState.currentLocation = nextLocation;
});

vi.mock("wouter", () => ({
  Link: ({ children, href, ...props }: { children?: unknown; href: string; [key: string]: unknown }) =>
    createElement("a", { href, ...props }, children),
  useLocation: () => [routeState.currentLocation, routeState.navigateMock],
}));

vi.mock("@/lib/trpc", () => ({ trpc: { content: { banners: { active: { useQuery: () => ({ data: [] }) } } } } }));
vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, isAuthenticated: false, loading: false, logout: vi.fn() }),
}));

vi.mock("@/components/Header", () => ({ Header: () => createElement("header", null, "Header") }));
vi.mock("@/components/Footer", () => ({ Footer: () => createElement("footer", null, "Footer") }));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) =>
    createElement("button", props, children),
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) =>
    createElement("div", props, children),
}));
vi.mock("@/hooks/useCart", () => ({ useCart: () => ({ addToCart: vi.fn() }) }));

import { NavigationLoader, NAVIGATION_LOADER_DURATION_MS } from "@/components/NavigationLoader";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

describe("search and navigation integration", () => {
  beforeEach(() => {
    routeState.currentLocation = "/";
    routeState.navigateMock.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the real NavigationLoader after a route change and hides it after the timeout", () => {
    let renderer: ReactTestRenderer;

    act(() => {
      renderer = create(createElement(NavigationLoader));
    });
    expect(renderer!.root.findAllByProps({ role: "status" })).toHaveLength(0);

    routeState.currentLocation = "/shop";
    act(() => {
      renderer!.update(createElement(NavigationLoader));
    });
    expect(renderer!.root.findAllByProps({ role: "status" })).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(NAVIGATION_LOADER_DURATION_MS);
    });
    expect(renderer!.root.findAllByProps({ role: "status" })).toHaveLength(0);
  });

  it("submits Home search to Shop and renders only matching products", () => {
    let homeRenderer: ReactTestRenderer;
    act(() => {
      homeRenderer = create(createElement(Home));
    });

    const input = homeRenderer!.root.findByProps({ id: "home-search" });
    act(() => {
      input.props.onChange({ target: { value: "robe" } });
    });

    const form = homeRenderer!.root.findByType("form");
    act(() => {
      form.props.onSubmit({ preventDefault: vi.fn() });
    });

    expect(routeState.navigateMock).toHaveBeenCalledWith("/shop?search=robe");

    let shopRenderer: ReactTestRenderer;
    act(() => {
      shopRenderer = create(createElement(Shop));
    });

    const productTitles = shopRenderer!.root
      .findAllByType("h3")
      .map((heading) => heading.children.join(""));

    expect(productTitles).toEqual(["Robe Soirée"]);
    const resultSummaries = shopRenderer!.root
      .findAllByType("p")
      .map((paragraph) => paragraph.children.join(""));
    expect(resultSummaries).toContain("1 produit trouvé");
  });
});
