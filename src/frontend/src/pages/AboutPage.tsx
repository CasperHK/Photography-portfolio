import { For, onCleanup, onMount } from "solid-js";
import InfoPanel from "../components/InfoPanel";
import PageFrame from "../components/PageFrame";
import { useI18n } from "../i18n/context";

export default function AboutPage() {
  const { messages } = useI18n();
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
    <PageFrame title={messages().about.title} subtitle={messages().about.subtitle}>
      <section ref={shellRef} class="about-shell" aria-label={messages().about.ariaSection}>
        <div class="about-track">
          <For each={messages().aboutPanels}>
            {(panel) => (
              <InfoPanel heading={panel.heading}>
                <p>{panel.text}</p>
              </InfoPanel>
            )}
          </For>
        </div>
      </section>
    </PageFrame>
  );
}
