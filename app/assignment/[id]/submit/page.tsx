import { AssignmentSubmission } from "@/components/assignment-submission"

export default function SubmitAssignmentPage({ params }: { params: { id: string } }) {
  return <AssignmentSubmission assignmentId={params.id} />
}
