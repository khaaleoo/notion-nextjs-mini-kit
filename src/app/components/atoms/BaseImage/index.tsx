"use client";
import Image, { ImageProps } from "next/image";
import { FC, useState } from "react";
import placeholderImage from "@assets/images/default_placeholder.webp";
import defaultBlur from "@assets/images/default_blur";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface IBaseImageProps extends Omit<ImageProps, "src"> {
  src: string;
  blurData?: string;
}
const BaseImage: FC<IBaseImageProps> = ({
  src,
  width,
  height,
  blurData,
  alt,
  placeholder,
  ...rest
}: IBaseImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | StaticImport>(src);

  return (
    <Image
      alt={alt}
      src={imgSrc || placeholderImage}
      width={width}
      height={height}
      placeholder={placeholder}
      blurDataURL={!!blurData ? blurData : defaultBlur}
      onError={() => {
        setImgSrc(placeholderImage);
      }}
      {...rest}
    />
  );
};

export default BaseImage;
