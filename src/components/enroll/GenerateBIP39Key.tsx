import {useRef} from "preact/hooks";
import {newUserSeed} from "../../lib/Utils.ts";

export default function GenerateBIP39Key() {
  const mnemonicRef = useRef<string[]>();
  if (!mnemonicRef.current) {
    const { mnemonic, seed } = newUserSeed();
    localStorage.setItem("seed", seed.toString("hex"));
    mnemonicRef.current = mnemonic.split(" ");
  }

  return (
    <div>
      <h1>Recovery Key Generation</h1>
      <p>
        Great! You've confirmed your email address.<br/>
        Now, let's generate a secure recovery key for your account.<br/>
        Below, you'll find a unique 12-word recovery key.<br/>
        <strong>Please print it or write it down and store it in a safe place.</strong>
      </p>
      <p>Recovery Key:</p>
      <ol className="list-decimal">
        {mnemonicRef.current.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ol>
      <p>
        Do not share this key with anyone!<br/>
        If you lose this key, you will lose access to your account and all of your data.
      </p>
    </div>
  );
}