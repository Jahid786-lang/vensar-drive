import { FileExplorer } from "@/components/documnets/FileExplorer";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <FileExplorer />
    </DashboardLayout>
  )
}