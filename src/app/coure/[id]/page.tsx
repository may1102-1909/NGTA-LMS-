import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function CoureDetailPageRedirect({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const id = resolved?.id || "";
  redirect(`/courses/${id}`);
}
