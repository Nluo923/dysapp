export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 60,
  fetchCache = "auto";

const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
import natural from "natural";
import fs from "fs";

import { GetFileURL, GetFileRaw } from "@/lib/utils";
import { NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { quote } from "@/lib/utils";

const pb = new PocketBase("http://127.0.0.1:8090");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: `file doesn't exist`, success: false });
  }

  fs.mkdir(`app/public/${id}`, { recursive: true }, (err) => {
    console.log(err);
  });

  const f = await pb.collection("files").getOne(id);
  const path = `app/public/${id}/full.mp3`;

  const fileURL = GetFileURL(id);
  const text = (await GetFileRaw((await fileURL).href)).toString();

  const res = await exec(`gtts-cli ${quote(text)} --output ${path}`);

  if (res.error)
    return NextResponse.json({ message: `${res.error}`, success: false });

  return NextResponse.json({ message: `${res.stdout}`, success: true });
}
