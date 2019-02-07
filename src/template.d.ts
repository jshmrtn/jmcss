type IColor = import("zem").IColor;
type INormalizedTextStyle = import("./normalize/types").INormalizedTextStyle;
type IGlobalError = import("./normalize/types").IGlobalError;
type INormalizedName = import("./normalize/types").INormalizedName;

declare module "*/templates/text-styles.njk" {
  const render: IRender;
  export default render;

  interface IRender {
    render(data: IData): string;
  }
  export interface IData {
    textStyles: ReadonlyArray<INormalizedTextStyle>;
    globalErrors: ReadonlyArray<IGlobalError>;
    mediaQueryMixinName: string;
  }
}

declare module "*/templates/colors.njk" {
  const render: IRender;
  export default render;

  interface IRender {
    render(data: IData): string;
  }
  interface IData {
    readonly colors: ReadonlyArray<IColor>;
  }
}

declare module "*/templates/layer.njk" {
  const render: IRender;
  export default render;

  interface IRender {
    render(data: IData): string;
  }
  interface IData {
    readonly textStyle: INormalizedName;
  }
}
