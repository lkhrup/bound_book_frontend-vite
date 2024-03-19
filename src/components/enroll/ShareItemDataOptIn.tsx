import Card from "../ui/Card.tsx";
import {useEffect} from "react";
import {useRef} from "preact/hooks";
import {useNavigate} from "react-router-dom";

export default function ShareItemDataOptIn() {
    const navigate = useNavigate();
    const yesRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (yesRef.current) {
            yesRef.current.checked = true;
        }
    }, []);
    return (
        <Card>
            <h1>Share Item Data</h1>
            <p className="mt-2">
                Help us improve your experience by sharing item details.<br/>
                (We will only collect make, model, type, and caliber.)
            </p>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const shareData = formData.get("share-data")?.toString();
                    localStorage.setItem("share-data", shareData || "no");
                    navigate("/home");
                }}
            >
                <div className="flex flex-col gap-3 mt-3">
                    <label>
                        <input
                            ref={yesRef}
                            className="mr-2"
                            type="radio"
                            name="share-data"
                            value="yes"
                        />
                        Yes
                    </label>
                    <label>
                        <input
                            className="mr-2"
                            type="radio"
                            name="share-data"
                            value="no"
                        />
                        No
                    </label>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        id="share-data"
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </Card>
    );
}

