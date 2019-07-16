import { Context } from "zem";

export function getSplitSymbol(context: Context): string {
  return context.getOption("splitSymbol") as string;
}

export function getDefaultColor(context: Context): string {
  return context.getOption("defaultColor") as string;
}

export function getDefaultFontWeight(context: Context): string {
  return context.getOption("defaultFontWeight") as string;
}

export function getDefaultFontStyle(context: Context): string {
  return context.getOption("defaultFontStyle") as string;
}

export function getDefaultTextTransform(context: Context): string {
  return context.getOption("defaultTextTransform") as string;
}

export function getDefaultTextAlign(context: Context): string {
  return context.getOption("defaultTextAlign") as string;
}

export function includeDefaultValue(context: Context): boolean {
  return context.getOption("includeDefaultValue") as boolean;
}

export function getStandardSuffix(context: Context): string {
  return context.getOption("standardSubfix") as string;
}

export function getMediaQueryMixinName(context: Context): string {
  return context.getOption("mediaQueryMixinName") as string;
}

export function useRelativeUnits(context: Context): boolean {
  return context.getOption("relativeUnits") as boolean;
}

export function getRelativeUnitBaseLength(context: Context): number {
  return parseInt(context.getOption("relativeUnitBaseLength") as string, 10);
}
