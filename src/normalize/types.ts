export interface IModifierDescription {
  property: string;
  values?: ReadonlyArray<string>;
}

export interface IModifier {
  property: string;
  value: string;
}

export type Modifiers = Record<string, IModifierDescription>;

export interface INormalizedTextStyle {
  name: string;
  properties: ReadonlyArray<INormalizedProperty>;
  baseBreakpoint: string;
  breakpoints: ReadonlyArray<INormalizedBreakpoint>;
  options: ReadonlyArray<INormalizedOption>;
}

export interface INormalizedProperty {
  property: string;
  value: string;
  errors: ReadonlyArray<string>;
}

export interface INormalizedBreakpoint {
  name: string;
  properties: ReadonlyArray<INormalizedProperty>;
}

export interface INormalizedOption {
  name: string;
  errors: ReadonlyArray<string>;
  properties: ReadonlyArray<INormalizedProperty>;
}

export interface IGlobalError {
  textStyleName: string;
  property: string;
  message: string;
}

export interface INormalizedName {
  name: string;
  baseName: string;
  breakpoint: string;
  modifiedProperties: INormalizedProperty[];
}
