import {forwardRef} from 'preact/compat';
import {useEffect} from "react";
import {useRef} from "preact/hooks";
import * as bip39 from "bip39";
import classNames from "classnames";

export interface WordInputProps {
    index: number;
    value: string;
    onChange: (value: string) => void;
}

function WordInput({index, value, onChange}: WordInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const good = bip39.wordlists[bip39.getDefaultWordlist()].includes(value);
    useEffect(() => {
        if (inputRef.current) {
            // Focus the input field.
            inputRef.current?.focus();
        }
    }, []);

    return (
        <label
            className="flex flex-row gap-1 bg-gray-200 rounded-md"
            htmlFor={`word${index}`}
        >
            <span className="w-5 text-right">{index + 1}.</span>
            <input
                className={classNames("w-28 bg-gray-200 outline-0 rounded-r-md", good ? "text-green-900" : "text-red-900 font-bold")}
                ref={index === 0 ? inputRef : null}
                type="text"
                id={`word${index}`}
                name={`word${index}`}
                value={value}
                onChange={(event) => onChange(event.currentTarget.value)}
                required
                list="bip39"
                onKeyDown={(event) => {
                    // When the user types a space or tab, complete the current value using the first completion,
                    // the move to the next filed.
                    const word = value.trim();
                    if (!good && word.length > 0 && (event.key === " " || event.key === "Tab")) {
                        // Complete the current value using the first match.
                        const match = bip39.wordlists[bip39.getDefaultWordlist()].find(
                            (entry) => entry.startsWith(word)
                        );
                        if (match) {
                            onChange(match);
                        }
                    }
                    // Space moves focus to the next field.
                    if (event.key === " ") {
                        event.preventDefault();
                        // Focus node #word${index+1} or #verify-key if this is the last field.
                        const next = document.getElementById(`word${index + 1}`) || document.getElementById("verify-key");
                        if (next) {
                            next.focus();
                        } else {
                            document.getElementById("verify-key")?.focus();
                        }
                    }
                }}
            />
        </label>
    );
}

export default forwardRef(WordInput);
