/*
 * This screen prompts the user to enter the confirmation code received via email.
 * Once the code is verified, proceed to the next step.
 */
import {useRef} from "preact/hooks";
import {useEffect} from "react";
import Card from "../ui/Card.tsx";

export default function EmailConfirmation() {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // Focus the input field.
      inputRef.current?.focus();
    }
  });

  return (
    <Card>
      <h1>Email Confirmation</h1>
      <p>
        Thank you for providing your email address!<br/>
        We've sent a confirmation code to your inbox.<br/>
        Please check your email and enter the code below to proceed.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const code = formData.get("code") as string;
          fetch("/api/confirm", { method: "POST", body: code }).then((response) => {
            if (response.status === 200) {
              // TODO: redirect to /enroll/generate-key
            }
          });
        }}
      >
        <label htmlFor="code">Confirmation Code</label>
        <input
          type="text" id="code" name="code" required
          ref={inputRef}
        />
        <button type="submit">Submit</button>
      </form>
    </Card>
  );
}