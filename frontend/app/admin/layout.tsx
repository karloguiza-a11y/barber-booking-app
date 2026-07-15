export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark-primary">
      {/* Sidebar will be added here */}
      <div className="flex-1 flex flex-col">
        {/* Header will be added here */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
