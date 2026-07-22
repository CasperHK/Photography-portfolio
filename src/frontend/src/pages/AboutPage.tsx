import { For, onCleanup, onMount } from "solid-js";
import PageFrame from "../components/PageFrame";
import { ABOUT_PANELS } from "./PortfolioShared";

export default function AboutPage() {
  let shellRef!: HTMLElement;

  onMount(() => {
    const handleWheel = (event: WheelEvent) => {
      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (delta === 0) return;

      const before = shellRef.scrollLeft;
      shellRef.scrollLeft += delta;

      if (shellRef.scrollLeft !== before) {
        event.preventDefault();
      }
    };

    shellRef.addEventListener("wheel", handleWheel, { passive: false });
    onCleanup(() => {
      shellRef.removeEventListener("wheel", handleWheel);
    });
  });

  return (
    <PageFrame
      title="About Casper"
      subtitle="Visual notes, process, and collaboration details."
    >
      <section ref={shellRef} class="about-shell" aria-label="About Casper Photography">
        <div class="about-track">
          <For each={ABOUT_PANELS}>
            {(panel) => (
              <article class="about-card">
                <h2>{panel.heading}</h2>
                <p>{panel.text}</p>
              </article>
            )}
          </For>
        </div>
      </section>
    </PageFrame>
  );
}
