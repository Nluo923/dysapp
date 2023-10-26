import { NounInflector } from "natural/lib/natural/inflectors/";

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
      console.log(word + " no exist");
      throw new Error("word no exist");
    })
    .catch((error) => {
      return error;
    });

  if (res.name) {
    const attemptRoot = new NounInflector().singularize(word);
    if (attemptRoot == word) return res;
    console.log(` > ${attemptRoot}`);
    const altRes = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${attemptRoot}`
    )
      .then((res) => res.json())
      .catch((error) => {
        return error;
      });

    return Response.json(altRes);
  }

  return Response.json(res);
}
