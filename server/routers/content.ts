import { z } from "zod";
import {
  createContactMessageReply,
  createProductReview,
  createResponseTemplate,
  createPromoBanner,
  deleteContactMessage,
  deleteProductReview,
  deletePromoBanner,
  getActivePromoBanners,
  getAllContactMessages,
  getContactMessageById,
  getContactMessageReplies,
  getAllResponseTemplates,
  getAllProductReviews,
  getAllPromoBanners,
  updateContactMessage,
  updateProductReview,
  updateResponseTemplate,
  updatePromoBanner,
  deleteResponseTemplate,
  createMediaAsset,
  deleteMediaAsset,
  getAllMediaAssets,
  attachProductMedia,
  getProductMedia,
  reorderProductMedia,
  getCatalogProducts,
  getCatalogProductById,
  createCatalogProduct,
  updateCatalogProduct,
  deleteCatalogProduct,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";

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
  const productFields = z.object({
    categoryId: z.number().int().positive(),
    name: z.string().trim().min(2).max(200),
    slug: z.string().trim().min(2).max(200),
    description: z.string().trim().max(5000).optional(),
    price: z.number().int().nonnegative(),
    originalPrice: z.number().int().nonnegative().optional(),
    stock: z.number().int().nonnegative().default(0),
    featured: z.number().int().min(0).max(1).default(0),
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
    replies: adminProcedure.input(idInput).query(({ input }) => getContactMessageReplies(input.id)),
    setStatus: adminProcedure.input(idInput.extend({ status: messageStatus })).mutation(({ input }) => updateContactMessage(input.id, input.status)),
    reply: adminProcedure.input(idInput.extend({ body: z.string().trim().min(2).max(5000), subject: z.string().trim().min(2).max(255).optional() })).mutation(async ({ input, ctx }) => {
      const message = await getContactMessageById(input.id);
      if (!message) throw new Error("Message introuvable");
      const subject = input.subject?.trim() || `Re: ${message.subject}`;
      const body = input.body.trim();
      await createContactMessageReply({ messageId: message.id, adminUserId: ctx.user.id, recipientEmail: message.email, subject, body, deliveryMethod: "mailto" });
      await updateContactMessage(message.id, "read");
      return { recipientEmail: message.email, subject, body };
    }),
    remove: adminProcedure.input(idInput).mutation(({ input }) => deleteContactMessage(input.id)),
  }),
  reviews: router({
    publicByProduct: publicProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ input }) => (await getAllProductReviews()).filter((review) => review.productId === input.productId && review.status === "approved")),
    adminList: adminProcedure.query(() => getAllProductReviews()),
    create: adminProcedure.input(reviewFields.extend({ status: reviewStatus.default("pending") })).mutation(({ input }) => createProductReview({ ...input, authorEmail: input.authorEmail || null, title: input.title || null })),
    update: adminProcedure.input(idInput.extend({ status: reviewStatus.optional(), title: z.string().trim().max(160).optional(), body: z.string().trim().min(10).max(5000).optional(), rating: z.number().int().min(1).max(5).optional() })).mutation(({ input }) => updateProductReview(input.id, { status: input.status, title: input.title, body: input.body, rating: input.rating })),
    remove: adminProcedure.input(idInput).mutation(({ input }) => deleteProductReview(input.id)),
  }),
  templates: router({
    list: adminProcedure.query(() => getAllResponseTemplates()),
    create: adminProcedure.input(z.object({ name: z.string().trim().min(2).max(160), subject: z.string().trim().min(2).max(255), body: z.string().trim().min(2).max(5000), active: z.boolean().default(true) })).mutation(({ input }) => createResponseTemplate({ ...input, active: input.active ? 1 : 0 })),
    update: adminProcedure.input(idInput.extend({ name: z.string().trim().min(2).max(160).optional(), subject: z.string().trim().min(2).max(255).optional(), body: z.string().trim().min(2).max(5000).optional(), active: z.boolean().optional() })).mutation(({ input }) => updateResponseTemplate(input.id, { name: input.name, subject: input.subject, body: input.body, active: input.active === undefined ? undefined : input.active ? 1 : 0 })),
    remove: adminProcedure.input(idInput).mutation(({ input }) => deleteResponseTemplate(input.id)),
  }),
  products: router({
    list: publicProcedure.query(() => getCatalogProducts()),
    byId: publicProcedure.input(idInput).query(({ input }) => getCatalogProductById(input.id)),
    adminList: adminProcedure.query(() => getCatalogProducts()),
    create: adminProcedure.input(productFields).mutation(({ input }) => createCatalogProduct({ ...input, description: input.description || null, originalPrice: input.originalPrice ?? null })),
    update: adminProcedure.input(idInput.merge(productFields.partial())).mutation(({ input }) => updateCatalogProduct(input.id, { ...input, description: input.description || undefined })),
    remove: adminProcedure.input(idInput).mutation(({ input }) => deleteCatalogProduct(input.id)),
  }),
  media: router({
    list: adminProcedure.query(() => getAllMediaAssets()),
    byProduct: adminProcedure.input(z.object({ productId: z.number().int().positive() })).query(({ input }) => getProductMedia(input.productId)),
    publicByProduct: publicProcedure.input(z.object({ productId: z.number().int().positive() })).query(({ input }) => getProductMedia(input.productId)),
    addUrl: adminProcedure.input(z.object({ url: z.string().url().max(2000), altText: z.string().trim().max(255).optional(), filename: z.string().trim().max(255).optional() })).mutation(({ input, ctx }) => createMediaAsset({ url: input.url, altText: input.altText || null, filename: input.filename || null, createdBy: ctx.user.id, kind: "image" })),
    upload: adminProcedure.input(z.object({ filename: z.string().trim().min(1).max(255), mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"]), base64: z.string().min(100).max(12_000_000), altText: z.string().trim().max(255).optional() })).mutation(async ({ input, ctx }) => { const key = `mazigho-media/${Date.now()}-${input.filename.replace(/[^a-zA-Z0-9._-]/g, "-")}`; const uploaded = await storagePut(key, Buffer.from(input.base64, "base64"), input.mimeType); return createMediaAsset({ url: `/manus-storage/${uploaded.key}`, storageKey: uploaded.key, filename: input.filename, mimeType: input.mimeType, altText: input.altText || null, createdBy: ctx.user.id, kind: "image" }); }),
    attachToProduct: adminProcedure.input(z.object({ productId: z.number().int().positive(), mediaId: z.number().int().positive(), sortOrder: z.number().int().min(0).default(0) })).mutation(({ input }) => attachProductMedia(input.productId, input.mediaId, input.sortOrder)),
    reorderProduct: adminProcedure.input(z.object({ productId: z.number().int().positive(), mediaIds: z.array(z.number().int().positive()).max(24) })).mutation(({ input }) => reorderProductMedia(input.productId, input.mediaIds)),
    remove: adminProcedure.input(idInput).mutation(({ input }) => deleteMediaAsset(input.id)),
  }),
  banners: router({
    active: publicProcedure.query(() => getActivePromoBanners()),
    adminList: adminProcedure.query(() => getAllPromoBanners()),
    create: adminProcedure.input(bannerFields).mutation(({ input }) => createPromoBanner({ ...input, active: input.active ? 1 : 0, eyebrow: input.eyebrow || null, description: input.description || null, ctaLabel: input.ctaLabel || null, ctaHref: input.ctaHref || null })),
    update: adminProcedure.input(idInput.merge(bannerFields.partial())).mutation(({ input }) => updatePromoBanner(input.id, { ...input, active: input.active === undefined ? undefined : input.active ? 1 : 0 })),
    remove: adminProcedure.input(idInput).mutation(({ input }) => deletePromoBanner(input.id)),
  }),
});
