import { ClassroomDetail } from "@/components/classroom-detail"

export default function ClassroomPage({ params }: { params: { id: string } }) {
  return <ClassroomDetail classroomId={params.id} />
}
