export function overTextPopper(text: string, styles?: Partial<CSSStyleDeclaration>) {
  const div = document.createElement("div");
  div.innerText = text;
  if (styles) {
    for (const styleKey in styles) {
      if (styles[styleKey]) {
        div.style[styleKey] = styles[styleKey];
      }
    }
  }
  document.body.appendChild(div);
  const style = getComputedStyle(div);
  const result = { ...style };
  div.parentNode?.removeChild(div);
  return result;
}
