import { describe, expect, it, vi } from "vitest";

const notifyOwner = vi.hoisted(() => vi.fn().mockResolvedValue(true));
vi.mock("@/../../server/_core/notification", () => ({ notifyOwner }));

import { contactRouter } from "@/../../server/routers/contact";

describe("contact actions", () => {
  const caller = contactRouter.createCaller({} as never);

  it("transmits a valid contact message", async () => {
    await expect(caller.send({ name: "Yacine", email: "yacine@example.com", subject: "Commande", message: "Je souhaite connaître le suivi de ma commande." })).resolves.toEqual({ success: true, message: expect.any(String) });
    expect(notifyOwner).toHaveBeenCalledWith(expect.objectContaining({ title: expect.stringContaining("Commande"), content: expect.stringContaining("yacine@example.com") }));
  });

  it("rejects incomplete contact data before sending", async () => {
    await expect(caller.send({ name: "A", email: "bad", subject: "x", message: "court" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("transmits a valid newsletter subscription", async () => {
    await expect(caller.subscribe({ email: "news@example.com" })).resolves.toEqual({ success: true, message: expect.any(String) });
  });
});
