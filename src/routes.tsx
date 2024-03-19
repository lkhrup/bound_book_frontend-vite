import {Home} from "./components/Home.tsx";
import Acquisition from "./components/Acquisition.tsx";
import {RouteObject} from "react-router-dom";
import Disposition from "./components/Disposition.tsx";
import EmailEnrollment from "./components/enroll/EmailEnrollment.tsx";
import GenerateBIP39Key from "./components/enroll/GenerateBIP39Key.tsx";
import EmailConfirmation from "./components/enroll/EmailConfirmation.tsx";
import VerifyBIP39Key from "./components/enroll/VerifyBIP39Key.tsx";
import Default from "./components/Default.tsx";
import Root from "./components/Root.tsx";
import ShareItemDataOptIn from "./components/enroll/ShareItemDataOptIn.tsx";

export const routes: RouteObject[] = [
    {
        element: <Default/>,
        children: [
            {
                path: "/",
                element: <Root/>
            },
            // ...navbarRoutes
        ],
    },
    {
        path: "/home",
        element: <Home/>,
    },
    {
        path: "/acquisition",
        element: <Acquisition/>,
    },
    {
        path: "/disposition",
        element: <Disposition/>,
    },
    {
        path: "/enroll/email",
        element: <EmailEnrollment/>,
    },
    {
        path: "/enroll/confirm",
        element: <EmailConfirmation/>,
    },
    {
        path: "/enroll/generate-key",
        element: <GenerateBIP39Key/>,
    },
    {
        path: "/enroll/verify-key",
        element: <VerifyBIP39Key/>,
    },
    {
        path: "/enroll/share-data",
        element: <ShareItemDataOptIn/>,
    }
];

export interface MenuEntry {
    label: string;
    path: string;
}

export const menuEntries: MenuEntry[] = [
    {label: "Search", path: "/search"},
    {label: "Acquisition", path: "/acquisition"},
    {label: "Disposition", path: "/disposition"},
];
