import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";

const journeyState = vi.hoisted(() => ({
  currentLocation: "/",
  items: [] as Array<Record<string, any>>,
  open: vi.fn(),
  createSession: vi.fn(),
}));

vi.mock("wouter", () => ({
  Link: ({ children, href, onClick, ...props }: { children?: unknown; href: string; onClick?: (event: { preventDefault: () => void }) => void; [key: string]: unknown }) =>
    createElement("a", {
      href,
      ...props,
      onClick: (event: { preventDefault: () => void }) => {
        event.preventDefault();
        onClick?.(event);
        journeyState.currentLocation = href;
      },
    }, children),
  useLocation: () => [journeyState.currentLocation, (nextLocation: string) => { journeyState.currentLocation = nextLocation; }],
  useParams: () => ({ id: "1" }),
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: { name: "Client MAZIGHO", role: "user" }, isAuthenticated: true, loading: false, logout: vi.fn() }),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) => createElement("button", props, children),
}));
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) => createElement("div", props, children),
}));
vi.mock("@/components/ProductReview", () => ({ ProductReview: () => createElement("section", null, "Avis Clients") }));
vi.mock("@/components/Footer", () => ({ Footer: () => createElement("footer", null, "Footer") }));
vi.mock("lucide-react", () => {
  const Icon = (props: Record<string, unknown>) => createElement("span", props);
  return {
    ArrowRight: Icon,
    Heart: Icon,
    Loader2: Icon,
    Menu: Icon,
    Moon: Icon,
    Minus: Icon,
    Plus: Icon,
    Search: Icon,
    ShoppingBag: Icon,
    ShoppingCart: Icon,
    Star: Icon,
    Sun: Icon,
    Trash2: Icon,
    UserRound: Icon,
    X: Icon,
  };
});
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn(), switchable: true }),
}));
vi.mock("@/hooks/useCart", () => ({
  useCart: () => ({
    get items() { return journeyState.items; },
    get itemCount() { return journeyState.items.reduce((sum, item) => sum + item.quantity, 0); },
    get total() { return journeyState.items.reduce((sum, item) => sum + item.price * item.quantity, 0); },
    addToCart: (product: Record<string, any>) => {
      const existing = journeyState.items.find((item) => item.id === product.id);
      if (existing) existing.quantity += 1;
      else journeyState.items.push({ ...product, quantity: 1 });
    },
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
  }),
}));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    checkout: {
      createSession: {
        useMutation: () => ({ mutateAsync: journeyState.createSession }),
      },
    },
  },
}));

import { Header } from "@/components/Header";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

function render(element: React.ReactElement): ReactTestRenderer {
  let renderer!: ReactTestRenderer;
  act(() => { renderer = create(element); });
  return renderer;
}

describe("rendered post-redesign purchase journey", () => {
  beforeEach(() => {
    journeyState.currentLocation = "/";
    journeyState.items = [];
    journeyState.open.mockReset();
    journeyState.createSession.mockReset();
    journeyState.createSession.mockResolvedValue({ url: "https://checkout.stripe.test/session" });
    (globalThis as Record<string, unknown>).open = journeyState.open;
  });

  it("starts from Header, renders each storefront page, adds a product, and opens checkout", async () => {
    const header = render(createElement(Header));
    const boutiqueLink = header.root.findAllByType("a").find((link) => link.props.href === "/shop" && link.children.join("") === "Boutique");
    expect(boutiqueLink).toBeDefined();

    act(() => boutiqueLink!.props.onClick({ preventDefault: vi.fn() }));
    expect(journeyState.currentLocation).toBe("/shop");

    const shop = render(createElement(Shop));
    const productCard = shop.root.findAllByType("div").find((node) =>
      typeof node.props.className === "string" &&
      node.props.className.includes("group") &&
      node.props.className.includes("hover:-translate-y-2"),
    );
    expect(productCard).toBeDefined();
    const quickViewLink = shop.root.findAllByType("a").find((link) => link.children.join("").includes("Voir le produit"));
    expect(quickViewLink).toBeDefined();
    const productLink = shop.root.findAllByType("a").find((link) => link.props.href === "/product/1");
    expect(productLink).toBeDefined();
    act(() => productLink!.props.onClick({ preventDefault: vi.fn() }));
    expect(journeyState.currentLocation).toBe("/product/1");

    const detail = render(createElement(ProductDetail));
    const addButton = detail.root.findAllByType("button").find((button) => button.children.join("").includes("Ajouter au Panier"));
    expect(addButton).toBeDefined();
    act(() => addButton!.props.onClick());
    expect(journeyState.currentLocation).toBe("/cart");
    expect(journeyState.items).toHaveLength(1);

    const cart = render(createElement(Cart));
    const checkoutLink = cart.root.findAllByType("a").find((link) => link.props.href === "/checkout");
    expect(checkoutLink).toBeDefined();
    act(() => checkoutLink!.props.onClick({ preventDefault: vi.fn() }));
    expect(journeyState.currentLocation).toBe("/checkout");

    const checkout = render(createElement(Checkout));
    const payButton = checkout.root.findAllByType("button").find((button) => button.children.join("").includes("Procéder au paiement"));
    expect(payButton).toBeDefined();
    await act(async () => { await payButton!.props.onClick(); });
    expect(journeyState.createSession).toHaveBeenCalledTimes(1);
    expect(journeyState.open).toHaveBeenCalledWith("https://checkout.stripe.test/session", "_blank");
  });
});
