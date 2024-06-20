"use client";

import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import PublicLayout from "@components/templates/Layouts/PublicLayout";
import PrivateLayout from "@components/templates/Layouts/PrivateLayout";

type TProps = {
  children: React.ReactNode;
};

// Define your layout map
const layouts: Record<string, FC<any>> = {
  public: PublicLayout,
  auth: PrivateLayout,
};

// Define a component that will wrap your page
const LayoutWrapper: FC<TProps> = ({ children }: TProps) => {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Determine the layout type based on the route
  const layoutType = getLayoutType(pathname);

  // Get the layout component from the map
  const LayoutComponent = layouts[layoutType] || PublicLayout;

  // Render the children with the layout
  if (!mounted) return <LayoutComponent>{children}</LayoutComponent>;

  return <LayoutComponent>{children}</LayoutComponent>;
};

function getLayoutType(path: string) {
  if (path.startsWith("/auth")) {
    return "auth";
  }
  return "public";
}

// Export the layout wrapper
export default LayoutWrapper;
