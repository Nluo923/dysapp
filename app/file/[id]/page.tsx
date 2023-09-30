export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto";

import { FileView } from "@/components/file-view";

import PocketBase from "pocketbase";
const util = require("util");
const fs = require("fs");

const pb = new PocketBase("http://127.0.0.1:8090");

export async function GetFileURL(id: string) {
  const res = await pb.collection("files").getOne(id);
  const url = new URL(pb.files.getUrl(res, res.file));

  //console.log(res);
  console.log(url.href);

  return url;
}

export async function GetFileRaw(path: string): Promise<String> {
  const res = await fetch(path)
    .then((res) => {
      if (!res.ok)
        throw new Error(
          "Failed with code " + res.status + ", " + res.statusText
        );
      return res;
    })
    .then((res) => res.text())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  return res;
}

export default async function FilePage({ params }: { params: { id: string } }) {
  const f = (await GetFileRaw((await GetFileURL(params.id)).href)).toString();

  return (
    <div>
      {/* <p className="whitespace-pre-line">{f}</p> */}
      <FileView text={f}></FileView>
    </div>
  );
}
