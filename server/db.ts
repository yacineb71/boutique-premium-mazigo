import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertOrder, InsertOrderItem, InsertProductSupplierMeta, InsertContactMessage, InsertProductReview, InsertPromoBanner, InsertContactMessageReply, InsertResponseTemplate, InsertProduct, MediaAsset, InsertMediaAsset, mediaAssets, productMedia, orders, orderItems, productSupplierMeta, users, contactMessages, productReviews, promoBanners, contactMessageReplies, responseTemplates, products } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getProductSupplierMeta(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productSupplierMeta).where(eq(productSupplierMeta.productId, productId)).limit(1);
  return result[0];
}

export async function upsertProductSupplierMeta(meta: Omit<InsertProductSupplierMeta, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(productSupplierMeta).values(meta).onDuplicateKeyUpdate({
    set: { supplierUrl: meta.supplierUrl ?? null, supplierSku: meta.supplierSku ?? null, supplierCost: meta.supplierCost ?? null, notes: meta.notes ?? null },
  });
}

export type CheckoutOrderItem = Omit<InsertOrderItem, "id" | "orderId" | "createdAt">;

export async function createOrderWithItems(order: Omit<InsertOrder, "id" | "createdAt" | "updatedAt">, items: CheckoutOrderItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(orders).values(order);
  const created = await db.select({ id: orders.id }).from(orders).where(eq(orders.orderNumber, order.orderNumber)).limit(1);
  const orderId = created[0]?.id;
  if (!orderId) throw new Error("Order could not be created");
  if (items.length > 0) await db.insert(orderItems).values(items.map((item) => ({ ...item, orderId })));
  return orderId;
}

export async function getOrdersForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function updateOrderItemSupplier(itemId: number, values: Partial<Pick<InsertOrderItem, "supplierUrl" | "supplierCost">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(orderItems).set(values).where(eq(orderItems.id, itemId));
}

export async function markOrderPaidByStripeSession(stripeSessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(orders).set({ status: "to_order" }).where(eq(orders.stripeSessionId, stripeSessionId));
}

export async function updateOrderFulfillment(orderId: number, values: Partial<Pick<InsertOrder, "status" | "supplierOrderRef" | "trackingNumber" | "trackingUrl" | "internalNote">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(orders).set(values).where(eq(orders.id, orderId));
}

export async function createContactMessage(message: Omit<InsertContactMessage, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(contactMessages).values(message);
}

export async function getAllContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function getContactMessageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
  return result[0];
}

export async function updateContactMessage(id: number, status: InsertContactMessage["status"]) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id));
}

export async function deleteContactMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
}

export async function createContactMessageReply(reply: Omit<InsertContactMessageReply, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(contactMessageReplies).values(reply);
}

export async function getContactMessageReplies(messageId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessageReplies).where(eq(contactMessageReplies.messageId, messageId)).orderBy(desc(contactMessageReplies.createdAt));
}

export async function getAllResponseTemplates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(responseTemplates).orderBy(desc(responseTemplates.updatedAt));
}

export async function createResponseTemplate(template: Omit<InsertResponseTemplate, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(responseTemplates).values(template);
}

export async function updateResponseTemplate(id: number, values: Partial<Pick<InsertResponseTemplate, "name" | "subject" | "body" | "active">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(responseTemplates).set(values).where(eq(responseTemplates.id, id));
}

export async function deleteResponseTemplate(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(responseTemplates).where(eq(responseTemplates.id, id));
}

export async function getAllProductReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productReviews).orderBy(desc(productReviews.createdAt));
}

export async function createProductReview(review: Omit<InsertProductReview, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(productReviews).values(review);
}

export async function updateProductReview(id: number, values: Partial<Pick<InsertProductReview, "status" | "title" | "body" | "rating">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(productReviews).set(values).where(eq(productReviews.id, id));
}

export async function deleteProductReview(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(productReviews).where(eq(productReviews.id, id));
}

export async function getActivePromoBanners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(promoBanners).where(eq(promoBanners.active, 1)).orderBy(desc(promoBanners.sortOrder), desc(promoBanners.createdAt));
}

export async function getAllPromoBanners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(promoBanners).orderBy(desc(promoBanners.sortOrder), desc(promoBanners.createdAt));
}

export async function createPromoBanner(banner: Omit<InsertPromoBanner, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(promoBanners).values(banner);
}

export async function updatePromoBanner(id: number, values: Partial<Pick<InsertPromoBanner, "eyebrow" | "title" | "description" | "ctaLabel" | "ctaHref" | "active" | "sortOrder">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(promoBanners).set(values).where(eq(promoBanners.id, id));
}

export async function deletePromoBanner(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(promoBanners).where(eq(promoBanners.id, id));
}


export async function getAllMediaAssets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
}

export async function createMediaAsset(asset: InsertMediaAsset) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(mediaAssets).values(asset);
  return { id: Number(result[0].insertId), ...asset };
}

export async function deleteMediaAsset(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productMedia).where(eq(productMedia.mediaId, id));
  return db.delete(mediaAssets).where(eq(mediaAssets.id, id));
}

export async function getProductMedia(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ media: mediaAssets, link: productMedia }).from(productMedia).innerJoin(mediaAssets, eq(productMedia.mediaId, mediaAssets.id)).where(eq(productMedia.productId, productId)).orderBy(asc(productMedia.sortOrder));
}

export async function attachProductMedia(productId: number, mediaId: number, sortOrder = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(productMedia).values({ productId, mediaId, sortOrder });
  return { productId, mediaId, sortOrder };
}


export async function reorderProductMedia(productId: number, mediaIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (let sortOrder = 0; sortOrder < mediaIds.length; sortOrder += 1) {
    const mediaId = mediaIds[sortOrder];
    await db.update(productMedia).set({ sortOrder }).where(and(eq(productMedia.productId, productId), eq(productMedia.mediaId, mediaId)));
  }
  return getProductMedia(productId);
}


export async function getCatalogProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(asc(products.id));
}

export async function createCatalogProduct(input: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(products).values(input);
  return getCatalogProducts();
}

export async function updateCatalogProduct(id: number, input: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(input).where(eq(products.id, id));
  return getCatalogProducts();
}

export async function deleteCatalogProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
  return getCatalogProducts();
}
