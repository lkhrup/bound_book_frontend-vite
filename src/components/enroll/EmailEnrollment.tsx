/*
 * This screen prompts the user to enter their email address.
 * Upon submission, a confirmation code is sent to the provided email address.
 */
import {useRef} from "preact/hooks";
import {useEffect} from "react";
import Card from "../ui/Card.tsx";

export default function EmailEnrollment() {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // If the user has already entered an email, pre-fill the input field.
      const email = localStorage.getItem("email");
      if (email) {
        inputRef.current.value = email;
      }
      // Focus the input field.
      inputRef.current?.focus();
    }
  });

  return (
    <Card>
      <h1>Email Enrollment</h1>
      <p>
        Welcome to our enrollment process!<br/>
        Please enter your email address below.<br/>
        We'll use this email to send you a confirmation code.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const email = formData.get("email") as string;
          localStorage.setItem("email", email);
          fetch("/api/enroll", { method: "POST", body: email }).then((response) => {
            if (response.status === 200) {
              // TODO: redirect to /enroll/confirm
            }
          });
        }}
      >
        <label htmlFor="email">
          Email:
          <input
            type="email" id="email" name="email" required
            ref={inputRef}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </Card>
  );
}