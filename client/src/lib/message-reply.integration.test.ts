import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ replyMutate: vi.fn() }));

vi.mock("@/components/AdminLayout", () => ({ AdminLayout: ({ children }: { children?: unknown }) => createElement("main", null, children) }));
vi.mock("@/components/ui/card", () => ({ Card: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) => createElement("section", props, children) }));
vi.mock("@/components/ui/button", () => ({ Button: ({ children, ...props }: { children?: unknown; [key: string]: unknown }) => createElement("button", props, children) }));
vi.mock("wouter", () => ({ Link: ({ children, href, ...props }: { children?: unknown; href: string; [key: string]: unknown }) => createElement("a", { href, ...props }, children) }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ content: { messages: { list: { invalidate: vi.fn() }, replies: { invalidate: vi.fn() } } } }),
    content: {
      messages: {
        list: { useQuery: () => ({ data: [{ id: 12, name: "Client réel", email: "client@example.com", subject: "Question commande", message: "Pouvez-vous m’aider ?", status: "new", createdAt: new Date("2026-08-25T10:00:00Z") }], isLoading: false }) },
        replies: { useQuery: () => ({ data: [], isLoading: false }) },
        setStatus: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
        reply: { useMutation: () => ({ mutate: state.replyMutate, isPending: false }) },
        remove: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      },
    },
  },
}));

import AdminMessages from "@/pages/AdminMessages";

describe("admin message reply flow", () => {
  beforeEach(() => state.replyMutate.mockClear());

  it("opens a reply composer and sends the selected message payload to the protected mutation", () => {
    let renderer: ReactTestRenderer;
    act(() => { renderer = create(createElement(AdminMessages)); });
    const replyButton = renderer!.root.findByProps({ "aria-label": "Répondre au message" });
    act(() => { replyButton.props.onClick(); });
    const subject = renderer!.root.findByProps({ "aria-label": "Objet de la réponse" });
    const body = renderer!.root.findByProps({ "aria-label": "Texte de la réponse" });
    act(() => {
      subject.props.onChange({ target: { value: "Re: Question commande" } });
      body.props.onChange({ target: { value: "Bonjour, nous revenons vers vous rapidement." } });
    });
    const form = renderer!.root.findByType("form");
    act(() => { form.props.onSubmit({ preventDefault: vi.fn() }); });
    expect(state.replyMutate).toHaveBeenCalledWith({ id: 12, subject: "Re: Question commande", body: "Bonjour, nous revenons vers vous rapidement." });
  });
});
