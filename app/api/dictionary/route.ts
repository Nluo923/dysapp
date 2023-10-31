import { NounInflector } from "natural/lib/natural/inflectors/";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const word = new URL(request.url).searchParams.get("word") ?? "apple";
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  )
    .then((res) => res.json())
    .then((res) => {
      if (
        !res.title &&
        ((res[0].phonetics && res[0].phonetics.length != 0) || res[0].phonetic)
      ) {
        return res;
      }
      // console.log(word + " no exist");
      throw new Error("word no exist");
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  // console.log(res);
  if (res.name) {
    const attemptRoot = new NounInflector().singularize(word);
    if (attemptRoot == word) return res;
    console.log(` > ${attemptRoot}`);
    const altRes = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${attemptRoot}`
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (
          res &&
          ((res[0].phonetics && res[0].phonetics.length != 0) ||
            res[0].phonetic)
        ) {
          return res;
        }
        // console.log(word + " no exist 2");
        throw new Error("word no exist 2");
      })
      .catch((error) => {
        console.log(res);
        return res;
      });

    return NextResponse.json(altRes);
  }

  return NextResponse.json(res);
}
