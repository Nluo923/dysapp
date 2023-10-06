"use client";
import React from "react";
// @ts-ignore
import useSound from "use-sound";
import { Button } from "./ui/button";

export function MediaPlayer({ soundID }: { soundID: string }) {
  const [playSound] = useSound(`/${soundID}/full.mp3`);

  const handleClick = () => {
    console.log(`/${soundID}/full.mp3`);
    playSound();
  };

  return <Button onClick={handleClick}>Play</Button>;
}
