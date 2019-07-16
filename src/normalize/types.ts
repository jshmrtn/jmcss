export interface ModifierDescription {
  property: string;
  values?: readonly string[];
}

export interface Modifier {
  property: string;
  value: string;
}

export type Modifiers = Record<string, ModifierDescription>;

export interface NormalizedTextStyle {
  name: string;
  properties: readonly NormalizedProperty[];
  baseBreakpoint: string;
  breakpoints: readonly NormalizedBreakpoint[];
  options: readonly NormalizedOption[];
}

export interface NormalizedProperty {
  property: string;
  value: string;
  errors: readonly string[];
}

export interface NormalizedBreakpoint {
  name: string;
  properties: readonly NormalizedProperty[];
}

export interface NormalizedOption {
  name: string;
  errors: readonly string[];
  properties: readonly NormalizedProperty[];
}

export interface GlobalError {
  textStyleName: string;
  property: string;
  message: string;
}

export interface NormalizedName {
  name: string;
  baseName: string;
  breakpoint: string;
  modifiedProperties: NormalizedProperty[];
}
