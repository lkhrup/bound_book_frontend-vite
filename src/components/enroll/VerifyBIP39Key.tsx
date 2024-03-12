import {useRef} from "preact/hooks";
import {useEffect} from "react";

export default function VerifyBIP39Key() {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // Focus the input field.
      inputRef.current?.focus();
    }
  });

  return (
    <div>
      <h1>Verify Recovery Key</h1>
      <p>
        Wonderful! You've generated your recovery key.<br/>
        Now, let's make sure it was copied correctly.<br/>
        Please enter the 12-word recovery key you just received.<br/>
        While you do that, we'll download some necessary data in the background to set up your account.
      </p>
      <form
        onSubmit={(event) => {
          // TODO: validate the recovery key and move to the next step
        }}
      >
        {Array(12).fill("").map((_, index) => (
          <label htmlFor={`word${index}`}>
            {index+1}
            <input
              type="text" name={`word${index}`} required
              ref={index === 0 ? inputRef : null}
            />
          </label>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
