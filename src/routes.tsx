import {Home} from "./components/Home.tsx";
import Acquisition from "./components/Acquisition.tsx";
import {RouteObject} from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/acquisition",
    element: <Acquisition/>,
  },
  {
    path: "/acquisition",
    element: <Acquisition/>,
  },
];

export interface MenuEntry {
  label: string;
  path: string;
}

export const menuEntries: MenuEntry[] = [
  { label: "Search", path: "/search" },
  { label: "Acquisition", path: "/acquisition" },
  { label: "Disposition", path: "/disposition" },
];
