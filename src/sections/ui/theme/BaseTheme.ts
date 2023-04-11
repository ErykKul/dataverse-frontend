import colorVariables from '../assets/styles/design-tokens/colors.module.scss'
import typographyVariables from '../assets/styles/design-tokens/typography.module.scss'

export const baseTheme = {
  themeKey: 'base',
  color: {
    brand: colorVariables.brand,
    primary: colorVariables.primary,
    secondary: colorVariables.secondary,
    successColor: colorVariables.successColor,
    warningColor: colorVariables.warningColor,
    infoColor: colorVariables.infoColor,
    dangerColor: colorVariables.dangerColor,
    textColor: colorVariables.textColor,
    subTextColor: colorVariables.subTextColor,
    primaryTextColor: colorVariables.primaryTextColor,
    secondaryTextColor: colorVariables.secondaryTextColor,
    successTextColor: colorVariables.successTextColor,
    warningTextColor: colorVariables.warningTextColor,
    infoTextColor: colorVariables.infoTextColor,
    dangerTextColor: colorVariables.dangerTextColor,
    linkColor: colorVariables.linkColor,
    linkHoverColor: colorVariables.linkHoverColor
  },
  typography: {
    fontSize: typographyVariables.fontSize,
    fontSizeSm: typographyVariables.fontSizeSm,
    brandFontSize: typographyVariables.brandFontSize,
    fontFamily: typographyVariables.fontFamily
  }
}
