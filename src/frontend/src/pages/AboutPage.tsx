import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import AboutToolsDialog from "../components/dialogs/AboutToolsDialog";
import InfoPanel from "../components/InfoPanel";
import PageFrame from "../components/PageFrame";
import { useI18n } from "../i18n/context";

export default function AboutPage() {
  const { messages } = useI18n();
  const [isToolsDialogOpen, setIsToolsDialogOpen] = createSignal(false);
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
                <Show when={panel.secondaryText}>
                  <p>{panel.secondaryText}</p>
                </Show>
                <Show when={panel.id === "tools"}>
                  <button
                    type="button"
                    class="gallery-share-trigger about-tools-trigger"
                    aria-label={messages().about.toolsDialog.triggerAria}
                    onClick={() => setIsToolsDialogOpen(true)}
                  >
                    {messages().about.toolsDialog.triggerLabel}
                  </button>
                </Show>
              </InfoPanel>
            )}
          </For>
        </div>
      </section>
      <AboutToolsDialog
        open={isToolsDialogOpen()}
        onClose={() => setIsToolsDialogOpen(false)}
        ariaLabel={messages().about.toolsDialog.ariaLabel}
        title={messages().about.toolsDialog.title}
        description={messages().about.toolsDialog.description}
        filterLabel={messages().about.toolsDialog.filterLabel}
        filters={messages().about.toolsDialog.filters}
        itemsAria={messages().about.toolsDialog.itemsAria}
        emptyState={messages().about.toolsDialog.emptyState}
        tools={messages().about.toolsDialog.items}
      />
    </PageFrame>
  );
}
