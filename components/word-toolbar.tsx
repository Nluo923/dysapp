"use client";
import React from "react";
import {
  ArrowRightIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import { useToast } from "./ui/use-toast";

export default function WordToolbar({
  word,
  children,
}: {
  word: string;
  children: React.ReactElement;
}) {
  const [saved, setSaved] = React.useState(false);
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
        word={word}
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
      className="stroke-icon fill-icon stroke-[0.5] rounded-sm transition hover:bg-slate-400/50 hover:stroke-[1.5] h-4 w-4 mt-[7px] "
      onClick={(e) => {
        onClick(e);
        toast({
          title: `Removed word ${word} from your library!`,
        });
      }}
    ></BookmarkFilledIcon>
  ) : (
    <BookmarkIcon
      className="stroke-icon  stroke-[0.5] rounded-sm transition hover:bg-slate-400/50 hover:stroke-[1.5] h-4 w-4 mt-[7px] "
      onClick={(e) => {
        onClick(e);
        toast({
          title: `Saved word ${word} to your library!`,
          description: `Go practice!`,
        });
      }}
    ></BookmarkIcon>
  );
}
