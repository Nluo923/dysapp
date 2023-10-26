import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import PocketBase from "pocketbase";
import React from "react";
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

export function useStateCallback<T>(
  initialState: T
): [T, (state: T, cb?: (state: T) => void) => void] {
  const [state, setState] = React.useState(initialState);
  const cbRef = React.useRef<((state: T) => void) | undefined>(undefined); // init mutable ref container for callbacks

  const setStateCallback = React.useCallback(
    (state: T, cb?: (state: T) => void) => {
      cbRef.current = cb; // store current, passed callback in ref
      setState(state);
    },
    []
  ); // keep object reference stable, exactly like `useState`

  React.useEffect(() => {
    // cb.current is `undefined` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = undefined; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

export function usePrevious<T extends unknown>(value: T): T | undefined {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
