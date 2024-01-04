"use client";

import React, { DependencyList, EffectCallback } from "react";
import { Skeleton } from "./ui/skeleton";
import {
  merriamPhoneticConverter,
  phonemeContextInfo,
  merriamConvert,
} from "@/lib/phonemedata";
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
      <div className="space-y-2 px-4 w-full">
        <h1 className="text-xl font-bold">{props.word}</h1>
        <WordContext word={props.word} key={props.word}></WordContext>
      </div>
    </>
  );
}

function WordSkeleton() {
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
  const [meanings, setMeanings] = React.useState<AMeaning>();
  const [phonemes, setPhonemes] = React.useState<string[]>([]);
  const [audioURL, setAudioURL] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const dictionary = React.useCallback(
    (word: string) =>
      fetch(`/api/dictionary?word=${word}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.status == 404) {
            return;
          }

          const word = res.res[0];
          let phonetics = word.hwi.prs[0].mw;
          setMeanings({
            partOfSpeech: word.fl,
            definitions: word.shortdef,
          });

          const audio: string = word.hwi.prs[0].sound.audio;
          // merriam weirdster
          let subdir = audio.startsWith("bix")
            ? "bix"
            : audio.startsWith("gg")
            ? "gg"
            : audio.match(/^[\d_]/)
            ? "number"
            : audio.charAt(0);

          setAudioURL(
            `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${word.hwi.prs[0].sound.audio}.mp3`
          );

          // console.log(stripped);
          let phonemes = (word.hwi.hw as string).split("*");
          try {
            // phonemes = (toArpabet(stripped, 2) ?? stripped)
            //   .replaceAll(/[0-9]/g, "")
            //   .split(" ");

            phonemes = merriamConvert(phonetics);
          } catch (error) {
            console.log(error);
          }

          // console.log(phonemes);
          setPhonetics(phonetics);
          setPhonemes(phonemes);
        })
        .then(() => {
          // console.log(word + " passed");
          // setLoaded(true);
        })
        .catch((error) => {}),
    []
  );

  const reset = (word: string) => {
    // setPhonetics("");
    // setMeanings([]);
    // setPhonemes([]);
    // setAudioURL("");
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

  if (word.trim() && (meanings || phonetics || audioURL)) {
    let audio = <></>;
    if (audioURL.trim()) audio = <audio controls src={audioURL}></audio>;
    return (
      <>
        <p className="text-xs text-muted-foreground">Sounds like: </p>
        <em className="text-s">
          {phonemes.length ? (
            phonemes.map((s: string, i: number) => {
              return <Phoneme key={i} text={s}></Phoneme>;
            })
          ) : (
            <WordSkeleton></WordSkeleton>
          )}
        </em>
        {audio}
        <Accordion
          type="multiple"
          className="w-auto min-w-[80%] transition-all"
        >
          {meanings ? (
            <Meaning meaning={meanings} i={0} key={0}></Meaning>
          ) : (
            <></>
          )}
        </Accordion>
      </>
    );
  } else {
    return <WordSkeleton></WordSkeleton>;
  }
}
