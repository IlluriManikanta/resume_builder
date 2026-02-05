import type { Resume } from "@/lib/resume/schema";
import { AtsTemplateV1 } from "./AtsTemplateV1";

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div className="h-full overflow-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <AtsTemplateV1 resume={resume} />
    </div>
  );
}
