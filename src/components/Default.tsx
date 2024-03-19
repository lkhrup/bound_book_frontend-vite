import {Outlet} from "react-router-dom";

export default function () {
    return (
        <div>
            <Outlet />
            <p>Default route.</p>
        </div>
    );
}