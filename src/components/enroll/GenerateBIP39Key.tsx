import {useRef} from "preact/hooks";
import {newUserSeed} from "../../lib/Utils.ts";
import {Link, useSearchParams} from "react-router-dom";

export default function GenerateBIP39Key() {
    const mnemonicRef = useRef<string[]>();
    if (!mnemonicRef.current) {
        const {mnemonic, seed} = newUserSeed();
        // For convenience, we store the seed in local storage; XSS is out of scope.
        localStorage.setItem("seed", seed.toString("hex"));
        mnemonicRef.current = mnemonic.split(" ");
    }
    // If we have email=1 in the query string, show the "confirm email" message.
    const [search, _] = useSearchParams();

    return (
        <div>
            <h1>Recovery Key Generation</h1>
            {search.get("email") === "1" && (
                <p className="mt-2">
                    Great! You've confirmed your email address.
                </p>
            )}
            <p className="mt-2">
                Let's generate a secure recovery key for your account.<br/>
                Below, you'll find a unique 12-word recovery key.<br/>
                <strong>Please print it or write it down and store it in a safe place.</strong>
            </p>
            <ol className="list-decimal flex flex-wrap">
                {mnemonicRef.current.map((word, index) => (
                    <li
                        key={index}
                        className="bg-gray-200 rounded-md w-24 p-1 m-4"
                    >{word}</li>
                ))}
            </ol>
            <p className="text-red-600">
                If you lose this key, you will lose access to your account and all of your data.
            </p>
            <div className="flex justify-center mt-4">
                <Link
                    to="/enroll/verify-key"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Continue
                </Link>
            </div>
        </div>
    );
}