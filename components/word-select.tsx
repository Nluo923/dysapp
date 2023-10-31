"use client";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import { WordDefinition } from "./word-definition";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import WordToolbar from "./word-toolbar";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

export default function WordDisplay({ savedWords }: { savedWords: string[] }) {
  const [word, setWord] = React.useState("");

  return (
    <>
      <div className="flex">
        <WordSelect
          words={savedWords}
          onWordChange={setWord}
          className="mb-4 h-auto space-y-4 basis-1/4"
        ></WordSelect>
        <Separator orientation="vertical"></Separator>
        <div className="flex-col w-[60%] justify-center mx-auto px-16 basis-3/5">
          {word && word != "" ? (
            <div className="container flex border border-solid border-muted rounded-sm w-auto min-w-full py-4 px-2 min-h-[40%]">
              <WordToolbar word={word}>
                <></>
              </WordToolbar>
              <WordDefinition word={word}></WordDefinition>
            </div>
          ) : (
            <span className="text-muted">Select a word</span>
          )}
          <Separator className="my-4"></Separator>
          <div className="">
            <Label className="text-accent-foreground">
              Here&apos;s generated text explaining the words in your library:{" "}
            </Label>
            <blockquote className="text-sm text-muted-foreground prose-invert">
              In the intricate dance of life, the process of{" "}
              <strong>photosynthesis</strong> unfolds within the chloroplasts of
              plant cells, orchestrating the synthesis of{" "}
              <strong>carbohydrates</strong> from sunlight, water, and carbon
              dioxide. This remarkable biochemical ballet involves the{" "}
              <strong>diffusion</strong> of <strong>elements</strong>, such as
              carbon and oxygen, through the cellular membranes.{" "}
              <strong>Photosynthesis</strong>, a pivotal{" "}
              <strong>endothermic</strong> reaction, requires the energy
              harnessed from sunlight to fuel the conversion of carbon dioxide
              and water into glucose—a vital <strong>carbohydrate</strong>.{" "}
              <strong>Enzymes</strong> act as molecular choreographers,
              facilitating and accelerating these intricate biochemical
              reactions. Amidst this symphony, <strong>fructose</strong>, a
              simple sugar, emerges as one of the essential products, providing
              sustenance for the <strong>organism</strong>. The beauty of this
              metabolic masterpiece lies in the harmonious collaboration of{" "}
              <strong>elements</strong>, the choreography of{" "}
              <strong>enzymes</strong>, and the transformative power of{" "}
              <strong>endothermic</strong> reactions, ultimately sustaining
              life&apos;s delicate balance.
            </blockquote>
          </div>
        </div>
      </div>
    </>
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
