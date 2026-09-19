import AuthorForm from "@/components/admin/AuthorForm"

export default function NewAuthorPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">افزودن نویسنده</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          نویسنده یا مترجم جدید ثبت کنید
        </p>
      </header>

      <AuthorForm
        mode="create"
        initial={{ name: "", slug: "", bio: "", avatar: "" }}
      />
    </div>
  )
}