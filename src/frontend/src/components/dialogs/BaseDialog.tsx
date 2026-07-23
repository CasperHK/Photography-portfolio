import { Show, createEffect, createSignal, onCleanup, type JSX } from "solid-js";
import { Motion } from "solid-motionone";
import { Portal } from "solid-js/web";
import { useI18n } from "../../i18n/context";

const DIALOG_ANIMATION_MS = 180;

type BaseDialogProps = {
	open: boolean;
	onClose: () => void;
	ariaLabel?: string;
	labelledBy?: string;
	contentClass?: string;
	children: JSX.Element;
};

export default function BaseDialog(props: BaseDialogProps) {
	const [isRendered, setIsRendered] = createSignal(props.open);
	const { messages } = useI18n();
	let closeTimer: number | undefined;

	const clearCloseTimer = () => {
		if (closeTimer !== undefined) {
			window.clearTimeout(closeTimer);
			closeTimer = undefined;
		}
	};

	createEffect(() => {
		if (typeof window === "undefined") return;

		clearCloseTimer();

		if (props.open) {
			setIsRendered(true);

			return;
		}

		if (!isRendered()) {
			return;
		}

		closeTimer = window.setTimeout(() => {
			setIsRendered(false);
		}, DIALOG_ANIMATION_MS);

		onCleanup(() => {
			clearCloseTimer();
		});
	});

	createEffect(() => {
		if (!isRendered() || typeof window === "undefined") return;

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
		<Show when={isRendered()}>
			<Portal>
					<Motion.div
						class="dialog-backdrop"
						role="presentation"
						onClick={handleBackdropClick}
						initial={{ opacity: 0 }}
						animate={{ opacity: props.open ? 1 : 0 }}
						transition={{ duration: DIALOG_ANIMATION_MS / 1000, easing: [0.2, 0.8, 0.2, 1] }}
					>
						<Motion.section
							class={`dialog-panel ${props.contentClass ?? ""}`.trim()}
							role="dialog"
							aria-modal="true"
							aria-label={props.ariaLabel}
							aria-labelledby={props.labelledBy}
							initial={{ opacity: 0, y: 16, scale: 0.98 }}
							animate={props.open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.98 }}
							transition={{ duration: DIALOG_ANIMATION_MS / 1000, easing: [0.2, 0.8, 0.2, 1] }}
						>
						<button
							type="button"
							class="dialog-close-button"
							aria-label={messages().baseDialog.closeAria}
							onClick={props.onClose}
						>
							×
						</button>
						{props.children}
						</Motion.section>
					</Motion.div>
			</Portal>
		</Show>
	);
}
