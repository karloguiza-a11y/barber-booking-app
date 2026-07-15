import { Navbar } from '@/components/Navbar'
import { BookingForm } from '@/components/BookingForm'
import { Footer } from '@/components/Footer'

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary py-12">
        <div className="max-w-4xl mx-auto px-4">
          <BookingForm />
        </div>
      </div>
      <Footer />
    </>
  )
}
