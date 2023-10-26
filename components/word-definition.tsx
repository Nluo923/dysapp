"use client";

import React, { DependencyList, EffectCallback } from "react";
import { toArpabet } from "arpabet-and-ipa-convertor-ts";
import { Skeleton } from "./ui/skeleton";
import { phonemeVowelConverter, phonemeContextInfo } from "@/lib/phonemedata";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function WordDefinition({ ...props }) {
  return (
    <>
      <div className="space-y-2 px-4">
        <h1 className="text-xl font-bold">{props.word}</h1>
        <WordContext word={props.word}></WordContext>
      </div>
    </>
  );
}

function WordSkeleton({ word }: { word: string }) {
  if (!word.trim()) return false;
  return (
    <>
      <Skeleton className="h-4 w-[4em] animate-pulse"></Skeleton>
      <Skeleton className="h-4 w-[8em] animate-pulse"></Skeleton>
    </>
  );
}

function Phoneme({ text }: { text: string }) {
  const context = phonemeContextInfo.get(text.trimEnd());

  if (context) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block hover:px-[.4em] transition-all hover:text-emerald-300 hover:decoration-[3px] underline underline-offset-4 font-semibold hover:font-bold">
              {text}
            </span>
          </TooltipTrigger>

          <TooltipContent>
            <p>{phonemeContextInfo.get(text.trimEnd())}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <span>{text}</span>;
}

interface AMeaning {
  partOfSpeech: string;
  definitions: string[];
}

function Meaning({ meaning, i }: { meaning: AMeaning; i: number }) {
  return (
    <>
      <AccordionItem value={`preview${i}`}>
        <AccordionTrigger>
          <em className="text-muted-foreground">{meaning.partOfSpeech}</em>
        </AccordionTrigger>
        <AccordionContent className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-slate-500 dark:scrollbar-thumb-white scrollbar-track-transparent scrollbar-thumb-rounded-full">
          <ul className="list-disc text-xs pl-5 leading-tight space-y-1">
            {meaning.definitions.map((definition: string, i: number) => {
              // if (i > 4) return null;
              return <li key={`${i}`}>{definition}</li>;
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </>
  );
}

function WordContext({ word }: { word: string }) {
  const [loaded, setLoaded] = React.useState(false);
  const [phonetics, setPhonetics] = React.useState<string>("");
  const [meanings, setMeanings] = React.useState<string[]>([]);
  const [phonemes, setPhonemes] = React.useState<string[]>([]);
  const [audioURL, setAudioURL] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const dictionary = React.useCallback(
    (word: string) =>
      fetch(`/api/dictionary?word=${word}`)
        .then((res) => res.json())
        .then((res) => {
          let phonetics;

          setMeanings(res[0].meanings);
          phonetics = res[0].phonetic ?? res[0].phonetics;
          setPhonemes(phonetics ? phonetics.split() : "");

          phonetics = res[0].phonetics[0].text;
          for (let i = 0; res[0].phonetics[i]; i++) {
            if (res[0].phonetics[i].audio == "") continue;

            phonetics = res[0].phonetics[i].text;
            setPhonemes(phonetics.split(" "));

            setAudioURL(res[0].phonetics[i].audio);
            if ((res[0].phonetics[i].audio as string).endsWith("-us.mp3")) {
              break;
            }
          }

          console.log(phonetics);

          const stripped = phonetics
            .replaceAll(/\//g, "")
            .replaceAll("ː", "")
            .replaceAll(" ͡", "")
            .replaceAll("\u02cc", "")
            .replaceAll("\u02c8", "")
            .replaceAll("\u0252", "\u0251")
            .replaceAll("m̩", "m")
            .replaceAll(".", "");

          console.log(stripped);

          const phonemes = (toArpabet(stripped, 2) ?? stripped)
            .replaceAll(/[0-9]/g, "")
            .split(" ");

          for (let i = 0; i < phonemes.length; i++)
            phonemes[i] =
              phonemeVowelConverter.get(phonemes[i]) ??
              phonemes[i].toLocaleLowerCase();
          console.log(phonemes);
          setPhonetics(phonetics);
          setPhonemes(phonemes);
        })
        .then(() => {
          console.log(word + " passed");
          // setLoaded(true);
        })
        .catch((error) => {
          setPhonemes([word]);
          console.log(error);
        }),
    [word]
  );

  const reset = (word: string) => {
    // setPhonetics("");
    setMeanings([]);
    // setPhonemes([]);
    setAudioURL("");
    // setErrorMsg("");
    setLoaded(false);
  };

  // fetch when word changes
  React.useEffect(() => {
    if (!word.trim()) return reset("");

    reset(word);
    dictionary(word);
  }, [word]);

  React.useEffect(() => {
    setLoaded(true);
  }, [phonetics, phonemes]);

  if (loaded && word.trim()) {
    let audio = <></>;
    if (audioURL.trim()) audio = <audio controls src={audioURL}></audio>;
    return (
      <>
        <p className="text-xs text-muted-foreground">Sounds like: </p>
        <em className="text-s">
          {phonemes.map((s: string, i: number) => {
            return <Phoneme key={i} text={s}></Phoneme>;
          })}
        </em>
        {audio}
        <Accordion
          type="multiple"
          className="w-auto min-w-[80%] transition-all"
        >
          {meanings.map((meaning: any, i: number) => {
            let definitions: string[] = [];
            meaning.definitions.forEach((d: any) =>
              definitions.push(d.definition)
            );
            let m: AMeaning = {
              partOfSpeech: meaning.partOfSpeech,
              definitions: definitions,
            };

            return <Meaning meaning={m} i={i}></Meaning>;
          })}
        </Accordion>
      </>
    );
  } else {
    return <WordSkeleton word={word as string}></WordSkeleton>;
  }
}
