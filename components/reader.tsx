"use client";

import HtmlToReact, { Parser } from "html-to-react";
import { useStateCallback } from "@/lib/utils";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowRightIcon,
  Cross1Icon,
  Cross2Icon,
  SpeakerLoudIcon,
  SpeakerModerateIcon,
  SpeakerOffIcon,
  SpeakerQuietIcon,
} from "@radix-ui/react-icons";
import WordToolbar from "./word-toolbar";

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
    <div className="flex flex-row space-x-4 p-4 justify-end h-auto">
      <article
        className="prose dark:prose-invert "
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
              // highlightIdx={wordIdx}
            ></AnnotatedText>
          </CardContent>
          <Separator />
          <CardFooter className="pt-4">
            <div className="flex transition-all">
              <WordToolbar word={word}>
                <Cross2Icon
                  className="stroke-red-300 stroke-[0.5] rounded-sm transition hover:bg-slate-400/50 hover:stroke-[1.5] h-4 w-4 mt-[7px] "
                  onClick={() => {
                    setWord("");
                  }}
                ></Cross2Icon>
              </WordToolbar>
              <WordDefinition word={word}></WordDefinition>
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

function AnnotatedText({ text }: { text: string }) {
  const tokens = text.split(" ");
  if (!tokens) return false;

  return (
    <>
      {tokens
        .map<React.ReactNode>((t: string, i: number) => {
          return (
            <React.Fragment key={`${t}${i}`}>
              <span className="rounded-lg outline-offset-1 box-border hover:dark:bg-cyan-100/25 transition-colors">
                {t}
              </span>
            </React.Fragment>
          );
        })
        .reduce((prev, curr) => [prev, " ", curr])}
    </>
  );
}
