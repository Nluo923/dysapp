// export const dynamic = {
//   revalidate: 0,
//   cache: "force-no-store",
// };

import { marked } from "marked";
import { sanitize } from "isomorphic-dompurify";
import { SentenceTokenizer } from "natural/lib/natural/tokenizers/index.js";
import React from "react";
import dynamic from "next/dynamic";
// import Reader from "@/components/reader";
const Reader = dynamic(() => import("./reader"), { ssr: false });

// const tokenizer = {
//   paragraph(src: string) {
//     console.log(src);
//     const match = src.match("\b[^.!?]+[.!?]+");
//     if (match) {
//       console.log(match[0] + " " + match[1]);
//       return {
//         type: "paragraph",
//         raw: match[0],
//         text: match[1],
//       };
//     }

//     return false;
//   },
// };

const renderer = {
  paragraph(text: string) {
    const tk = new SentenceTokenizer();
    const res = tk.tokenize(text);

    return `<p>${res
      .map((s: string) => {
        return `<span>${s}</span>`;
      })
      .join(" ")}</p>`;
  },
  listitem(text: string, task: boolean, checked: boolean) {
    const tk = new SentenceTokenizer();
    const res = tk.tokenize(text);

    return `<li>${res
      .map((s: string) => {
        return `<span>${s}</span>`;
      })
      .join(" ")}</li>`;
  },
  heading(text: string, level: number) {
    return `<h${level}><span>${text}</span></h${level}>`;
  },
  link(href: string) {
    // console.log(`https://${href}`);
    return `<a href="https://${href}">${href}</a>`;
  },
};

marked.use({
  renderer,
  hooks: {
    preprocess(markdown) {
      return markdown;
    },
    postprocess(html) {
      return sanitize(html);
    },
  },
  gfm: true,
  breaks: false,
});

export function FileView({
  text,
  children,
}: {
  text: string;
  title: string;
  children: React.ReactElement;
}) {
  const html = marked.parse(text);

  return (
    <>
      <div className="top-0 sticky">{children}</div>
      <Reader html={html}></Reader>
    </>
  );

  return (
    <article
      className="prose dark:prose-invert "
      dangerouslySetInnerHTML={{ __html: html }}
    ></article>
  );
}
