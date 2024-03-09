import {Link} from "react-router-dom";
import {menuEntries} from "../routes.tsx";

export function Home() {
  return (
    <>
      <h1>OpenArms Bound Book</h1>
      <nav>
        <ul>
          {menuEntries.map((entry) => (
            <li key={entry.path}>
              <Link to={entry.path}>{entry.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
