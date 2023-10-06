export const dynamic = {
  revalidate: 0,
  cache: "force-no-store",
};

import { marked } from "marked";
import { sanitize } from "isomorphic-dompurify";
import natural from "natural";

const tokenizer = {
  paragraph(src: string) {
    console.log(src);
    const match = src.match("\b[^.!?]+[.!?]+");
    if (match) {
      console.log(match[0] + " " + match[1]);
      return {
        type: "paragraph",
        raw: match[0],
        text: match[1],
      };
    }

    return false;
  },
};

const renderer = {
  paragraph(text: string) {
    const tk = new natural.SentenceTokenizer();
    const res = tk.tokenize(text);

    return `<p>${res
      .map((s: string) => {
        console.log(s);
        return `<span>${s}</span>`;
      })
      .join(" ")}</p>`;
  },
};

marked.use({
  //@ts-ignore
  // tokenizer,
  //@ts-ignore
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

export function FileView({ text }: { text: string }) {
  const html = marked.parse(text);

  return (
    <article
      dangerouslySetInnerHTML={{ __html: html }}
      className="prose dark:prose-invert "
    ></article>
  );
}
