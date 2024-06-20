import { FC } from "react";
import Header from "@components/organisms/Header";
import Footer from "@components/organisms/Footer";
import clsx from "clsx";

type TProps = {
  children: React.ReactNode;
};

const PublicLayout: FC<TProps> = ({ children }: TProps) => (
  <div className="public-layout flex flex-col items-center">
    <Header className="fixed w-screen"></Header>
    <main
      className={clsx(
        "pt-14 px-4 container",
        "min-h-[calc(100vh_-_84px)]" // 84px is the height of the footer
      )}
    >
      {children}
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
