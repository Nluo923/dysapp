export const dynamic = "auto",
  fetchCache = "force-no-store",
  revalidate = 0;

import Pocketbase from "pocketbase";
import WordDisplay, { WordSelect } from "@/components/word-select";
import React from "react";

const pb = new Pocketbase("http://127.0.0.1:8090");
const fetchSavedWords = async () =>
  await pb.collection("saved_words").getFullList({ sort: "-created" });

export default async function LibraryPage() {
  const records = await fetchSavedWords();

  const savedWords: string[] = [];
  records.forEach((v, i) => {
    savedWords[i] = v.word;
  });

  return <WordDisplay savedWords={savedWords}></WordDisplay>;
}
