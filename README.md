# JMCSS

[Zeplin](https://zeplin.io) extension that generates an opinionated styleguide from shared styles and colors.

## Getting started

Add the extension to your project via the manifest URL `https://zeplin.joshmartin.rocks/manifest.json`.

## Output

<details>
  <summary>
    Example Output
  </summary>

```scss
/* Color palette */

$black: rgb(0, 0, 0);
$mustard: rgb(213, 169, 0);
$grey-one: rgb(141, 141, 141);

/* Text styles */

%body-one {
  color: $black;
  font-family: MuseoSans;
  font-size: 16px;
  font-stretch: normal;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.025;
  line-height: 1.313;
  text-transform: none;
  text-align: left;

  @include media-breakpoint-up(xl) {
    font-size: 18px;
    line-height: 1.389;
  }
}

%label-one {
  font-family: MuseoSans;
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.036;
  color: initial;
  text-transform: none;
  text-align: left;
}

%label-one-grey-one {
  @extend %label-one;
  color: $grey-one;
}

%title-one {
  color: $black;
  font-family: MuseoSlab;
  font-size: 26px;
  font-stretch: normal;
  font-style: normal;
  font-weight: 700;
  line-height: 1.154;
  text-transform: none;
  text-align: left;

  @include media-breakpoint-up(xl) {
    font-size: 38px;
    line-height: 1.105;
  }

  @include media-breakpoint-up(sm) {
    font-size: 30px;
    line-height: 1;
    color: initial;
  }
}

%title-one-green {
  @extend %title-one;
  color: rgba(0, 159, 50, 1);
}

%title-two {
  color: $black;
  font-family: MuseoSlab;
  font-size: 15px;
  font-stretch: normal;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.033;
  line-height: 0.933;
  text-transform: none;
  text-align: left;
}

%title-two-uppercase {
  @extend %title-two;
  text-transform: uppercase;
}
```

</details>

## Development

This extension is developed using [zem](https://github.com/zeplin/zem), Zeplin Extension Manager. zem is a command line tool that lets you quickly create, test and publish extensions.

To learn more about creating Zeplin extensions, [see documentation](https://github.com/zeplin/zeplin-extension-documentation).

## Deployment

```bash
npm run build
npm run deploy
now ln --scope joshmartin YOUR_NEW_DEPLOYMENT_DOMAIN https://zeplin.joshmartin.rocks
```
