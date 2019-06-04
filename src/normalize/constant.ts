import { Modifiers } from "./types";

export const INCLUDED_PROPERTIES: Record<string, string> = {
  "color": "color",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-stretch": "fontStretch",
  "font-style": "fontStyle",
  "font-weight": "fontWeight",
  "letter-spacing": "letterSpacing",
  "line-height": "lineHeight",
  "text-align": "textAlign",
};

export const MODIFIERS: Modifiers = {
  c: {
    property: "color",
    values: null, // not limited css style values
  },
  fs: {
    property: "font-style",
    values: ["normal", "italic", "oblique", "initial", "inherit"],
  },
  fw: {
    property: "font-weight",
    values: [
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
    ],
  },
  ta: {
    property: "text-align",
    values: ["left", "center", "right"],
  },
  tt: {
    property: "text-transform",
    values: ["uppercase", "lowercase", "capitalize"],
  },
};

export const BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"];
