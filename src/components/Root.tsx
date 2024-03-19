import {Navigate} from "react-router-dom";

export default function () {
    if (!localStorage.getItem("email")) {
        return <Navigate to="/enroll/email" replace/>;
    }

    return (
        <Navigate to="/home" replace/>
    );
}
