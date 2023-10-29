"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

import { WordList } from "./word-list";
import { WordDefinition } from "./word-definition";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import WordToolbar from "./word-toolbar";

export default function WordDisplay({ savedWords }: { savedWords: string[] }) {
  const [word, setWord] = React.useState("");

  return (
    <div className="flex">
      <WordSelect
        words={savedWords}
        onWordChange={setWord}
        className="mb-4 mr-auto h-auto space-y-4"
      ></WordSelect>
      <Separator orientation="vertical"></Separator>
      {word && word != "" ? (
        <div className="container flex border border-solid border-muted rounded-sm w-[50%] py-4 px-2">
          <WordToolbar word={word}>
            <></>
          </WordToolbar>
          <WordDefinition word={word}></WordDefinition>
        </div>
      ) : (
        <span className="text-muted">Select a word</span>
      )}
    </div>
  );
}

export function WordSelect({
  words,
  onWordChange,
  className,
}: {
  words: string[];
  onWordChange: Function;
  className: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    console.log(value);
    onWordChange(value);
  }, [value]);

  return (
    <div className={cn(className)}>
      <Command className="w-[400px] p-0 transition-opacity">
        <CommandInput placeholder="Search for a word..." />
        <CommandEmpty>No words found.</CommandEmpty>
        <ScrollArea>
          <CommandGroup>
            {words.map((w, index) => {
              const word = w.toLowerCase();
              return (
                <CommandItem
                  key={index}
                  value={word}
                  onSelect={(currentValue) => {
                    setValue(value == currentValue ? "" : currentValue);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value == word ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {w}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </ScrollArea>
      </Command>
    </div>
  );
}
