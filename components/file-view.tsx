export function FileView({ text }: { text: string }) {
  return <article className="prose whitespace-pre-line">{text}</article>;
}
