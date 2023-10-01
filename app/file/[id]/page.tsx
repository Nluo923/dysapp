export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto";

import { FileView } from "@/components/file-view";
import { GetFileURL, GetFileRaw } from "@/lib/utils";

import PocketBase from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090");

export default async function FilePage({ params }: { params: { id: string } }) {
  const f = (await GetFileRaw((await GetFileURL(params.id)).href)).toString();

  return (
    <div>
      <FileView text={f}></FileView>
    </div>
  );
}
