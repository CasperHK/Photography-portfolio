import { For, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import BaseDialog from "./BaseDialog";
import styles from "./ShareDialog.module.scss";

type ShareDialogProps = {
	open: boolean;
	shareUrl: string;
	galleryTitle: string;
	onClose: () => void;
};

type ShareAction = {
	id: string;
	label: string;
	glyph: string;
	href: string;
};

const SHARE_TITLE_ID = "share-dialog-title";

export default function ShareDialog(props: ShareDialogProps) {
	const [copyStatus, setCopyStatus] = createSignal<"idle" | "success" | "error">("idle");
	let copyStatusTimer: number | undefined;

	const clearCopyStatusTimer = () => {
		if (copyStatusTimer !== undefined) {
			window.clearTimeout(copyStatusTimer);
			copyStatusTimer = undefined;
		}
	};

	const encodedUrl = createMemo(() => encodeURIComponent(props.shareUrl));

	const shareActions = createMemo<ShareAction[]>(() => [
		{
			id: "whatsapp",
			label: "WhatsApp",
			glyph: "WA",
			href: `https://wa.me/?text=${encodedUrl()}`,
		},
		{
			id: "facebook",
			label: "Facebook",
			glyph: "F",
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl()}`,
		},
		{
			id: "threads",
			label: "Threads",
			glyph: "@",
			href: `https://www.threads.net/intent/post?text=${encodedUrl()}`,
		},
		{
			id: "x",
			label: "X",
			glyph: "X",
			href: `https://twitter.com/intent/tweet?url=${encodedUrl()}`,
		},
	]);

	const fallbackCopy = (value: string) => {
		if (typeof document === "undefined") return false;

		const textArea = document.createElement("textarea");
		textArea.value = value;
		textArea.setAttribute("readonly", "true");
		textArea.style.position = "fixed";
		textArea.style.opacity = "0";
		textArea.style.pointerEvents = "none";
		document.body.appendChild(textArea);
		textArea.select();
		textArea.setSelectionRange(0, textArea.value.length);

		let copied = false;
		try {
			copied = document.execCommand("copy");
		} catch {
			copied = false;
		}

		document.body.removeChild(textArea);
		return copied;
	};

	const handleCopyLink = async () => {
		if (!props.shareUrl) {
			setCopyStatus("error");
			return;
		}

		let copied = false;

		if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(props.shareUrl);
				copied = true;
			} catch {
				copied = fallbackCopy(props.shareUrl);
			}
		} else {
			copied = fallbackCopy(props.shareUrl);
		}

		setCopyStatus(copied ? "success" : "error");
	};

	createEffect(() => {
		if (!props.open) {
			clearCopyStatusTimer();
			setCopyStatus("idle");
			return;
		}

		if (copyStatus() === "idle") return;

		clearCopyStatusTimer();
		copyStatusTimer = window.setTimeout(() => {
			setCopyStatus("idle");
			copyStatusTimer = undefined;
		}, 1800);
	});

	onCleanup(() => {
		clearCopyStatusTimer();
	});

	return (
		<BaseDialog
			open={props.open}
			onClose={props.onClose}
			labelledBy={SHARE_TITLE_ID}
			ariaLabel={`Share ${props.galleryTitle}`}
			contentClass={styles.shareDialog}
		>
			<div class={styles.shareDialogLayout}>
				<p class={styles.shareDialogKicker}>{props.galleryTitle}</p>
				<h3 id={SHARE_TITLE_ID}>Share This Page</h3>
				<p class={styles.shareDialogDescription}>Choose where to share the current link.</p>

				<div class={styles.shareActions} aria-label="Share options">
					<button
						type="button"
						class={styles.shareAction}
						onClick={() => {
							void handleCopyLink();
						}}
						aria-label="Copy current link"
					>
						<span class={styles.shareActionGlyph} aria-hidden="true">CP</span>
						<span class={styles.shareActionLabel}>Copy Link</span>
					</button>

					<For each={shareActions()}>
						{(action) => (
							<a
								class={styles.shareAction}
								href={action.href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`Share to ${action.label}`}
							>
								<span class={styles.shareActionGlyph} aria-hidden="true">{action.glyph}</span>
								<span class={styles.shareActionLabel}>{action.label}</span>
							</a>
						)}
					</For>
				</div>

				<p class={styles.shareCopyStatus} aria-live="polite">
					{copyStatus() === "success" ? "Link copied to clipboard." : ""}
					{copyStatus() === "error" ? "Could not copy link. Please copy from the address bar." : ""}
				</p>
			</div>
		</BaseDialog>
	);
}
