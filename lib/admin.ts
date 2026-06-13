import type { AdminPost, Category, Tag } from "@/types";

const ADMIN = "/api/admin";

/** Parse a proxy response, surfacing DRF error messages on failure. */
async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      detail =
        data.detail ||
        data.error ||
        (typeof data === "object"
          ? Object.entries(data)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
              .join(" · ")
          : detail);
    } catch {
      // keep the generic message
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

/* ---- auth ---- */

export async function login(username: string, password: string) {
  const res = await fetch(`${ADMIN}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return parse<{ username: string }>(res);
}

export async function logout() {
  await fetch(`${ADMIN}/logout`, { method: "POST" });
}

/* ---- posts ---- */

export async function listPosts(): Promise<AdminPost[]> {
  return parse(await fetch(`${ADMIN}/posts`));
}

export async function getAdminPost(id: number): Promise<AdminPost> {
  return parse(await fetch(`${ADMIN}/posts/${id}`));
}

export async function savePost(
  payload: FormData | Record<string, unknown>,
  id?: number,
): Promise<AdminPost> {
  const isForm = payload instanceof FormData;
  const res = await fetch(id ? `${ADMIN}/posts/${id}` : `${ADMIN}/posts`, {
    method: id ? "PATCH" : "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? payload : JSON.stringify(payload),
  });
  return parse(res);
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${ADMIN}/posts/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) await parse(res);
}

/* ---- taxonomy ---- */

export async function listCategories(): Promise<Category[]> {
  return parse(await fetch(`${ADMIN}/categories`));
}

export async function createCategory(name: string): Promise<Category> {
  return parse(
    await fetch(`${ADMIN}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),
  );
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${ADMIN}/categories/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) await parse(res);
}

export async function listTags(): Promise<Tag[]> {
  return parse(await fetch(`${ADMIN}/tags`));
}

export async function createTag(name: string): Promise<Tag> {
  return parse(
    await fetch(`${ADMIN}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),
  );
}

export async function deleteTag(id: number): Promise<void> {
  const res = await fetch(`${ADMIN}/tags/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) await parse(res);
}
