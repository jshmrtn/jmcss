import { Context, HexColor, TextStyle } from "zem";
import {
  getDefaultColor,
  getDefaultFontStyle,
  getDefaultFontWeight,
  getDefaultTextAlign,
  getDefaultTextTransform,
  getRelativeUnitBaseLength,
  includeDefaultValue,
  useRelativeUnits,
} from "../config";
import { NormalizedProperty } from "./types";
import { INCLUDED_PROPERTIES } from "./constant";

function toRelativeLength(context: Context, length: number): string {
  return `${Math.round((length / getRelativeUnitBaseLength(context)) * 1000) / 1000}rem`;
}

function toRelative(_context: Context, length: number, compareLength: number): string {
  return (Math.round((1 / compareLength) * length * 1000) / 1000).toString();
}

function toNumber(_context: Context, length: number): string {
  return (Math.round(length * 1000) / 1000).toString();
}

function toSpecificLength(context: Context, length: number): string {
  if (context.project?.lengthUnit === "px" && useRelativeUnits(context)) {
    return toRelativeLength(context, length);
  }
  return `${Math.round(length * 1000) / 1000}${context.project?.lengthUnit}`;
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function renderColor(context: Context, color: HexColor): string {
  const globalColor = context.project?.findColorByHexAndAlpha({
    alpha: color.a,
    hex: componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b),
  });
  if (globalColor) {
    return `$${globalColor.name}`;
  } else {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }
}

export function normalize(
  context: Context,
  property: string | keyof typeof INCLUDED_PROPERTIES,
  value: null | "" | 0,
  textStyle: TextStyle,
): null;
export function normalize(
  context: Context,
  property: keyof typeof INCLUDED_PROPERTIES,
  value: number | string | HexColor,
  textStyle: TextStyle,
): NormalizedProperty;
export function normalize(
  context: Context,
  property: string,
  value: number | string | HexColor | null,
  textStyle: TextStyle,
): null;

export function normalize(
  context: Context,
  property: string | keyof typeof INCLUDED_PROPERTIES,
  value: number | string | HexColor | null,
  textStyle: TextStyle,
): NormalizedProperty | null {
  // Add special case for Text Align since "left" is always null
  if (property === "text-align" && !value) {
    value = getDefaultTextAlign(context);
  }

  if (!value) {
    return null;
  }

  switch (property) {
    case "font-size":
      return { property, errors: [], value: toSpecificLength(context, value as number) };
    case "font-weight":
      return { property, errors: [], value: toNumber(context, value as number) };
    case "font-style":
      return { property, errors: [], value: value as string };
    case "font-family":
      return { property, errors: [], value: value as string };
    case "font-stretch":
      return { property, errors: [], value: value as string };
    case "line-height":
      return {
        errors: [],
        property,
        value: toRelative(context, value as number, textStyle.fontSize),
      };
    case "text-align":
      return { property, errors: [], value: value as string };
    case "letter-spacing":
      return {
        errors: [],
        property,
        value: toRelative(context, value as number, textStyle.fontSize),
      };
    case "color":
      return { property, errors: [], value: renderColor(context, value as HexColor) };
    default:
      return null;
  }
}

function textStylePropertyName(
  propertyName: keyof typeof INCLUDED_PROPERTIES,
): keyof Pick<
  TextStyle,
  | "color"
  | "fontFamily"
  | "fontSize"
  | "fontStretch"
  | "fontStyle"
  | "fontWeight"
  | "letterSpacing"
  | "lineHeight"
  | "textAlign"
> {
  switch (propertyName) {
    case "color":
      return "color";
    case "font-family":
      return "fontFamily";
    case "font-size":
      return "fontSize";
    case "font-stretch":
      return "fontStretch";
    case "font-style":
      return "fontStyle";
    case "font-weight":
      return "fontWeight";
    case "letter-spacing":
      return "letterSpacing";
    case "line-height":
      return "lineHeight";
    case "text-align":
      return "textAlign";
  }
}

export function normalizeAll(context: Context, textStyle: TextStyle): NormalizedProperty[] {
  return Object.keys(INCLUDED_PROPERTIES)
    .map((property: keyof typeof INCLUDED_PROPERTIES) => ({
      property,
      value: textStyle[textStylePropertyName(property)],
    }))
    .map(({ property, value }) => normalize(context, property, value, textStyle))
    .filter((property): property is NormalizedProperty => property !== null);
}

function propertyExists(properties: readonly NormalizedProperty[], expectedProperty: string): boolean {
  return properties.filter(({ property }) => property === expectedProperty).length > 0;
}

export function addDefaultProperties(
  context: Context,
  properties: readonly NormalizedProperty[],
): readonly NormalizedProperty[] {
  if (!includeDefaultValue(context)) {
    return properties;
  }

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

  if (!propertyExists(writableProperties, "font-style")) {
    writableProperties.push({
      errors: [],
      property: "font-style",
      value: getDefaultFontStyle(context),
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
