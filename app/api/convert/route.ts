import fs from "fs";
import util from "util";
const execFile = require("child_process").execFile;
import natural from "natural";

import { GetFileURL, GetFileRaw } from "@/app/file/[id]/page";
import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ message: `file doesn't exist`, success: false });

  const f = await pb.collection("files").getOne(id);
  const name = `app/public/${f.title}.mp3`;

  const fileURL = GetFileURL(id);
  const text = (await GetFileRaw((await fileURL).href)).toString();

  const res = execFile(
    "gtts-cli",
    [`${text}`, "--output", `${name}`],
    (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return NextResponse.json({ message: error.message, success: false });
      }
      if (stderr) {
        return NextResponse.json({
          message: `stderr: ${stderr}`,
          success: false,
        });
      }

      return NextResponse.json({ message: `stdout: ${stdout}`, success: true });
    }
  );

  return res;
}
