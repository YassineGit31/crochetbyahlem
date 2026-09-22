import { z } from "zod";

export const cartItemOptionsSchema = z.object({
  color: z.string().max(60).optional(),
  size: z.string().max(60).optional(),
  variantId: z.string().max(80).optional(),
  variantLabel: z.string().max(120).optional(),
  note: z.string().max(500).optional(),
});

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  options: cartItemOptionsSchema,
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Le nom est trop court").max(120),
  customerPhone: z
    .string()
    .trim()
    .regex(/^0[5-7][0-9]{8}$/, "Numéro de téléphone algérien invalide (ex: 0551223344)"),
  wilaya: z.string().min(1, "Sélectionnez votre wilaya"),
  commune: z.string().trim().min(1, "La commune est requise").max(120),
  address: z.string().trim().min(5, "L'adresse est trop courte").max(300),
  deliveryInstructions: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(500).optional(),
  items: z.array(orderItemInputSchema).min(1, "Votre panier est vide"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const customRequestSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().regex(/^0[5-7][0-9]{8}$/, "Numéro de téléphone invalide"),
  wilaya: z.string().min(1),
  commune: z.string().trim().min(1).max(120),
  address: z.string().trim().min(5).max(300),
  creationType: z.enum([
    "amigurumi",
    "poupee",
    "personnage",
    "bouquet",
    "sac",
    "porte_cles",
    "decoration",
    "cadeau",
    "autre",
  ]),
  description: z.string().trim().min(10, "Décrivez votre idée un peu plus précisément").max(2000),
  colors: z.array(z.string().max(60)).max(10),
  size: z.enum(["petit", "moyen", "grand", "personnalise"]),
  customDimensions: z.string().trim().max(200).optional(),
  quantity: z.number().int().min(1).max(50),
  occasion: z.enum([
    "anniversaire",
    "mariage",
    "cadeau",
    "naissance",
    "saint_valentin",
    "decoration",
    "autre",
  ]),
  desiredDate: z.string().optional(),
  budget: z.number().nonnegative().optional(),
  notes: z.string().trim().max(1000).optional(),
  imageUrls: z.array(z.string().url()).max(10),
});

export type CustomRequestInput = z.infer<typeof customRequestSchema>;
