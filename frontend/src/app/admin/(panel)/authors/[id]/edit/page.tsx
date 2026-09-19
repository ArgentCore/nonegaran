import { notFound } from "next/navigation"
import AuthorForm from "@/components/admin/AuthorForm"
import { adminGetAuthorById } from "@/lib/data/admin/authors"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAuthorPage({ params }: PageProps) {
  const { id } = await params
  const author = await adminGetAuthorById(id)

  if (!author) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">ویرایش نویسنده</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{author.name}</p>
      </header>

      <AuthorForm
        mode="edit"
        authorId={author.id}
        initial={{
          name: author.name,
          slug: author.slug,
          bio: author.bio ?? "",
          avatar: author.avatar ?? "",
        }}
      />
    </div>
  )
}