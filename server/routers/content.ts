import { z } from "zod";
import {
  createProductReview,
  createPromoBanner,
  deleteContactMessage,
  deleteProductReview,
  deletePromoBanner,
  getActivePromoBanners,
  getAllContactMessages,
  getAllProductReviews,
  getAllPromoBanners,
  updateContactMessage,
  updateProductReview,
  updatePromoBanner,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const idInput = z.object({ id: z.number().int().positive() });
const messageStatus = z.enum(["new", "read", "archived"]);
const reviewStatus = z.enum(["pending", "approved", "rejected"]);
const reviewFields = z.object({
  productId: z.number().int().positive(),
  authorName: z.string().trim().min(2).max(160),
  authorEmail: z.string().trim().email().max(320).optional().or(z.literal("")),
  title: z.string().trim().max(160).optional(),
  body: z.string().trim().min(10).max(5000),
  rating: z.number().int().min(1).max(5),
});
const bannerFields = z.object({
  eyebrow: z.string().trim().max(120).optional(),
  title: z.string().trim().min(2).max(255),
  description: z.string().trim().max(2000).optional(),
  ctaLabel: z.string().trim().max(120).optional(),
  ctaHref: z.string().trim().max(500).optional(),
  active: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export const contentRouter = router({
  messages: router({
    list: adminProcedure.query(() => getAllContactMessages()),
    setStatus: adminProcedure.input(idInput.extend({ status: messageStatus })).mutation(({ input }) => updateContactMessage(input.id, input.status)),
    remove: adminProcedure.input(idInput).mutation(({ input }) => deleteContactMessage(input.id)),
  }),
  reviews: router({
    publicByProduct: publicProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ input }) => (await getAllProductReviews()).filter((review) => review.productId === input.productId && review.status === "approved")),
    adminList: adminProcedure.query(() => getAllProductReviews()),
    create: adminProcedure.input(reviewFields.extend({ status: reviewStatus.default("pending") })).mutation(({ input }) => createProductReview({ ...input, authorEmail: input.authorEmail || null, title: input.title || null })),
    update: adminProcedure.input(idInput.extend({ status: reviewStatus.optional(), title: z.string().trim().max(160).optional(), body: z.string().trim().min(10).max(5000).optional(), rating: z.number().int().min(1).max(5).optional() })).mutation(({ input }) => updateProductReview(input.id, { status: input.status, title: input.title, body: input.body, rating: input.rating })),
    remove: adminProcedure.input(idInput).mutation(({ input }) => deleteProductReview(input.id)),
  }),
  banners: router({
    active: publicProcedure.query(() => getActivePromoBanners()),
    adminList: adminProcedure.query(() => getAllPromoBanners()),
    create: adminProcedure.input(bannerFields).mutation(({ input }) => createPromoBanner({ ...input, active: input.active ? 1 : 0, eyebrow: input.eyebrow || null, description: input.description || null, ctaLabel: input.ctaLabel || null, ctaHref: input.ctaHref || null })),
    update: adminProcedure.input(idInput.merge(bannerFields.partial())).mutation(({ input }) => updatePromoBanner(input.id, { ...input, active: input.active === undefined ? undefined : input.active ? 1 : 0 })),
    remove: adminProcedure.input(idInput).mutation(({ input }) => deletePromoBanner(input.id)),
  }),
});
