type TopNavBarProps = {
  title?: string;
  subtitle?: string;
};

export default function TopNavBar(props: TopNavBarProps) {
  return (
    <header class="brand">
      <div class="brand-copy">
        <h1>{props.title ?? "Casper Photography"}</h1>
        <p>{props.subtitle ?? "Selected travel, street, and landscape frames."}</p>
      </div>
      <nav class="brand-nav" aria-label="Primary">
        <a href="/about">About</a>
        <a href="/gallery">Gallery</a>
      </nav>
    </header>
  );
}