import { FC } from "react";

type TProps = {
  children: React.ReactNode;
};

const PrivateLayout: FC<TProps> = ({ children }: TProps) => (
  <div className="private-layout">
    <header>Private Navigation</header>
    <main>{children}</main>
    <footer>Private Footer</footer>
  </div>
);

export default PrivateLayout;
