"use client";
import React from "react";
import {
  ArrowRightIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import { useToast } from "./ui/use-toast";
import PocketBase, { RecordModel } from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090");

export default function WordToolbar({
  word,
  children,
}: {
  word: string;
  children: React.ReactElement;
}) {
  const [saved, setSaved] = React.useState(false);
  React.useEffect(() => {
    async function fetchWord() {
      try {
        const record = await pb
          .collection("saved_words")
          .getFirstListItem(`word="${word.toLocaleLowerCase()}"`);

        if (record.word) setSaved(true);
      } catch {
        setSaved(false);
      }
    }
    fetchWord();
  }, [word]);

  if (!word.trim()) {
    return (
      <div className="mx-2 flex-shrink-0">
        <ArrowRightIcon className="stroke-icon stroke-[0.5] rounded-sm transition hover:bg-slate-400/50 hover:stroke-[1.5] h-4 w-4 mt-[7px] "></ArrowRightIcon>
      </div>
    );
  }

  return (
    <div className="mx-2 flex-shrink-0 space-y-4 rounded-sm bg-slate-400/50 p-2">
      {children}
      <ArrowRightIcon className="stroke-icon stroke-[0.5] rounded-sm transition hover:bg-slate-400/50 hover:stroke-[1.5] h-4 w-4 mt-[7px] "></ArrowRightIcon>
      <SaveButton
        saved={saved}
        word={word.toLowerCase()}
        onClick={() => setSaved((s: boolean) => !s)}
      ></SaveButton>
    </div>
  );
}

function SaveButton({
  saved,
  word,
  onClick,
}: {
  saved: boolean;
  word: string;
  onClick: Function;
}) {
  const { toast } = useToast();

  return saved ? (
    <BookmarkFilledIcon
      className="stroke-icon text-icon stroke-[0.5] rounded-sm transition hover:bg-slate-400/50 hover:stroke-[1.5] h-4 w-4 mt-[7px] "
      onClick={async (e) => {
        onClick(e);

        const wordID = await pb
          .collection("saved_words")
          .getFirstListItem(`word="${word}"`)
          .then((r: RecordModel) => r.id);
        await pb.collection("saved_words").delete(wordID);
        toast({
          title: `Removed word "${word}" from your library!`,
        });
      }}
    ></BookmarkFilledIcon>
  ) : (
    <BookmarkIcon
      className="stroke-icon  stroke-[0.5] rounded-sm transition hover:bg-slate-400/50 hover:stroke-[1.5] h-4 w-4 mt-[7px] "
      onClick={async (e) => {
        onClick(e);

        await pb.collection("saved_words").create({ word: word });
        toast({
          title: `Saved word "${word}" to your library!`,
          description: `Go practice!`,
        });
      }}
    ></BookmarkIcon>
  );
}
