export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto";

import { FileUpload } from "@/components/file-upload";
import { Separator } from "@/components/ui/separator";
import { FileList } from "@/components/file-list";

export default function FilePage() {
  return (
    <>
      <FileUpload></FileUpload>
      <FileList></FileList>
    </>
  );
}
