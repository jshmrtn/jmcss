type Color = import("zem").Color;
type NormalizedTextStyle = import("./normalize/types").NormalizedTextStyle;
type GlobalError = import("./normalize/types").GlobalError;
type NormalizedName = import("./normalize/types").NormalizedName;

declare module "*/templates/text-styles.njk" {
  const render: Render;
  export default render;

  interface Render {
    render(data: Data): string;
  }
  export interface Data {
    textStyles: readonly NormalizedTextStyle[];
    globalErrors: readonly GlobalError[];
    mediaQueryMixinName: string;
  }
}

declare module "*/templates/colors.njk" {
  const render: Render;
  export default render;

  interface Render {
    render(data: Data): string;
  }
  interface Data {
    readonly colors: readonly Color[];
  }
}

declare module "*/templates/layer.njk" {
  const render: Render;
  export default render;

  interface Render {
    render(data: Data): string;
  }
  interface Data {
    readonly textStyle: NormalizedName;
  }
}
