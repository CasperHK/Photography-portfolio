import { Link } from "@tanstack/solid-router";

type TopNavBarProps = {
  title?: string;
  subtitle?: string;
};

export default function TopNavBar(props: TopNavBarProps) {
  return (
    <header class="brand navbar bg-base-100/60 border-b border-base-content/10">
      <div class="brand-copy navbar-start">
        <h1>{props.title ?? "Casper Photography"}</h1>
        <p>{props.subtitle ?? "Moments caught between wandering and wondering."}</p>
      </div>
      <nav class="brand-nav navbar-end" aria-label="Primary">
        <Link class="btn btn-ghost btn-sm" to="/">
          Home
        </Link>
        <Link class="btn btn-ghost btn-sm" to="/about">
          About
        </Link>
        <Link class="btn btn-ghost btn-sm" to="/galleries">
          Galleries
        </Link>
        <Link class="btn btn-ghost btn-sm" to="/contact-me">
          Contact Me
        </Link>
      </nav>
    </header>
  );
}