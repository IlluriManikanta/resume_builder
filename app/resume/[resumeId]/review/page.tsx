import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { resumeSchema } from "@/lib/resume/schema";
import { scoreResume, topRecommendations } from "@/lib/resume/scoring";

interface PageProps {
  params: Promise<{ resumeId: string }>;
}

export default async function ReviewPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) return null;

  const { resumeId } = await params;
  const row = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
  const raw = row?.data ?? null;
  const parsed = raw ? resumeSchema.safeParse(raw) : null;
  const resume = parsed?.success ? parsed.data : null;

  const scoreResult = resume
    ? scoreResume(resume)
    : { overall: 0, recommendations: [] };
  const topRecs = topRecommendations(scoreResult, 3);

  return (
    <main className="min-h-screen p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Review: {resumeId}</h1>
      <p className="mb-6 text-gray-600">Review your resume before export.</p>

      {!resume ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 mb-6">
          <p className="font-medium">Resume not found</p>
          <p className="text-sm mt-1">
            Save your resume in the builder first, then return here to see your score.
          </p>
        </div>
      ) : (
        <>
          {/* Score 0–100 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Resume score
            </h2>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold ${
                  scoreResult.overall >= 70
                    ? "text-green-600"
                    : scoreResult.overall >= 50
                      ? "text-amber-600"
                      : "text-red-600"
                }`}
              >
                {scoreResult.overall}
              </span>
              <span className="text-gray-500">/ 100</span>
            </div>
          </section>

          {/* Top 3 recommendations */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Top recommendations
            </h2>
            {topRecs.length === 0 ? (
              <p className="text-gray-600">
                No specific recommendations. Your resume looks strong.
              </p>
            ) : (
              <ul className="space-y-3">
                {topRecs.map((rec, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {rec.area}
                      </span>
                      <p className="mt-0.5 text-gray-800">{rec.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <Link
        href={`/resume/${resumeId}/builder`}
        className="text-blue-600 hover:underline"
      >
        Back to Builder
      </Link>
    </main>
  );
}
