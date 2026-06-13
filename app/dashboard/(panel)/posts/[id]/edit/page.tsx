import { notFound } from "next/navigation";
import { PostEditor } from "@/components/dashboard/PostEditor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();
  return <PostEditor postId={postId} />;
}
