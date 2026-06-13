"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
  listCategories,
  listTags,
} from "@/lib/admin";
import type { Category, Tag } from "@/types";

type Kind = "category" | "tag";

const api = {
  category: { list: listCategories, create: createCategory, remove: deleteCategory },
  tag: { list: listTags, create: createTag, remove: deleteTag },
};

export function TaxonomyManager({ kind }: { kind: Kind }) {
  const a = api[kind];
  const label = kind === "category" ? "Categories" : "Tags";
  const singular = kind === "category" ? "category" : "tag";

  const [items, setItems] = useState<(Category | Tag)[] | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = kind === "category" ? listCategories : listTags;
    load()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load."));
  }, [kind]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const created = await a.create(name.trim());
      setItems((prev) => [...(prev ?? []), created]);
      setName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm(`Delete this ${singular}? Posts will keep their content.`))
      return;
    try {
      await a.remove(id);
      setItems((prev) => (prev ?? []).filter((i) => i.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-normal text-text">{label}</h1>

      <form onSubmit={add} className="mt-8 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`New ${singular}…`}
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 font-body text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-text px-4 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {error && <p className="mt-4 font-body text-sm text-red-400">{error}</p>}

      {!items && !error && (
        <p className="mt-8 font-mono text-xs text-muted">Loading…</p>
      )}

      {items && items.length === 0 && (
        <p className="mt-8 font-body text-base text-muted">
          No {label.toLowerCase()} yet.
        </p>
      )}

      {items && items.length > 0 && (
        <ul className="mt-8">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 border-t border-border py-3 last:border-b"
            >
              <div>
                <span className="font-body text-sm text-text">{item.name}</span>
                <span className="ml-3 font-mono text-xs text-muted">
                  {item.slug}
                </span>
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Delete ${item.name}`}
                className="text-muted transition-colors hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
