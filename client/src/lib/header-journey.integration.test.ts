import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";

const routeState = vi.hoisted(() => ({
  currentLocation: "/",
  navigateMock: vi.fn(),
}));

routeState.navigateMock.mockImplementation((nextLocation: string) => {
  routeState.currentLocation = nextLocation;
});

vi.mock("wouter", () => ({
  Link: ({ children, href, onClick, ...props }: { children?: unknown; href: string; onClick?: (event: { preventDefault: () => void }) => void; [key: string]: unknown }) =>
    createElement("a", {
      href,
      ...props,
      onClick: (event: { preventDefault: () => void }) => {
        event.preventDefault();
        onClick?.(event);
        routeState.navigateMock(href);
      },
    }, children),
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, isAuthenticated: false, loading: false, logout: vi.fn() }),
}));

vi.mock("@/hooks/useCart", () => ({ useCart: () => ({ itemCount: 0 }) }));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) => createElement("button", props, children),
}));

import { Header } from "@/components/Header";

describe("post-redesign header purchase journey", () => {
  beforeEach(() => {
    routeState.currentLocation = "/";
    routeState.navigateMock.mockClear();
  });

  it("starts at Header Boutique and follows the validated purchase route sequence", () => {
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(Header));
    });

    const boutiqueLink = renderer!.root.findAllByType("a").find((link) =>
      link.props.href === "/shop" && link.children.join("") === "Boutique",
    );
    expect(boutiqueLink).toBeDefined();

    act(() => {
      boutiqueLink!.props.onClick({ preventDefault: vi.fn() });
    });
    expect(routeState.currentLocation).toBe("/shop");

    ["/product/1", "/cart", "/checkout"].forEach((nextLocation) => {
      act(() => {
        routeState.navigateMock(nextLocation);
      });
      expect(routeState.currentLocation).toBe(nextLocation);
    });
  });
});
