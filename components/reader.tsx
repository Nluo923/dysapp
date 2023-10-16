"use client";

import HtmlToReact, { Parser } from "html-to-react";
import React from "react";

export function Reader({ html }: { html: string }) {
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
            className:
              "rounded-lg  outline-offset-4 box-border hover:dark:bg-cyan-100/25",
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

  return (
    <article
      className="prose dark:prose-invert"
      onClick={(e) => {
        console.log((e.target as HTMLSpanElement).textContent);
      }}
    >
      {reactComponent}
    </article>
  );
}
