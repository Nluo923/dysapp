import { NounInflector } from "natural/lib/natural/inflectors/";
import { NextResponse } from "next/server";
import { key } from "@/lib/API_KEY";

export async function GET(request: Request) {
  const word = new URL(request.url).searchParams.get("word") ?? "apple";

  const res = await fetch(
    `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${key}`
  )
    .then((res) => res.json())
    .then((res) => {
      if (!res[0].meta) throw new Error("Word wasn't found");

      return { res, status: 200 };
    })
    .catch((error) => {
      console.log(error);
      return { error, status: 404 };
    });

  return NextResponse.json(res);
}

// export async function GET(request: Request) {
//   const word = new URL(request.url).searchParams.get("word") ?? "apple";
//   let fallbackPhonetics = "";
//   const res = await fetch(
//     `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
//   )
//     .then((res) => res.json())
//     .then((res) => {
//       if (
//         !res.title &&
//         ((res[0].phonetics && res[0].phonetics.length != 0) || res[0].phonetic)
//       ) {
//         return res;
//       }
//       // console.log(word + " no exist");
//       throw new Error("word no exist");
//     })
//     .catch((error) => {
//       console.log(error);
//       return error;
//     });

//   // console.log(res);
//   if (res.name) {
//     const attemptRoot = new NounInflector().singularize(word);
//     if (attemptRoot == word) return res;
//     console.log(` > ${attemptRoot}`);
//     const altRes = await fetch(
//       `https://api.dictionaryapi.dev/api/v2/entries/en/${attemptRoot}`
//     )
//       .then((res) => {
//         return res.json();
//       })
//       .then((res) => {
//         if (
//           res &&
//           ((res[0].phonetics && res[0].phonetics.length != 0) ||
//             res[0].phonetic)
//         ) {
//           return res;
//         }
//         // console.log(word + " no exist 2");
//         throw new Error("word no exist 2");
//       })
//       .catch((error) => {
//         console.log(res);
//         return res;
//       });

//     return NextResponse.json(altRes);
//   }

//   return NextResponse.json(res);
// }
