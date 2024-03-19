import * as bip39 from "bip39";
import WordInput from "../ui/WordInputProps.tsx";
import {useState} from "preact/hooks";
import {Link, useNavigate} from "react-router-dom";
import Card from "../ui/Card.tsx";

export default function VerifyBIP39Key() {
    const navigate = useNavigate();
    const [words, setWords] = useState(() => Array(12).fill(""));
    const [failed, setFailed] = useState(false);

    return (
        <Card>
            <h1>Verify Recovery Key</h1>
            <p className="mt-2">
                Wonderful! You've generated your recovery key.<br/>
                Now, let's make sure it was copied correctly.<br/>
                Please enter the 12-word recovery key you just received.<br/>
                While you do this, we'll fetch some necessary data in the background.
            </p>
            <form
                className="mt-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const mnemonic = Array.from(formData.values()).join(" ");
                    const seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
                    if (localStorage.getItem("seed") === seed) {
                        navigate("/enroll/share-data");
                    } else {
                        setFailed(true);
                    }
                }}
            >
                <div className="flex flex-row gap-4 flex-wrap">
                    {Array(12).fill("").map((_, index) => (
                        <WordInput
                            key={index}
                            index={index}
                            value={words[index]}
                            onChange={value => {
                                const newWords = [...words];
                                newWords[index] = value;
                                setWords(newWords);
                            }}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        id="verify-key"
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Verify
                    </button>
                    {failed && (
                        <Link
                            to="/enroll/generate-key"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
                        >
                            Generate a new key
                        </Link>
                    )}
                </div>
                {failed && (
                    <p className="text-red-500 ml-4">
                        The recovery key you entered is incorrect.<br/>
                        You may retry or generate a new key.
                    </p>
                )}
            </form>
            <datalist id="bip39">
                {bip39.wordlists[bip39.getDefaultWordlist()].map(
                    value => <option key={value} value={value}/>
                )}
            </datalist>
        </Card>
    );
}
