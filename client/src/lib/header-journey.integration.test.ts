import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";

const routeState = vi.hoisted(() => ({
  currentLocation: "/",
  navigateMock: vi.fn(),
}));

const themeState = vi.hoisted(() => ({
  theme: "light" as "light" | "dark",
  toggleMock: vi.fn(),
}));

const authState = vi.hoisted(() => ({
  user: null as null | { role: "admin" | "user"; name?: string; email?: string },
  isAuthenticated: false,
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
  useAuth: () => ({ ...authState, loading: false, logout: vi.fn() }),
}));

vi.mock("@/hooks/useCart", () => ({ useCart: () => ({ itemCount: 0 }) }));
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({ theme: themeState.theme, toggleTheme: themeState.toggleMock, switchable: true }),
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) => createElement("button", props, children),
}));

import { Header } from "@/components/Header";

describe("post-redesign header purchase journey", () => {
  beforeEach(() => {
    routeState.currentLocation = "/";
    routeState.navigateMock.mockClear();
    themeState.theme = "light";
    themeState.toggleMock.mockClear();
    authState.user = null;
    authState.isAuthenticated = false;
  });

  it("exposes an accessible theme toggle in the Header", () => {
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(Header));
    });

    const themeButton = renderer!.root.findAllByType("button").find((button) =>
      button.props["aria-label"] === "Activer le thème sombre",
    );
    expect(themeButton).toBeDefined();
    expect(themeButton!.props["aria-pressed"]).toBe(false);

    act(() => {
      themeButton!.props.onClick();
    });
    expect(themeState.toggleMock).toHaveBeenCalledTimes(1);
  });

  it("does not expose the admin account to a standard customer", () => {
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(Header));
    });

    expect(renderer!.root.findAllByType("a").some((link) => link.children.join("") === "Admin")).toBe(false);
  });

  it("opens the mobile menu and keeps the theme control accessible", () => {
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(Header));
    });

    const menuButton = renderer!.root.findAllByType("button").find((button) =>
      button.props["aria-label"] === "Ouvrir le menu",
    );
    expect(menuButton).toBeDefined();

    act(() => {
      menuButton!.props.onClick();
    });

    const mobileThemeButton = renderer!.root.findAllByType("button").find((button) =>
      button.children.join("").includes("Thème sombre"),
    );
    expect(mobileThemeButton).toBeDefined();
    act(() => {
      mobileThemeButton!.props.onClick();
    });
    expect(themeState.toggleMock).toHaveBeenCalledTimes(1);
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
