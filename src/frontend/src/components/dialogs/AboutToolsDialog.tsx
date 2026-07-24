import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import type { AboutTool, AboutToolCategory } from "../../i18n/types";
import BaseDialog from "./BaseDialog";
import styles from "./AboutToolsDialog.module.scss";

type AboutToolsDialogFilter = "all" | AboutToolCategory;

type AboutToolsDialogProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  title: string;
  description: string;
  filterLabel: string;
  filters: {
    all: string;
    camera: string;
    lens: string;
    tripods: string;
    other: string;
  };
  itemsAria: string;
  emptyState: string;
  tools: AboutTool[];
};

const TOOLS_DIALOG_TITLE_ID = "about-tools-dialog-title";

export default function AboutToolsDialog(props: AboutToolsDialogProps) {
  const [activeFilter, setActiveFilter] = createSignal<AboutToolsDialogFilter>("all");

  const normalizeCategory = (category: AboutToolCategory): AboutToolCategory => {
    if (category === "camera" || category === "lens" || category === "tripods") {
      return category;
    }

    return "other";
  };

  const filterOptions = createMemo(() => [
    { id: "all" as const, label: props.filters.all },
    { id: "camera" as const, label: props.filters.camera },
    { id: "lens" as const, label: props.filters.lens },
    { id: "tripods" as const, label: props.filters.tripods },
    { id: "other" as const, label: props.filters.other },
  ]);

  const filteredTools = createMemo(() => {
    const filter = activeFilter();
    if (filter === "all") return props.tools;

    return props.tools.filter((tool) => normalizeCategory(tool.category) === filter);
  });

  createEffect(() => {
    if (props.open) {
      setActiveFilter("all");
    }
  });

  return (
    <BaseDialog
      open={props.open}
      onClose={props.onClose}
      labelledBy={TOOLS_DIALOG_TITLE_ID}
      ariaLabel={props.ariaLabel}
      contentClass={styles.aboutToolsDialog}
    >
      <div class={styles.layout}>
        <h3 id={TOOLS_DIALOG_TITLE_ID}>{props.title}</h3>
        <p class={styles.description}>{props.description}</p>

        <div class={styles.filterRow} role="group" aria-label={props.filterLabel}>
          <For each={filterOptions()}>
            {(option) => (
              <button
                type="button"
                class={styles.filterButton}
                classList={{ [styles.isActive]: activeFilter() === option.id }}
                aria-pressed={activeFilter() === option.id}
                onClick={() => setActiveFilter(option.id)}
              >
                {option.label}
              </button>
            )}
          </For>
        </div>

        <div class={styles.toolsGrid} aria-label={props.itemsAria}>
          <Show
            when={filteredTools().length > 0}
            fallback={<p class={styles.emptyState}>{props.emptyState}</p>}
          >
            <For each={filteredTools()}>
              {(tool) => (
                <article class={styles.toolCard}>
                  <figure class={styles.toolMedia}>
                    <img src={tool.photoUrl} alt={tool.alt} loading="lazy" />
                  </figure>
                  <h4>{tool.name}</h4>
                  <p>{tool.description}</p>
                </article>
              )}
            </For>
          </Show>
        </div>
      </div>
    </BaseDialog>
  );
}
