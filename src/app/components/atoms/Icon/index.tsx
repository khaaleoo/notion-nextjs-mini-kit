import { replaceColor } from "@helpers/svg";
import { TIconProps } from "./index.d";
import { useEffect, useRef } from "react";

export const Icon: React.FC<TIconProps> = ({ name, width, height, color = "", stroke = "", ...props }: TIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgElement = async () => await import(`@assets/svg/${name}.svg`);
    svgElement().catch((e) => {
      console.error("<strong>On loading the SVG</strong>", e);
    });

    svgElement().then((svg) => {
      let svgTemp = svg.default;
      if (color) {
        svgTemp = replaceColor(svg.default, color);
      }

      if (stroke) {
        svgTemp = replaceColor(svg.default, stroke, "stroke");
      }
      if (svgRef.current) {
        svgRef!.current!.innerHTML = svgTemp;
      }
    });
  }, [svgRef, name, color, stroke]);

  return <svg width={width} height={height} ref={svgRef} {...props}></svg>;
};
