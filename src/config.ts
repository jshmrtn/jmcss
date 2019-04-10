import { IContext } from "zem";

export function getSplitSymbol(context: IContext): string {
  return context.getOption("splitSymbol") as string;
}

export function getDefaultColor(context: IContext): string {
  return context.getOption("defaultColor") as string;
}

export function getDefaultFontWeight(context: IContext): string {
  return context.getOption("defaultFontWeight") as string;
}

export function getDefaultTextTransform(context: IContext): string {
  return context.getOption("defaultTextTransform") as string;
}

export function getDefaultTextAlign(context: IContext): string {
  return context.getOption("defaultTextAlign") as string;
}

export function includeDefaultValue(context: IContext): boolean {
  return context.getOption("includeDefaultValue") as boolean;
}

export function getStandardSuffix(context: IContext): string {
  return context.getOption("standardSubfix") as string;
}

export function getMediaQueryMixinName(context: IContext): string {
  return context.getOption("mediaQueryMixinName") as string;
}

export function useRelativeUnits(context: IContext): boolean {
  return context.getOption("relativeUnits") as boolean;
}

export function getRelativeUnitBaseLength(context: IContext): number {
  return parseInt(context.getOption("relativeUnitBaseLength") as string, 10);
}
