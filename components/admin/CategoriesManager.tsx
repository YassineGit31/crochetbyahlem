"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { slugify, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { createCategory, updateCategory, deleteCategory } from "@/services/categories";
import { ImageUploader } from "./ImageUploader";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | "new" | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette catégorie ? Les produits associés resteront mais sans catégorie.")) return;
    await deleteCategory(id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Catégories</h1>
          <p className="text-sm text-ink-light mt-1">{categories.length} catégorie(s)</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Nouvelle catégorie
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-2xl border border-rose-100 bg-white p-4 flex items-center gap-3">
            {cat.image_url && (
              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-rose-50 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image_url} alt="" className="h-full w-full object-cover p-1.5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink truncate">{cat.name}</p>
              <p className="text-xs text-ink-faint">{cat.is_enabled ? "Activée" : "Désactivée"}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditing(cat)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-rose-50 text-ink-light"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CategoryModal
          category={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function CategoryModal({
  category,
  onClose,
  onSaved,
}: {
  category?: Category;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState<string[]>(category?.image_url ? [category.image_url] : []);
  const [enabled, setEnabled] = useState(category?.is_enabled ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom est requis.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name,
        slug: slugify(name),
        description: description || null,
        image_url: image[0] ?? null,
        sort_order: category?.sort_order ?? 999,
        is_enabled: enabled,
      };
      if (category) {
        await updateCategory(category.id, payload);
      } else {
        await createCategory(payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">
            {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Nom *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Description</label>
            <textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Image</label>
            <ImageUploader images={image} onChange={setImage} bucket="category-images" max={1} />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className={cn("h-4 w-4 rounded accent-rose-500")}
            />
            Catégorie activée
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
