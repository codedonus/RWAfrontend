import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-semibold mb-4">404 Not Found</h1>
        <p className="text-base md:text-lg text-gray-600 mb-8">
          You entered a place with nothing.
        </p>
        <Link href="/"  className="bg-blue-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-600">
            Back to Home
        </Link>
      </div>
    </div>
  )
}