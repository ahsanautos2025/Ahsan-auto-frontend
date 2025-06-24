import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mt-28">
        {children}
      </main>
      <Footer />
    </div>
  )
}
