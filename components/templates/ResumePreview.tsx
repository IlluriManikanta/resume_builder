import type { Resume } from "@/lib/resume/schema";
import { AtsTemplateV1 } from "./AtsTemplateV1";

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div className="h-full overflow-auto bg-gray-100">
      {/* Letter-size page: 8.5" x 11" with 0.5" margins */}
      <div className="min-h-[11in] w-full max-w-[8.5in] mx-auto px-[0.5in] py-[0.5in] bg-white shadow-md border border-gray-200 print:shadow-none print:border-0 print:bg-white">
        <AtsTemplateV1 resume={resume} />
      </div>
    </div>
  );
}
