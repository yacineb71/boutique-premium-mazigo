import { z } from "zod";
import { notifyOwner } from "../_core/notification";
import { publicProcedure, router } from "../_core/trpc";
import { createContactMessage } from "../db";

const contactInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(5000),
});

const newsletterInput = z.object({ email: z.string().trim().email().max(200) });

export const contactRouter = router({
  subscribe: publicProcedure.input(newsletterInput).mutation(async ({ input }) => {
    const delivered = await notifyOwner({ title: "Nouvelle inscription newsletter MAZIGHO", content: `Email : ${input.email}` });
    return delivered ? { success: true as const, message: "Votre inscription est confirmée." } : { success: false as const, message: "L’inscription n’a pas pu être confirmée. Réessayez plus tard." };
  }),
  send: publicProcedure.input(contactInput).mutation(async ({ input }) => {
    await createContactMessage({ ...input, status: "new" });
    const delivered = await notifyOwner({
      title: `Message MAZIGHO : ${input.subject}`,
      content: `Nom : ${input.name}\nEmail : ${input.email}\n\n${input.message}`,
    });

    if (!delivered) {
      return { success: false as const, message: "Le message n’a pas pu être transmis. Réessayez ou écrivez-nous par email." };
    }

    return { success: true as const, message: "Votre message a bien été transmis. Nous vous répondrons rapidement." };
  }),
});
