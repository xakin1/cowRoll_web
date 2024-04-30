// tokenizer.ts
export type Token = {
  type: string;
  value: string;
};

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const re = /\s*(=>|{|}|[\(\)]|do|function|[a-zA-Z_][a-zA-Z0-9_]*)\s*/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(input))) {
    const tokenValue = match[1];
    if (tokenValue === "function" || tokenValue === "do") {
      tokens.push({ type: "keyword", value: tokenValue });
    } else if (tokenValue === "(" || tokenValue === ")") {
      tokens.push({ type: "bracket", value: tokenValue });
    } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tokenValue)) {
      if (tokens.length > 0 && tokens[tokens.length - 1].value === "function") {
        tokens.push({ type: "function_name", value: tokenValue });
      } else {
        tokens.push({ type: "parameter", value: tokenValue });
      }
    }
  }

  return tokens;
}
