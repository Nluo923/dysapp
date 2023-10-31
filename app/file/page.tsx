export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto";

import { FileUpload } from "@/components/file-upload";
import dy from "next/dynamic";
// import { FileList } from "@/components/file-list";
const FileList = dy(() => import("@/components/file-list"), { ssr: false });

export default function FilePage() {
  return (
    <>
      <FileUpload></FileUpload>
      <FileList></FileList>
    </>
  );
}
