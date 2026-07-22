import { Link } from "@tanstack/solid-router";

type TopNavBarProps = {
  title?: string;
  subtitle?: string;
};

export default function TopNavBar(props: TopNavBarProps) {
  return (
    <header class="brand">
      <div class="brand-copy">
        <h1>{props.title ?? "Casper Photography"}</h1>
        <p>{props.subtitle ?? "Moments caught between wandering and wondering."}</p>
      </div>
      <nav class="brand-nav" aria-label="Primary">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>
    </header>
  );
}