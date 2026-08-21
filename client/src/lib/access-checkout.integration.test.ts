import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({
  user: null as { role: "admin" | "user" } | null,
  isAuthenticated: false,
  loading: false,
}));

const cartState = vi.hoisted(() => ({
  items: [] as Array<{ id: number; name: string; price: number; quantity: number; category?: string }>,
}));

const routeState = vi.hoisted(() => ({
  currentLocation: "/",
  navigateMock: vi.fn(),
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => authState,
}));

vi.mock("wouter", () => ({
  useLocation: () => [routeState.currentLocation, routeState.navigateMock],
  Link: ({ children, href, ...props }: { children?: unknown; href: string; [key: string]: unknown }) =>
    createElement("a", { href, ...props }, children),
}));

vi.mock("lucide-react", () => ({
  Loader2: (props: Record<string, unknown>) => createElement("div", { ...props, "data-testid": "loader" }),
  ShoppingCart: () => createElement("span"),
}));

vi.mock("@/components/Header", () => ({ Header: () => createElement("header", null, "Header") }));
vi.mock("@/components/Footer", () => ({ Footer: () => createElement("footer", null, "Footer") }));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) =>
    createElement("div", props, children),
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) =>
    createElement("button", props, children),
}));
vi.mock("@/hooks/useCart", () => ({ useCart: () => cartState }));

const mutateAsyncMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/trpc", () => ({
  trpc: {
    checkout: {
      createSession: {
        useMutation: () => ({ mutateAsync: mutateAsyncMock }),
      },
    },
  },
}));

import { PrivateRoute } from "@/components/PrivateRoute";
import Checkout from "@/pages/Checkout";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

describe("access and checkout integration", () => {
  beforeEach(() => {
    authState.user = null;
    authState.isAuthenticated = false;
    authState.loading = false;
    cartState.items = [];
    routeState.currentLocation = "/";
    routeState.navigateMock.mockClear();
    mutateAsyncMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a loading state while the auth guard resolves", () => {
    authState.loading = true;
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(PrivateRoute, null, createElement("div", null, "Admin")));
    });

    expect(renderer!.root.findAllByProps({ "data-testid": "loader" })).toHaveLength(1);
    expect(renderer!.root.findAllByType("div").some((node) => node.children.includes("Admin"))).toBe(false);
  });

  it("redirects unauthenticated visitors and rejects non-admin users", () => {
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(PrivateRoute, { requiredRole: "admin" }, createElement("div", null, "Admin")));
    });
    expect(routeState.navigateMock).toHaveBeenCalledWith("/");
    expect(renderer!.toJSON()).toBe(null);

    routeState.navigateMock.mockClear();
    authState.isAuthenticated = true;
    authState.user = { role: "user" };
    act(() => {
      renderer!.update(createElement(PrivateRoute, { requiredRole: "admin" }, createElement("div", null, "Admin")));
    });
    expect(routeState.navigateMock).toHaveBeenCalledWith("/");
    expect(renderer!.toJSON()).toBe(null);
  });

  it("renders the admin content for an authenticated administrator", () => {
    authState.isAuthenticated = true;
    authState.user = { role: "admin" };
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(PrivateRoute, { requiredRole: "admin" }, createElement("div", null, "Admin")));
    });

    expect(renderer!.root.findAllByType("div").some((node) => node.children.includes("Admin"))).toBe(true);
  });

  it("shows the empty checkout state and routes back to Shop", () => {
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(Checkout));
    });

    expect(renderer!.root.findAllByType("h1").map((heading) => heading.children.join(""))).toContain("Panier Vide");
    const continueButton = renderer!.root.findAllByType("button")[0];
    act(() => continueButton.props.onClick());
    expect(routeState.navigateMock).toHaveBeenCalledWith("/shop");
  });

  it("routes an unauthenticated checkout attempt to Home without creating a Stripe session", async () => {
    cartState.items = [{ id: 8, name: "Robe Soirée", price: 129.99, quantity: 1, category: "Vêtements" }];
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(Checkout));
    });

    const paymentButton = renderer!.root.findAllByType("button")[0];
    await act(async () => paymentButton.props.onClick());
    expect(routeState.navigateMock).toHaveBeenCalledWith("/");
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });
});
