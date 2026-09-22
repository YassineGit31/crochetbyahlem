import { StoreSettings } from "@/types";

export const WILAYAS: string[] = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
  "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla",
  "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun",
  "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah",
  "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];

export const DEFAULT_SETTINGS: StoreSettings = {
  business_name: "Crochet by Ahlem",
  instagram_username: "crochetbyahlem",
  whatsapp_number: "213500000000",
  facebook_url: null,
  tiktok_url: null,
  business_description:
    "Des créations faites à la main, imaginées avec amour et réalisées spécialement pour vous.",
  default_production_days: 7,
  custom_production_days: 20,
  currency: "DA",
  free_delivery_threshold: 8000,
};

export const CREATION_TYPE_OPTIONS = [
  { value: "amigurumi", label: "Amigurumi" },
  { value: "poupee", label: "Poupée" },
  { value: "personnage", label: "Personnage" },
  { value: "bouquet", label: "Bouquet" },
  { value: "sac", label: "Sac" },
  { value: "porte_cles", label: "Porte-clés" },
  { value: "decoration", label: "Décoration" },
  { value: "cadeau", label: "Cadeau" },
  { value: "autre", label: "Autre" },
] as const;

export const OCCASION_OPTIONS = [
  { value: "anniversaire", label: "Anniversaire" },
  { value: "mariage", label: "Mariage" },
  { value: "cadeau", label: "Cadeau" },
  { value: "naissance", label: "Naissance" },
  { value: "saint_valentin", label: "Saint-Valentin" },
  { value: "decoration", label: "Décoration" },
  { value: "autre", label: "Autre" },
] as const;

export const SIZE_OPTIONS = [
  { value: "petit", label: "Petit" },
  { value: "moyen", label: "Moyen" },
  { value: "grand", label: "Grand" },
  { value: "personnalise", label: "Personnalisé" },
] as const;

export const COMMON_COLORS = [
  "Rose", "Blanc", "Beige", "Noir", "Rouge", "Bordeaux", "Marron",
  "Bleu ciel", "Bleu marine", "Vert sauge", "Jaune moutarde", "Lavande", "Gris",
];

export const MAX_INSPIRATION_IMAGES = 8;
export const MAX_IMAGE_SIZE_MB = 5;
