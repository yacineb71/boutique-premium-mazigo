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
        list: { useQuery: () => ({ data: [{ id: 12, name: "Client réel", email: "client@example.com", subject: "Question commande", message: "Pouvez-vous m’aider ?", status: "new", createdAt: new Date("2026-08-25T10:00:00Z") }, { id: 13, name: "Ancien client", email: "ancien@example.com", subject: "Ancienne demande", message: "Message archivé", status: "archived", createdAt: new Date("2026-08-24T10:00:00Z") }], isLoading: false }) },
        replies: { useQuery: () => ({ data: [], isLoading: false }) },
        setStatus: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
        reply: { useMutation: () => ({ mutate: state.replyMutate, isPending: false }) },
        remove: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      },
      templates: {
        list: { useQuery: () => ({ data: [{ id: 3, name: "Suivi de commande", subject: "Re: {{sujet}}", body: "Bonjour {{nom}}, votre demande est bien reçue.", active: 1 }], isLoading: false }) },
        create: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
        update: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
        remove: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      },
    },
  },
}));

import AdminMessages from "@/pages/AdminMessages";

describe("admin message reply flow", () => {
  beforeEach(() => state.replyMutate.mockClear());

  it("applies a reusable template and sends the selected message payload to the protected mutation", () => {
    let renderer: ReactTestRenderer;
    act(() => { renderer = create(createElement(AdminMessages)); });
    const replyButton = renderer!.root.findAllByProps({ "aria-label": "Répondre au message" })[0];
    act(() => { replyButton.props.onClick(); });
    const templateButton = renderer!.root.findAllByType("button").find((button) => button.children.includes("Suivi de commande"));
    act(() => { templateButton!.props.onClick(); });
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

  it("filters the inbox by status", () => {
    let renderer: ReactTestRenderer;
    act(() => { renderer = create(createElement(AdminMessages)); });
    const filter = renderer!.root.findByProps({ "aria-label": "Filtrer par statut" });
    act(() => { filter.props.onChange({ target: { value: "archived" } }); });
    const subjects = renderer!.root.findAllByType("h3").map((heading) => heading.children.join(""));
    expect(subjects).toEqual(["Ancienne demande"]);
  });
});
