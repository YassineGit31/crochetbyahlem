# Crochet by Ahlem

Boutique en ligne et système de commande complet pour Crochet by Ahlem —
créations crochetées à la main. Next.js 16 (App Router) + TypeScript +
Tailwind CSS v4 + Supabase.

---

## 1. Démarrage rapide (mode démo, sans configuration)

Le site fonctionne **dès le premier lancement, sans aucune configuration**,
grâce à un jeu de données de démonstration (catalogue, commandes, demandes
personnalisées) qui remplace Supabase tant qu'il n'est pas connecté.

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

- Boutique, panier, checkout, page de personnalisation : **100% fonctionnels**,
  les commandes/demandes créées restent visibles dans l'admin pendant la
  session (elles sont stockées en mémoire côté serveur — voir §6).
- Admin : allez sur `/admin`, mot de passe **`ahlem-demo`** par défaut
  (modifiable via `DEMO_ADMIN_PASSWORD` dans `.env.local`).

Ce mode démo est fait pour **explorer et valider le site rapidement**. Pour
un vrai lancement commercial avec des données permanentes, connectez
Supabase (§2).

---

## 2. Passer en production avec Supabase

### 2.1 Créer le projet

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécutez dans l'ordre :
   - `supabase/schema.sql` — toutes les tables, fonctions et policies RLS.
   - `supabase/seed.sql` *(optionnel)* — remplit le catalogue avec les
     produits de démonstration, pour ne pas partir d'une boutique vide.
3. Dans **Authentication > Users**, créez le compte d'Ahlem (email + mot de
   passe).
4. Toujours dans le SQL Editor, transformez ce compte en administrateur :

   ```sql
   insert into admins (user_id, name)
   select id, 'Ahlem' from auth.users where email = 'ahlem@example.com';
   ```

### 2.2 Variables d'environnement

Copiez `.env.example` vers `.env.local` et remplissez, depuis
**Project Settings > API** dans Supabase :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   #⚠️ secret, jamais exposé au navigateur
```

Dès que ces trois variables sont présentes, **tout le site bascule
automatiquement en mode production** : plus de données de démo, les
commandes/produits/demandes sont écrits et lus depuis votre base Postgres,
et la connexion admin utilise Supabase Auth au lieu du mot de passe démo.

Redémarrez le serveur après avoir modifié `.env.local`.

### 2.3 Déployer

Le projet est un site Next.js standard, déployable sur
[Vercel](https://vercel.com) (recommandé) :

```bash
git init && git add -A && git commit -m "Crochet by Ahlem"
```

Poussez sur GitHub puis importez le repo sur Vercel, en ajoutant les mêmes
variables d'environnement dans les réglages du projet Vercel.

---

## 3. Photos des produits

Aucune capture d'écran Instagram n'a été fournie pendant la génération de ce
projet — les visuels des produits utilisent des **illustrations SVG
génériques** (`/public/demo/*.svg`) dans le même esprit que la charte
(rose/crème), à remplacer par de vraies photos :

- En mode démo : remplacez les fichiers dans `public/demo/`.
- En production : ajoutez/modifiez les images directement depuis
  `/admin/produits` (glisser-déposer, hébergé sur Supabase Storage).

---

## 4. Numéro WhatsApp & réseaux sociaux

Tout se configure à un seul endroit : `/admin/parametres`. Le numéro
WhatsApp y est stocké en base (table `settings`) et jamais codé en dur —
tous les liens `wa.me` du site (page produit, panier, confirmations,
bouton flottant mobile) le lisent depuis là.

Format attendu : international, sans le `+` (ex. `213555112233`).

### WhatsApp Business Cloud API (optionnel)

Par défaut, le site ouvre WhatsApp via un lien `wa.me` pré-rempli — ça
fonctionne sans aucune configuration. Si vous configurez
`WHATSAPP_CLOUD_API_TOKEN` et `WHATSAPP_CLOUD_API_PHONE_NUMBER_ID` (voir
`.env.example`), le serveur tentera **en plus** d'envoyer automatiquement au
numéro de la boutique un message WhatsApp contenant le texte structuré et
les vraies images (pas juste des liens) dès qu'une demande personnalisée
est soumise — voir `lib/whatsapp-cloud.ts`. Cet envoi est toujours
best-effort : s'il échoue ou n'est pas configuré, rien ne casse, le lien
`wa.me` reste disponible sur la page de confirmation.

---

## 5. Structure du projet

```
app/                     Pages (App Router)
  (site public)/          accueil, /creations, /personnalise, /commande...
  admin/(dashboard)/       tableau de bord, produits, commandes, clients...
  admin/login/             connexion admin (hors du groupe protégé)
  api/                     routes serveur (commandes, demandes, admin auth)
components/
  ui/                      boutons, badges, primitives partagées
  layout/                  navbar, footer, panier, nav mobile
  home/ shop/ checkout/ custom-order/   sections du site public
  admin/                   composants du tableau de bord
lib/
  supabase/                clients Supabase (browser/serveur/admin)
  store/                   panier (Zustand + localStorage)
  whatsapp.ts              génération des messages WhatsApp structurés
  whatsapp-cloud.ts         intégration optionnelle Cloud API (serveur)
  demo-store.ts            données de démo persistées en mémoire
  validations.ts           schémas Zod (checkout, commande personnalisée)
services/                  accès aux données (Supabase ↔ démo, au même endroit)
types/                     types TypeScript du domaine
supabase/
  schema.sql               tables + RLS + fonctions
  seed.sql                 catalogue de démonstration (optionnel)
```

### Principe clé : une seule couche de données, deux sources

Chaque fichier de `services/` expose les mêmes fonctions
(`getProducts`, `createOrder`, `updateOrderStatus`, ...) et choisit en
interne, via `isSupabaseConfigured()`, s'il lit/écrit dans Supabase ou dans
le magasin de démo. **Les composants et pages n'ont jamais à savoir dans
quel mode ils tournent.**

---

## 6. Mode démo — ce qu'il faut savoir

- Les commandes, demandes personnalisées, produits, catégories, zones de
  livraison et paramètres créés/modifiés en mode démo sont gardés dans la
  mémoire du process Node (`lib/demo-store.ts`), pas dans un fichier ou une
  base de données.
- Cela veut dire qu'ils **disparaissent au redémarrage du serveur** et ne
  sont **pas partagés entre plusieurs instances** (donc pas adapté à de
  l'hébergement serverless multi-instance).
- C'est fait exprès : ce mode sert à explorer et tester le site, pas à
  vendre de vrais produits. Voir §2 pour passer en production.
- Les images ajoutées via glisser-déposer en mode démo restent en aperçu
  local (`blob:`) et ne survivent pas à un rechargement de page.

---

## 7. Sécurité

- Les prix et la disponibilité des produits sont **toujours revérifiés
  côté serveur** (`app/api/orders/route.ts`) avant l'enregistrement d'une
  commande — jamais confiance aux données envoyées par le client.
- Les tables `orders`, `order_items`, `custom_requests` et
  `custom_request_images` n'acceptent **aucune écriture publique** en
  base : tout passe par les routes `/api/*`, qui utilisent la clé
  `service_role` (jamais exposée au navigateur) après validation.
- Row Level Security est activé sur toutes les tables (`supabase/schema.sql`).
  Les clients ne peuvent jamais lire les commandes ou informations d'un
  autre client.
- Le tableau de bord `/admin` est protégé par `proxy.ts` (le middleware de
  Next.js 16) **et** par une seconde vérification d'appartenance à la table
  `admins` dans `app/admin/(dashboard)/layout.tsx`.

---

## 8. Fonctionnalités couvertes

Boutique : catalogue filtrable (catégorie, recherche, disponibilité, tri),
fiche produit avec options et personnalisation, favoris, panier persistant,
checkout avec calcul automatique des frais de livraison par wilaya,
confirmation de commande avec lien WhatsApp structuré.

Commande personnalisée : formulaire multi-étapes (inspiration → idée →
personnalisation → livraison → confirmation), upload et compression
d'images, sauvegarde de la progression en local, référence unique générée
côté serveur.

Admin : tableau de bord avec statistiques et graphique de revenu, gestion
des produits (création, édition, duplication, suppression, disponibilité),
gestion des catégories, gestion des commandes (changement de statut,
historique), gestion des demandes personnalisées (galerie d'inspiration,
statut, notes internes), base clients, zones de livraison, paramètres
généraux.

## 9. Limites connues / pistes d'amélioration

- Le paiement en ligne n'est pas implémenté (paiement à la livraison /
  convenu par WhatsApp, comme demandé dans le brief).
- Les notifications email/SMS ne sont pas branchées — l'architecture s'y
  prête (`order_status_history`) mais aucun service tiers n'a été ajouté,
  pour ne pas imposer un coût récurrent non demandé.
- Les visuels produits sont des illustrations SVG de substitution — à
  remplacer par de vraies photos (voir §3).
