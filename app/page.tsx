import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Resume Builder</h1>
      <p className="mb-6 text-gray-600">Create and edit your resume.</p>
      <div className="flex flex-col gap-2">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Go to Dashboard
        </Link>
        <Link href="/privacy" className="text-gray-500 hover:underline text-sm">
          Privacy
        </Link>
      </div>
    </main>
  );
}
