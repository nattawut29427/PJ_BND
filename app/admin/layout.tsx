import { ReactElement } from "react";
import Sidebar from "./components/Sidebar";

export default function layout({ children }: { children: ReactElement }) {
  return (
    <div className="grid">
      <Sidebar />
      <div className="ml-72 p-5">{children}</div>
    </div>
  );
}
