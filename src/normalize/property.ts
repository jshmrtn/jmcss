import { IContext, IHexColor, ITextStyle } from "zem";
import {
  getDefaultColor,
  getDefaultFontWeight,
  getDefaultTextAlign,
  getDefaultTextTransform,
  getRelativeUnitBaseLength,
  includeDefaultValue,
  useRelativeUnits,
} from "../config";
import { INormalizedProperty } from "./types";

export function normalizeAll(context: IContext, textStyle: ITextStyle): INormalizedProperty[] {
  return Object.entries({
    "color": textStyle.color,
    "font-family": textStyle.fontFamily,
    "font-size": textStyle.fontSize,
    "font-stretch": textStyle.fontStretch,
    "font-style": textStyle.fontStyle,
    "font-weight": textStyle.fontWeight,
    "letter-spacing": textStyle.letterSpacing,
    "line-height": textStyle.lineHeight,
    "text-align": textStyle.textAlign,
  })
    .map(([property, value]) => normalize(context, property, value, textStyle))
    .filter((property) => property !== null);
}

export function normalize(
  context: IContext,
  property: string,
  value: number | string | IHexColor,
  textStyle: ITextStyle,
): INormalizedProperty | null {
  // Add special case for Text Align since "left" is always null
  if (property === "text-align" && !value) {
    value = getDefaultTextAlign(context);
  }

  if (!value) {
    return null;
  }

  switch (property) {
    case "font-size": return { property, errors: [], value: toSpecificLength(context, value as number) };
    case "font-weight": return { property, errors: [], value: toNumber(context, value as number) };
    case "font-style": return { property, errors: [], value: value as string };
    case "font-family": return { property, errors: [], value: value as string };
    case "font-stretch": return { property, errors: [], value: value as string };
    case "line-height": return {
      errors: [],
      property,
      value: toRelative(context, value as number, textStyle.fontSize),
    };
    case "text-align": return { property, errors: [], value: value as string };
    case "letter-spacing": return {
      errors: [],
      property,
      value: toRelative(context, value as number, textStyle.fontSize),
    };
    case "color": return { property, errors: [], value: renderColor(context, value as IHexColor) };
  }
}

function toSpecificLength(context: IContext, length: number): string {
  if (context.project.lengthUnit === "px" && useRelativeUnits(context)) {
    return toRelativeLength(context, length);
  }
  return `${Math.round(length * 1000) / 1000}${context.project.lengthUnit}`;
}

function toRelativeLength(context: IContext, length: number) {
  return `${Math.round(length / getRelativeUnitBaseLength(context) * 1000) / 1000}rem`;
}

function toRelative(context: IContext, length: number, compareLength: number) {
  return (Math.round(1 / compareLength * length * 1000) / 1000).toString();
}

function toNumber(context: IContext, length: number): string {
  return (Math.round(length * 1000) / 1000).toString();
}

function renderColor(context: IContext, color: IHexColor): string {
  const globalColor = context.project.findColorByHexAndAlpha({
    alpha: color.a,
    hex: componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b),
  });
  if (globalColor) {
    return `$${globalColor.name}`;
  } else {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function propertyExists(properties: ReadonlyArray<INormalizedProperty>, expectedProperty: string): boolean {
  return properties
    .filter(({property}) => property === expectedProperty)
    .length > 0;
}

export function addDefaultProperties(context: IContext, properties: ReadonlyArray<INormalizedProperty>):
  ReadonlyArray<INormalizedProperty> {
  if (!includeDefaultValue(context)) { return properties; }

  const writableProperties = [...properties];

  if (!propertyExists(writableProperties, "color")) {
    writableProperties.push({
      errors: [],
      property: "color",
      value: getDefaultColor(context),
    });
  }

  if (!propertyExists(writableProperties, "font-weight")) {
    writableProperties.push({
      errors: [],
      property: "font-weight",
      value: getDefaultFontWeight(context),
    });
  }

  if (!propertyExists(writableProperties, "text-transform")) {
    writableProperties.push({
      errors: [],
      property: "text-transform",
      value: getDefaultTextTransform(context),
    });
  }

  if (!propertyExists(writableProperties, "text-align")) {
    writableProperties.push({
      errors: [],
      property: "text-align",
      value: getDefaultTextAlign(context),
    });
  }

  return writableProperties;
}
