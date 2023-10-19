"use client";

import HtmlToReact, { Parser } from "html-to-react";
import { useStateCallback } from "@/lib/utils";
import React, { DOMElement } from "react";
import natural from "natural";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  SpeakerLoudIcon,
  SpeakerModerateIcon,
  SpeakerOffIcon,
  SpeakerQuietIcon,
} from "@radix-ui/react-icons";

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
            className: `rounded-lg outline-offset-1 box-border hover:dark:bg-cyan-100/25`,
          },
          node.data,
          children
        );
      },
    },
    {
      // Anything else
      shouldProcessNode: function (node: any) {
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

export function Reader({ html }: { html: string }) {
  const reactComponent = ConvertRaw(html);

  const [sentence, setSentence] = useStateCallback("");
  const [wordIdx, setWordIdx] = React.useState(0);
  const [isSpeaking, setIsSpeaking] = React.useState(SpeakingState.DONE);

  const synth = window.speechSynthesis;

  const utter = new SpeechSynthesisUtterance(sentence);
  utter.onboundary = (e) => {
    setWordIdx((wordIdx: number) => wordIdx + 1);
    console.log(`${e.name} boundary reached at ${e.elapsedTime}`);
  };

  utter.onend = (e) => {
    setIsSpeaking(SpeakingState.DONE);
  };

  utter.onstart = (e) => {
    setWordIdx(0);
    setIsSpeaking(SpeakingState.PLAYING);
    // console.log("the callback one was spoken");
  };

  utter.onpause = (e) => {
    setIsSpeaking(SpeakingState.PAUSED);
  };

  utter.onresume = (e) => {
    setIsSpeaking(SpeakingState.PLAYING);
  };

  //Chromium MacOS has a bug where speechsynth spazzes out, works in firefox
  return (
    <div className="flex flex-row space-x-4">
      <article
        className="prose dark:prose-invert"
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName != "SPAN") return false;

          setSentence(
            (e.target as HTMLSpanElement).textContent ?? "",
            (s: string) => {
              utter.text = s;
              synth.cancel();
              synth.speak(utter);
            }
          );
        }}
      >
        {reactComponent}
      </article>
      <Separator orientation="vertical" />
      <div className="container">
        <Tabs></Tabs>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center align-middle">
              <div
                className="rounded-full bg-slate-500/50 hover:bg-slate-400/50 transition-colors items-center p-2 mr-2"
                onClick={(e) => {
                  if (isSpeaking == SpeakingState.PAUSED) {
                    synth.resume();
                    if (synth.speaking) setIsSpeaking(SpeakingState.PLAYING);
                    else setIsSpeaking(SpeakingState.DONE);
                  } else {
                    synth.pause();
                    setIsSpeaking(SpeakingState.PAUSED);
                  }
                }}
              >
                {SpeakingStateIcon(isSpeaking)}
              </div>
              <p>Speak</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sentence}
            <Separator />
          </CardContent>
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
