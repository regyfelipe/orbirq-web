import Header from "@/shared/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-screen flex-col">
      <Header />
      <main className="flex-1 w-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
