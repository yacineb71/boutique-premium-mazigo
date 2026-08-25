import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrivateRoute } from "@/components/PrivateRoute";
import AdminMessages from "@/pages/AdminMessages";
import { AdminWorkspace, workspacePresets } from "@/pages/AdminWorkspace";
import { createElement, type ReactNode } from "react";

const authState = vi.hoisted(() => ({
  user: null as null | { role: "admin" | "user"; name?: string; email?: string },
  isAuthenticated: false,
  loading: false,
}));
const navigateMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/trpc", () => ({ trpc: { useUtils: () => ({ content: { messages: { list: { invalidate: vi.fn() } } } }), content: { messages: { list: { useQuery: () => ({ data: [], isLoading: false }) }, setStatus: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) }, remove: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) } } } } }));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ ...authState, logout: vi.fn() }) }));
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children?: ReactNode }) => createElement("a", { href, ...props }, children),
  useLocation: () => ["/admin", navigateMock],
}));

describe("admin dedicated routes", () => {
  beforeEach(() => {
    authState.user = { role: "admin", name: "Administrateur", email: "admin@mazigho.local" };
    authState.isAuthenticated = true;
    authState.loading = false;
    navigateMock.mockClear();
  });

  it("renders every dedicated workspace behind the admin guard", () => {
    const pages = Object.values(workspacePresets).map((preset) => createElement(AdminWorkspace, preset));
    pages.push(createElement(AdminMessages));

    pages.forEach((page) => {
      let renderer: ReactTestRenderer;
      act(() => { renderer = create(createElement(PrivateRoute, { requiredRole: "admin" }, page)); });
      expect(renderer!.root.findAllByType("main")).toHaveLength(1);
    });
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("redirects a visitor without a session away from every admin route", () => {
    authState.user = null;
    authState.isAuthenticated = false;
    const protectedPages = Object.values(workspacePresets).map((preset) => createElement(AdminWorkspace, preset));
    protectedPages.push(createElement(AdminMessages));

    protectedPages.forEach((page) => {
      act(() => { create(createElement(PrivateRoute, { requiredRole: "admin" }, page)); });
    });
    expect(navigateMock).toHaveBeenCalledTimes(protectedPages.length);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("redirects a connected standard user away from every admin route", () => {
    authState.user = { role: "user" };
    authState.isAuthenticated = true;
    const protectedPages = Object.values(workspacePresets).map((preset) => createElement(AdminWorkspace, preset));
    protectedPages.push(createElement(AdminMessages));

    protectedPages.forEach((page) => {
      act(() => { create(createElement(PrivateRoute, { requiredRole: "admin" }, page)); });
    });
    expect(navigateMock).toHaveBeenCalledTimes(protectedPages.length);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
