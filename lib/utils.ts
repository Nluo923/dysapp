import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import PocketBase from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(a: number, b = 2) {
  if (!+a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
    ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"][d]
  }`;
}

export function quote(s: string) {
  if (s === "") return `''`;
  if (!/[^%+,-.\/:=@_0-9A-Za-z]/.test(s)) return s;
  return `"` + s.replace(/'/g, `'`) + `"`;
}

export async function GetFileURL(id: string) {
  const res = await pb.collection("files").getOne(id);
  const url = new URL(pb.files.getUrl(res, res.file));
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
