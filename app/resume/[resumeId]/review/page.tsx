import Link from "next/link";

interface PageProps {
  params: Promise<{ resumeId: string }>;
}

export default async function ReviewPage({ params }: PageProps) {
  const { resumeId } = await params;
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Review: {resumeId}</h1>
      <p className="mb-6 text-gray-600">Review your resume before export.</p>
      <Link
        href={`/resume/${resumeId}/builder`}
        className="text-blue-600 hover:underline"
      >
        Back to Builder
      </Link>
    </main>
  );
}
