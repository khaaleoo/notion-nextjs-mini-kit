import info from "@helpers/info";
import Link from "next/link";
import { FC } from "react";

type TProps = {};

const Footer: FC<TProps> = (props: TProps) => {
  return (
    <footer className="w-full bg-primaryBg shadow-theme">
      <div className="container mx-auto w-full px-4 py-6 lg:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <Link href="/" className="hover:underline">
              {info.name}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
