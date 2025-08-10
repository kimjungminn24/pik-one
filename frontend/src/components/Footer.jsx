import React from "react";
import "../css/footer.scss";
export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 단독스팟</p>
      <p>
        Map data ©{" "}
        <a
          href="https://www.openstreetmap.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenStreetMap contributors
        </a>{" "}
        | Icons ©{" "}
        <a
          href="https://toss.im/tossface"
          target="_blank"
          rel="noopener noreferrer"
        >
          TossFace
        </a>
      </p>
    </footer>
  );
}
