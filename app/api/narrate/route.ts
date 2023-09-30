export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto";

import fs from "fs";
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

import { GetFileURL, GetFileRaw } from "@/app/file/[id]/page";
import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");
  // const text = encodeURIComponent(
  //   "this is the text you gotta read. never again should Sam's bone be on the floor."
  // );

  if (!text)
    return NextResponse.json({ message: `no text received`, success: false });

  //console.log(text);
  const run = `gtts-cli '${text}'`;

  const res = await exec(run, (error: any, stdout: any, stderr: any) => {
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

    return NextResponse.json({ message: `out: ${stdout}`, success: true });
  });

  return res;
}
