import "../css/page.scss";

export default function MascotPanel() {
  return (
    <section className="shell__main mascot-panel">
      <div className="mascot">
        <a
          className="mascot__credit"
          href="https://www.instagram.com/sarii_illustration/"
          target="_blank"
          rel="noopener noreferrer"
        >
          @sarii_illustration
        </a>
        <img
          src="/cute-200.webp"
          srcSet="/cute-200.webp 1x, /cute-320.webp 2x"
          width="320"
          height="320"
          alt=""
        />
      </div>
    </section>
  );
}
