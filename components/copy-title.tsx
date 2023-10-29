"use client";

import { Link2Icon, LinkBreak2Icon } from "@radix-ui/react-icons";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

export function ShareableTitle({ text }: { text: string }) {
  const [broken, setBroken] = React.useState(false);
  const [shrink, setShrink] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener(
        "scroll",
        () => {
          setShrink(window.scrollY > 100);
        },
        { passive: true }
      );
    }
  }, []);

  const { toast } = useToast();
  return (
    <div
      className={`${
        shrink ? "justify-end" : "justify-center"
      }  flex items-center space-x-4 mb-4 min-h-[3.5rem]`}
    >
      <h1
        className={`${
          shrink ? "text-lg" : "text-4xl"
        } top-0 sticky font-bold inline-block vertical-align select-none hover:text-emerald-400 transition ease-in-out delay-150`}
        onClick={() => {
          setBroken(true);
          navigator.clipboard.writeText(document.URL);
          toast({
            title: "Link Copied",
            description: "Share this text!",
          });
        }}
        onMouseLeave={() => {
          setBroken(false);
        }}
      >
        {text}
      </h1>
      <div className="align-middle">
        {broken ? <LinkBreak2Icon></LinkBreak2Icon> : <Link2Icon></Link2Icon>}
      </div>
    </div>
  );
}
