type TIconsType = {};
type TColorsType = string;

interface IconProps extends React.SVGAttributes<HTMLOrSVGElement> {
  name: TIconsType;
  width: number;
  height: number;
  color?: TColorsType;
}

export type { IconProps as TIconProps };
