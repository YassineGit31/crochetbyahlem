-- =============================================================================
-- CROCHET BY AHLEM — OPTIONAL SEED DATA
-- =============================================================================
-- Run this AFTER supabase/schema.sql if you'd like your new Supabase project
-- to start with the same sample catalog used in demo mode, instead of an
-- empty storefront. Entirely optional — skip it and add real products
-- through /admin instead. Uses the SVG placeholders bundled in /public/demo,
-- so replace image URLs with real product photos once deployed.
-- =============================================================================

insert into categories (name, slug, description, image_url, sort_order, is_enabled) values
  ('Amigurumi', 'amigurumi', 'Petits personnages et animaux au crochet, doux et pleins de caractère.', '/demo/ours-amigurumi.svg', 1, true),
  ('Poupées', 'poupees', 'Poupées uniques, cousues et habillées à la main.', '/demo/poupee-crochet.svg', 2, true),
  ('Fleurs & Bouquets', 'fleurs-bouquets', 'Des bouquets qui ne fanent jamais.', '/demo/bouquet-fleurs.svg', 3, true),
  ('Porte-clés', 'porte-cles', 'De petites attentions à offrir ou s''offrir.', '/demo/porte-cles-coeur.svg', 4, true),
  ('Sacs', 'sacs', 'Sacs et accessoires tissés main.', '/demo/sac-crochet.svg', 5, true),
  ('Décoration', 'decoration', 'Pour une maison plus douce.', '/demo/panier-decoration.svg', 6, true),
  ('Cadeaux', 'cadeaux', 'Des idées cadeaux faites avec amour.', '/demo/cadeau-etoile.svg', 7, true)
on conflict (slug) do nothing;

insert into products (
  slug, name, description, price, category_id, main_image_url, colors, sizes,
  stock_status, is_available, is_featured, is_customizable, production_time_days, sort_order
)
select
  'ourson-crochet-rose', 'Ourson au crochet',
  'Un petit ourson amigurumi tissé au crochet fil par fil, parfait pour accompagner un cadeau ou trôner sur une étagère.',
  2500, (select id from categories where slug = 'amigurumi'), '/demo/ours-amigurumi.svg',
  array['Rose', 'Beige', 'Blanc'], array[]::text[], 'en_stock', true, true, true, 7, 1
where not exists (select 1 from products where slug = 'ourson-crochet-rose');

insert into products (
  slug, name, description, price, category_id, main_image_url, colors, sizes,
  stock_status, is_available, is_featured, is_customizable, production_time_days, sort_order
)
select
  'bouquet-eternel-rose-ivoire', 'Bouquet éternel rose & ivoire',
  'Un bouquet de fleurs au crochet qui ne fane jamais, composé à la main.',
  4000, (select id from categories where slug = 'fleurs-bouquets'), '/demo/bouquet-fleurs.svg',
  array['Rose', 'Blanc/Rose', 'Bordeaux'], array[]::text[], 'sur_commande', true, true, true, 10, 2
where not exists (select 1 from products where slug = 'bouquet-eternel-rose-ivoire');

insert into products (
  slug, name, description, price, category_id, main_image_url, colors, sizes,
  stock_status, is_available, is_featured, is_customizable, production_time_days, sort_order
)
select
  'porte-cle-coeur', 'Porte-clés cœur',
  'Un petit cœur au crochet à accrocher à son sac ou ses clés.',
  900, (select id from categories where slug = 'porte-cles'), '/demo/porte-cles-coeur.svg',
  array['Rose', 'Rouge', 'Beige', 'Noir'], array[]::text[], 'en_stock', true, true, false, 3, 3
where not exists (select 1 from products where slug = 'porte-cle-coeur');

insert into products (
  slug, name, description, price, category_id, main_image_url, colors, sizes,
  stock_status, is_available, is_featured, is_customizable, production_time_days, sort_order
)
select
  'poupee-personnalisee', 'Poupée sur-mesure',
  'Une poupée unique, dessinée et réalisée selon vos envies : couleur de cheveux, tenue, accessoires.',
  6500, (select id from categories where slug = 'poupees'), '/demo/poupee-crochet.svg',
  array['Brune', 'Blonde', 'Rousse'], array['Petit', 'Moyen', 'Grand'], 'sur_commande', true, true, true, 20, 4
where not exists (select 1 from products where slug = 'poupee-personnalisee');

insert into products (
  slug, name, description, price, category_id, main_image_url, colors, sizes,
  stock_status, is_available, is_featured, is_customizable, production_time_days, sort_order
)
select
  'sac-tote-crochet', 'Sac tote en crochet',
  'Un sac tote tissé main, résistant et léger, doublé en coton.',
  5200, (select id from categories where slug = 'sacs'), '/demo/sac-crochet.svg',
  array['Beige', 'Rose poudré', 'Écru'], array[]::text[], 'en_stock', true, false, true, 12, 5
where not exists (select 1 from products where slug = 'sac-tote-crochet');

insert into products (
  slug, name, description, price, category_id, main_image_url, colors, sizes,
  stock_status, is_available, is_featured, is_customizable, production_time_days, sort_order
)
select
  'panier-fleuri-decoratif', 'Panier fleuri décoratif',
  'Un petit panier au crochet garni de fleurs, pour habiller une étagère ou une table d''entrée.',
  3200, (select id from categories where slug = 'decoration'), '/demo/panier-decoration.svg',
  array['Rose/Ivoire'], array[]::text[], 'en_stock', true, false, false, 8, 6
where not exists (select 1 from products where slug = 'panier-fleuri-decoratif');

insert into delivery_zones (wilaya, fee, is_enabled) values
  ('Alger', 400, true),
  ('Oran', 500, true),
  ('Mostaganem', 450, true),
  ('Constantine', 600, true),
  ('Blida', 450, true),
  ('Tlemcen', 550, true),
  ('Sétif', 600, true),
  ('Annaba', 650, true)
on conflict (wilaya) do nothing;

update settings set
  business_name = 'Crochet by Ahlem',
  instagram_username = 'crochetbyahlem',
  business_description = 'Des créations faites à la main, imaginées avec amour et réalisées spécialement pour vous.',
  default_production_days = 7,
  custom_production_days = 20,
  currency = 'DA',
  free_delivery_threshold = 8000
where id = 1;
