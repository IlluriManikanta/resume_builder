import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Last updated: {new Date().toISOString().slice(0, 10)}
      </p>

      <section className="space-y-4 text-gray-800">
        <h2 className="text-lg font-semibold text-gray-900">Your data</h2>
        <p>
          Resume data you create and save (contact info, experience, education,
          skills, and other content you enter) is stored in our database
          associated with your account. We use it only to provide the service:
          editing, saving, scoring, and exporting your resume.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">We do not sell your data</h2>
        <p>
          We do not sell your resume data or personal information to third
          parties. Your data is not used for advertising or shared with
          advertisers.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">Authentication</h2>
        <p>
          Sign-in is handled by Clerk. We receive a user identifier from Clerk
          to associate your resumes with your account. See Clerk’s privacy
          policy for their practices.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">AI and third-party services</h2>
        <p>
          If you use the AI bullet improvement feature, the text you submit is
          sent to OpenAI to generate suggestions. PDF export is generated on our
          servers. We do not use your data to train third-party models beyond
          what the provider’s terms specify.
        </p>
      </section>

      <p className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
