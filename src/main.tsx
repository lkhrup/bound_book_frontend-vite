import {render} from "preact";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";

// Dexie is used to store the acquisition and disposition records locally.
import "dexie-observable";
import "dexie-syncable";

import Fuse from "fuse.js";

import "./index.css";
import {routes} from "./routes.tsx";

// TODO: use Fuse for the inventory search
const inventory = [
    {
        type: "rifle",
        model: "700",
        caliber_or_gauge: "308",
        manufacturer: "remington",
        serial_number: "123456",
    }
];
const fuse = new Fuse(inventory, {
    keys: ["type", "model", "caliber_or_gauge", "manufacturer", "serial_number"]
});
console.log(fuse.search("rem"));

const router = createBrowserRouter(routes);

render(
    <RouterProvider
        router={router}
        fallbackElement={<p>Loading, please wait...</p>}
    />,
    document.getElementById("app")!
);
