"use client";

import HtmlToReact, { Parser } from "html-to-react";
import { cn, useStateCallback } from "@/lib/utils";
import {
  Lexicon,
  RuleSet,
  BrillPOSTagger,
} from "natural/lib/natural/brill_pos_tagger";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { WordDefinition } from "./word-definition";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Cross2Icon,
  FontFamilyIcon,
  MagicWandIcon,
  SpeakerLoudIcon,
  SpeakerOffIcon,
  SpeakerQuietIcon,
  TextAlignRightIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import WordToolbar from "./word-toolbar";
import { tagsCaption, tagsStyle } from "@/lib/POStagdata";
import { Button } from "./ui/button";

function ConvertRaw(html: string) {
  const isValidNode = function () {
    return true;
  };

  const processNodeDefinitions =
    new (HtmlToReact.ProcessNodeDefinitions as any)();
  const processingInstructions = [
    {
      shouldProcessNode: function (node: any) {
        return node.name && node.name === "span";
      },
      processNode: function (node: any, children?: React.ReactNode) {
        return React.createElement(
          "span",
          {
            className: `highlight-text`,
          },
          node.data,
          children
        );
      },
    },
    {
      // Anything else
      shouldProcessNode: function (node: any) {
        if (node.name == "a") console.log(node.name);
        return true;
      },
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ];

  const reactParser = new (Parser as any)();
  const reactComponent = reactParser.parseWithInstructions(
    html,
    isValidNode,
    processingInstructions
  );

  return reactComponent;
}

export default function Reader({ html }: { html: string }) {
  // if (typeof window === "undefined") return <p>lowoding...</p>;

  const reactComponent = ConvertRaw(html);

  const [sentence, setSentence] = useStateCallback("");
  const [word, setWord] = useStateCallback("");
  // const [wordIdx, setWordIdx] = React.useState(-1);
  const [isSpeaking, setIsSpeaking] = React.useState(SpeakingState.DONE);
  const [structureHighlighting, setStructureHighlighting] =
    React.useState<string>(StructureHighlightOption.NONE);

  const synth = window.speechSynthesis;

  const sentenceUtterance = new SpeechSynthesisUtterance(sentence);
  {
    sentenceUtterance.onend = (e) => {
      setIsSpeaking(SpeakingState.DONE);
    };

    sentenceUtterance.onstart = (e) => {
      // setWordIdx(-1);
      // console.log(wordIdx);
      setIsSpeaking(SpeakingState.PLAYING);
      // console.log("the callback one was spoken");
    };

    sentenceUtterance.onpause = (e) => {
      setIsSpeaking(SpeakingState.PAUSED);
    };

    sentenceUtterance.onresume = (e) => {
      setIsSpeaking(SpeakingState.PLAYING);
    };
  }

  //Chromium MacOS has a bug where speechsynth spazzes out, works in firefox
  return (
    <div className="flex flex-row space-x-4 p-4 justify-end h-auto min-w-[60%]">
      <article
        className="prose prose-quoteless dark:prose-invert"
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName != "SPAN") return false;

          ///setWord("");
          setSentence(
            (e.target as HTMLSpanElement).textContent ?? "",
            (s: string) => {
              sentenceUtterance.text = s;
              synth.cancel();
              synth.speak(sentenceUtterance);
            }
          );
        }}
      >
        {reactComponent}
      </article>
      <Separator orientation="vertical" />
      <div className="container max-w-[50%]">
        <Card className="sticky top-[10%] transition-transform">
          <CardHeader>
            <CardTitle className="flex flex-row items-center align-middle">
              <p className="mr-2">Speak</p>
              <div
                className="rounded-full bg-slate-500/50 hover:bg-slate-400/50 transition-colors items-center p-2"
                onClick={(e) => {
                  if (isSpeaking == SpeakingState.PAUSED) {
                    synth.resume();
                    // if (synth.speaking) setIsSpeaking(SpeakingState.PLAYING);
                    // else setIsSpeaking(SpeakingState.DONE);
                  } else if (isSpeaking == SpeakingState.DONE) {
                    synth.cancel();
                    synth.speak(sentenceUtterance);
                  } else {
                    synth.pause();
                    // setIsSpeaking(SpeakingState.PAUSED);
                  }
                }}
              >
                {SpeakingStateIcon(isSpeaking)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto hover:text-icon" variant="outline">
                    <TextAlignRightIcon></TextAlignRightIcon>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 mx-16">
                  <DropdownMenuLabel>Reader Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator></DropdownMenuSeparator>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <MagicWandIcon className="mr-2 h-4 w-4"></MagicWandIcon>
                        <span>Sentence Structure</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup
                            value={structureHighlighting}
                            onValueChange={setStructureHighlighting}
                          >
                            <DropdownMenuRadioItem
                              value={StructureHighlightOption.NONE}
                            >
                              <span>None</span>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem
                              value={StructureHighlightOption.HIGHLIGHT}
                            >
                              <span>Highlight</span>
                              <FontFamilyIcon className="ml-2 h-4 w-4"></FontFamilyIcon>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem
                              value={StructureHighlightOption.UNDERLINE}
                            >
                              <span>Underline</span>
                              <UnderlineIcon className="ml-2 h-4 w-4"></UnderlineIcon>
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
          </CardHeader>
          <CardContent
            onClick={(e) => {
              if ((e.target as HTMLElement).tagName != "SPAN") return false;

              setWord(
                ((e.target as HTMLSpanElement).textContent ?? "").replace(
                  /[,.;:!? ()]/gm,
                  ""
                ),
                (s: string) => {
                  // setWordIdx(-1);
                  synth.cancel();
                }
              );
            }}
          >
            <AnnotatedText
              text={sentence}
              structureHighlighting={structureHighlighting}
              // highlightIdx={wordIdx}
            ></AnnotatedText>
          </CardContent>
          <Separator />
          <CardFooter className="pt-4">
            <div className="flex transition-all w-full">
              <WordToolbar word={word} key={word}>
                <Cross2Icon
                  className="stroke-red-300 stroke-[0.5] rounded-sm transition hover:bg-slate-400/50 hover:stroke-[1.5] h-4 w-4 mt-[7px] "
                  onClick={() => {
                    setWord("");
                  }}
                ></Cross2Icon>
              </WordToolbar>
              <WordDefinition word={word} className="w-full"></WordDefinition>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

enum SpeakingState {
  PLAYING, //speaking
  PAUSED, //paused
  DONE, //none in queue
}

function SpeakingStateIcon(s: SpeakingState) {
  switch (s) {
    case SpeakingState.PLAYING:
      return <SpeakerLoudIcon></SpeakerLoudIcon>;
    case SpeakingState.PAUSED:
      return <SpeakerOffIcon></SpeakerOffIcon>;
    case SpeakingState.DONE:
      return <SpeakerQuietIcon></SpeakerQuietIcon>;
  }
}

enum StructureHighlightOption {
  NONE = "none",
  HIGHLIGHT = "highlight",
  UNDERLINE = "underline",
}

const lang = "EN";
const defaultCategory = "N";
const defaultCategoryCapitalized = "NNP";
var lexicon = new Lexicon(lang, defaultCategory, defaultCategoryCapitalized);
var ruleSet = new RuleSet(lang);
var tagger = new BrillPOSTagger(lexicon, ruleSet);

const styles = [
  ["bg-yellow-300", "decoration-yellow-300"],
  ["bg-teal-500", "decoration-teal-500"],
  ["bg-pink-600", "decoration-pink-600"],
  ["bg-indigo-700", "decoration-indigo-700"],
  ["bg-pink-200", "decoration-pink-200"],
];

function AnnotatedText({
  text,
  structureHighlighting = StructureHighlightOption.NONE,
}: {
  text: string;
  structureHighlighting: string;
}) {
  const tokens = text.split(" ");
  if (!tokens) return false;
  const tags = tagger.tag(
    tokens.map((v, i, a) => {
      if (i == a.length - 1) return v.replaceAll(/[.,!?]$/gm, "");
      return v.replaceAll(/[(),;]/gm, "");
    })
  );

  const structureKey =
    structureHighlighting != StructureHighlightOption.NONE ? (
      <>
        <ul className="list-none text-xs space-x-2 opacity-70 p-1 m-[-1] bg-slate-700/50 rounded-sm w-fit">
          <li key={1} className="text-yellow-300 inline">
            &bull; Connecting Words
          </li>
          <li key={2} className="text-teal-500 inline">
            &bull; Places & Things
          </li>
          <li key={3} className="text-pink-600 inline">
            &bull; Action
          </li>
          <li key={4} className="text-indigo-700 inline">
            &bull; Descriptor
          </li>
          <li key={5} className="text-pink-200 inline">
            &bull; Subjects
          </li>
        </ul>
      </>
    ) : null;

  return (
    <>
      {structureKey}
      {tokens
        .map<React.ReactNode>((t: string, i: number) => {
          const tag = tags.taggedWords[i].tag;
          const tagStyle = tagsStyle.get(tag);
          const hl =
            structureHighlighting == StructureHighlightOption.HIGHLIGHT
              ? `bg-${tagStyle}`
              : structureHighlighting == StructureHighlightOption.UNDERLINE
              ? `underline decoration-${tagStyle}`
              : "";
          return (
            <TooltipProvider key={`${t}${i}`}>
              <Tooltip>
                <TooltipTrigger>
                  <span
                    className={cn(
                      `rounded-sm outline-offset-1 box-border hover:bg-cyan-100/25 transition-colors underline-offset-4 decoration-2 p-[1px] m-[-1px] ${hl}`
                    )}
                  >
                    {t}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{tagsCaption.get(tag) ?? tag}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })
        .reduce((prev, curr) => [prev, " ", curr])}
    </>
  );
}
