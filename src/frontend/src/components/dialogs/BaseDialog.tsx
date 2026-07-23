import { Show, createEffect, onCleanup, type JSX } from "solid-js";
import { Portal } from "solid-js/web";

type BaseDialogProps = {
	open: boolean;
	onClose: () => void;
	ariaLabel?: string;
	labelledBy?: string;
	contentClass?: string;
	children: JSX.Element;
};

export default function BaseDialog(props: BaseDialogProps) {
	createEffect(() => {
		if (!props.open || typeof window === "undefined") return;

		const originalOverflow = document.body.style.overflow;
		const originalPaddingRight = document.body.style.paddingRight;
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

		document.body.style.overflow = "hidden";
		if (scrollbarWidth > 0) {
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				props.onClose();
			}
		};

		window.addEventListener("keydown", onKeyDown);

		onCleanup(() => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = originalOverflow;
			document.body.style.paddingRight = originalPaddingRight;
		});
	});

	const handleBackdropClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (event) => {
		if (event.target === event.currentTarget) {
			props.onClose();
		}
	};

	return (
		<Show when={props.open}>
			<Portal>
				<div class="dialog-backdrop" role="presentation" onClick={handleBackdropClick}>
					<section
						class={`dialog-panel ${props.contentClass ?? ""}`.trim()}
						role="dialog"
						aria-modal="true"
						aria-label={props.ariaLabel}
						aria-labelledby={props.labelledBy}
					>
						<button
							type="button"
							class="dialog-close-button"
							aria-label="Close dialog"
							onClick={props.onClose}
						>
							×
						</button>
						{props.children}
					</section>
				</div>
			</Portal>
		</Show>
	);
}
