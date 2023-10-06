export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "force-no-store";

import { FileView } from "@/components/file-view";
import { MediaPlayer } from "@/components/media-player";
import { GetFileURL, GetFileRaw } from "@/lib/utils";

import Pocketbase from "pocketbase";
const pb = new Pocketbase("http://127.0.0.1:8090");

export default async function FilePage({ params }: { params: { id: string } }) {
  const f = (await GetFileRaw((await GetFileURL(params.id)).href)).toString();

  return (
    <div>
      {/* <MediaPlayer soundID={params.id}></MediaPlayer> */}
      <FileView
        text={
          f ??
          "### The quick brown fox jumped over the dog. \n Not only was this irrelevant but he didn't care either."
        }
      ></FileView>
    </div>
  );
}
