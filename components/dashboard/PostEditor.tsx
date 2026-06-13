"use client";

import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
  deletePost,
  getAdminPost,
  listCategories,
  listTags,
  savePost,
} from "@/lib/admin";
import type { Category, Tag } from "@/types";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 font-body text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-accent";

export function PostEditor({ postId }: { postId?: number }) {
  const router = useRouter();
  const editing = postId !== undefined;

  const [loaded, setLoaded] = useState(!editing);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [file, setFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);

  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listCategories(), listTags()])
      .then(([c, t]) => {
        setCategories(c);
        setTags(t);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load taxonomy."),
      );
  }, []);

  useEffect(() => {
    if (!editing) return;
    getAdminPost(postId)
      .then((p) => {
        setTitle(p.title);
        setSlug(p.slug);
        setExcerpt(p.excerpt);
        setBody(p.body);
        setCategoryId(p.category ?? "");
        setTagIds(p.tags);
        setStatus(p.status);
        setCoverUrl(p.cover_image);
        setLoaded(true);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load post."),
      );
  }, [editing, postId]);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function toggleTag(id: number) {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  async function save(targetStatus: "draft" | "published") {
    if (!title.trim() || !excerpt.trim() || !body.trim()) {
      setError("Title, excerpt, and body are all required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        body,
        status: targetStatus,
        category: categoryId === "" ? null : categoryId,
        tags: tagIds,
      };
      if (slug.trim()) payload.slug = slug.trim();
      if (removeCover && !file) payload.cover_image = null;

      const saved = await savePost(payload, postId);

      if (file) {
        const fd = new FormData();
        fd.append("cover_image", file);
        await savePost(fd, saved.id);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
      setSaving(false);
    }
  }

  async function remove() {
    if (!editing) return;
    if (!confirm("Delete this post permanently?")) return;
    setSaving(true);
    try {
      await deletePost(postId);
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
      setSaving(false);
    }
  }

  if (!loaded) {
    return <p className="font-mono text-xs text-muted">Loading…</p>;
  }

  const showCover = !removeCover && (previewUrl || coverUrl);

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-normal text-text">
          {editing ? "Edit post" : "New post"}
        </h1>
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {status}
        </span>
      </div>

      {error && <p className="mt-6 font-body text-sm text-red-400">{error}</p>}

      <div className="mt-8 space-y-6">
        <Field label="Title">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Slug" hint="Optional — generated from the title if blank.">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto"
            className={cn(inputClass, "font-mono")}
          />
        </Field>

        <Field label="Excerpt" hint="Short summary shown in listings.">
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            maxLength={500}
            className={cn(inputClass, "resize-y")}
          />
        </Field>

        <Field label="Body" hint="Markdown.">
          <div className="mb-2 flex gap-1">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-3 py-1 font-mono text-xs uppercase tracking-[0.08em] transition-colors",
                  tab === t
                    ? "bg-surface text-text"
                    : "text-muted hover:text-text",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "write" ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={18}
              className={cn(inputClass, "resize-y font-mono leading-relaxed")}
            />
          ) : (
            <div className="post-body min-h-[12rem] rounded-md border border-border bg-surface px-4 py-3">
              {body.trim() ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug, rehypeHighlight]}
                >
                  {body}
                </ReactMarkdown>
              ) : (
                <p className="font-mono text-xs text-muted">Nothing to preview.</p>
              )}
            </div>
          )}
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Category">
            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value ? Number(e.target.value) : "")
              }
              className={inputClass}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Cover image">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setRemoveCover(false);
              }}
              className="block w-full font-body text-xs text-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-surface file:px-3 file:py-1.5 file:font-body file:text-xs file:text-text hover:file:border-accent"
            />
            {showCover && (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(previewUrl || coverUrl) as string}
                  alt="cover preview"
                  className="h-14 w-24 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setRemoveCover(true);
                  }}
                  className="font-mono text-xs text-muted transition-colors hover:text-red-400"
                >
                  remove
                </button>
              </div>
            )}
          </Field>
        </div>

        <Field label="Tags">
          {tags.length === 0 ? (
            <p className="font-mono text-xs text-muted">
              No tags yet — add some under Tags.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-[0.08em] transition-colors",
                    tagIds.includes(t.id)
                      ? "border-accent text-accent"
                      : "border-border text-muted hover:border-border-hover",
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </Field>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        {status === "published" ? (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("published")}
              className="rounded-md bg-text px-4 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              className="rounded-md border border-border px-4 py-2 font-body text-sm text-text transition-colors hover:border-border-hover disabled:opacity-50"
            >
              Unpublish
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("published")}
              className="rounded-md bg-text px-4 py-2 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Publish"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              className="rounded-md border border-border px-4 py-2 font-body text-sm text-text transition-colors hover:border-border-hover disabled:opacity-50"
            >
              Save draft
            </button>
          </>
        )}

        {editing && (
          <button
            type="button"
            disabled={saving}
            onClick={remove}
            className="ml-auto flex items-center gap-1.5 font-body text-sm text-muted transition-colors hover:text-red-400 disabled:opacity-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {label}
        </span>
        {hint && <span className="font-body text-xs text-muted">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
