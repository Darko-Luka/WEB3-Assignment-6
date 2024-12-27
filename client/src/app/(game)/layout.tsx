"use client";

import { Provider } from "react-redux";
import { store } from "@/stores/store";
import Nav from "@/components/Nav";

export default function RootGameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <div className="max-w-screen-2xl mx-auto bg-slate-800 h-screen">
        <div className="bg-white">
          <Nav>{children}</Nav>
        </div>
      </div>
    </Provider>
  );
}
