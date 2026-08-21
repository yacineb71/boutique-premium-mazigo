import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({
  user: { role: "user" as const },
  isAuthenticated: true,
  loading: false,
}));

const cartState = vi.hoisted(() => ({
  items: [] as Array<{ id: number; name: string; price: number; quantity: number; category?: string; image?: string }>,
  total: 29.99,
  addToCart: vi.fn((product: { id: number; name: string; price: number; category?: string; image?: string }) => {
    cartState.items.push({ ...product, quantity: 1, image: product.image || "👕" });
    cartState.total = cartState.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }),
  updateQuantity: vi.fn((id: number, qty: number) => {
    const item = cartState.items.find((i) => i.id === id);
    if (item) item.quantity = Math.max(1, qty);
    cartState.total = cartState.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }),
  removeFromCart: vi.fn((id: number) => {
    cartState.items = cartState.items.filter((i) => i.id !== id);
    cartState.total = cartState.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }),
  clearCart: vi.fn(() => {
    cartState.items = [];
    cartState.total = 0;
  }),
}));

const routeState = vi.hoisted(() => ({
  currentLocation: "/shop",
  navigateMock: vi.fn(),
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => authState,
}));

vi.mock("wouter", () => ({
  useLocation: () => [routeState.currentLocation, routeState.navigateMock],
  useParams: () => ({ id: "1" }),
  Link: ({ children, href, ...props }: { children?: unknown; href: string; [key: string]: unknown }) =>
    createElement("a", { href, ...props }, children),
}));

vi.mock("lucide-react", () => ({
  Loader2: (props: Record<string, unknown>) => createElement("div", { ...props, "data-testid": "loader" }),
  ShoppingCart: () => createElement("span"),
  Star: () => createElement("span"),
  Heart: () => createElement("span"),
  Plus: () => createElement("span"),
  Minus: () => createElement("span"),
  Trash2: () => createElement("span"),
  ShoppingBag: () => createElement("span"),
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

import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

describe("full journey and error handling integration", () => {
  beforeEach(() => {
    authState.isAuthenticated = true;
    authState.user = { role: "user" };
    cartState.items = [];
    routeState.currentLocation = "/shop";
    routeState.navigateMock.mockClear();
    mutateAsyncMock.mockReset();
    (globalThis as Record<string, unknown>).open = (globalThis as Record<string, unknown>).open || (() => null);
    (globalThis as Record<string, unknown>).alert = (globalThis as Record<string, unknown>).alert || (() => {});
    vi.spyOn(globalThis, "open" as never).mockImplementation(() => null as never);
    vi.spyOn(globalThis, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("completes the full journey from Shop to ProductDetail, Cart, and successful Checkout session creation", async () => {
    routeState.currentLocation = "/product/1";
    let detailRenderer: ReactTestRenderer;
    act(() => {
      detailRenderer = create(createElement(ProductDetail));
    });

    const detailAddButtons = detailRenderer!.root.findAllByType("button").filter((btn) => btn.children.includes("Ajouter au Panier"));
    expect(detailAddButtons.length).toBeGreaterThan(0);

    act(() => {
      detailAddButtons[0].props.onClick();
    });

    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0].name).toBe("T-Shirt Premium Bleu");

    routeState.currentLocation = "/cart";
    let cartRenderer: ReactTestRenderer;
    act(() => {
      cartRenderer = create(createElement(Cart));
    });

    expect(cartRenderer!.root.findAllByType("h1").map((h) => h.children.join(""))).toContain("Mon Panier");

    routeState.currentLocation = "/checkout";
    let checkoutRenderer: ReactTestRenderer;
    act(() => {
      checkoutRenderer = create(createElement(Checkout));
    });

    mutateAsyncMock.mockResolvedValueOnce({ url: "https://checkout.stripe.com/test-session" });

    const paymentButton = checkoutRenderer!.root.findAllByType("button")[0];
    await act(async () => {
      await paymentButton.props.onClick();
    });

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      cartItems: [
        {
          id: 1,
          name: "T-Shirt Premium Bleu",
          price: 29.99,
          quantity: 1,
          category: "Vêtements",
        },
      ],
    });
    expect(globalThis.open).toHaveBeenCalledWith("https://checkout.stripe.com/test-session", "_blank");
  });

  it("handles createSession network error gracefully during checkout without crashing", async () => {
    cartState.items = [{ id: 2, name: "Crème Hydratante Luxe", price: 49.99, quantity: 2, category: "Cosmétiques" }];
    routeState.currentLocation = "/checkout";

    let checkoutRenderer: ReactTestRenderer;
    act(() => {
      checkoutRenderer = create(createElement(Checkout));
    });

    mutateAsyncMock.mockRejectedValueOnce(new Error("Stripe API down"));

    const paymentButton = checkoutRenderer!.root.findAllByType("button")[0];
    await act(async () => {
      await paymentButton.props.onClick();
    });

    expect(globalThis.alert).toHaveBeenCalledWith("Erreur lors de la création de la session de paiement");
  });

  it("exhibits loading state during createSession mutation", async () => {
    cartState.items = [{ id: 3, name: "Sac à Main Élégant", price: 89.99, quantity: 1, category: "Accessoires" }];
    routeState.currentLocation = "/checkout";

    let resolveMutation: (value: { url: string }) => void = () => {};
    const pendingPromise = new Promise<{ url: string }>((resolve) => {
      resolveMutation = resolve;
    });
    mutateAsyncMock.mockReturnValueOnce(pendingPromise);

    let checkoutRenderer: ReactTestRenderer;
    act(() => {
      checkoutRenderer = create(createElement(Checkout));
    });

    const paymentButton = checkoutRenderer!.root.findAllByType("button")[0];
    act(() => {
      paymentButton.props.onClick();
    });

    expect(checkoutRenderer!.root.findAllByProps({ "data-testid": "loader" })).toHaveLength(1);

    await act(async () => {
      resolveMutation({ url: "https://checkout.stripe.com/session-loading" });
      await pendingPromise;
    });
  });
});
