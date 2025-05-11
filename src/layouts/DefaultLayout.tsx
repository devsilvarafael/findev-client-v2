import { JSX, ReactNode } from "react";

interface DefaultLayoutProps {
  leftSideBar: ReactNode;
  children: ReactNode;
}

export const DefaultLayout = ({
  leftSideBar,
  children,
}: DefaultLayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-14">{leftSideBar}</header>
      <main className="flex-1 overflow-auto p-6 bg-gray-100">{children}</main>
    </div>
  );
};
