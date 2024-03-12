import {PropsWithChildren} from "react";

export default function ({ children }: PropsWithChildren<{}>) {
  return (
    <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-gray-100">
      {children}
    </div>
  );
}