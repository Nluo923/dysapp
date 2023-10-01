export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "force-no-store";

const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

import { NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { quote } from "@/lib/utils";

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

  let res;

  try {
    res = await exec(`gtts-cli ${quote(text)}`);
  } catch (error) {
    return NextResponse.json({ message: `${error}`, success: false });
  }

  return NextResponse.json({
    message: "it worked",
    audio: `${res.stdout}`,
    success: true,
  });
}
