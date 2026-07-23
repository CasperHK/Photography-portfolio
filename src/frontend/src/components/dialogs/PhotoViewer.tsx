import { For, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import BaseDialog from "./BaseDialog";
import { useI18n } from "../../i18n/context";
import { getPhotoExifEntries, toMediaUrl, type Photo } from "../../pages/PortfolioShared";
import styles from "./PhotoViewer.module.scss";

type PhotoViewerProps = {
	open: boolean;
	photo: Photo | null;
	galleryTitle: string;
	onClose: () => void;
};

export default function PhotoViewer(props: PhotoViewerProps) {
	const MIN_SPINNER_MS = 450;
	const { messages } = useI18n();
	const exifEntries = createMemo(() => getPhotoExifEntries(props.photo?.exif, messages().exifLabels));
	const titleId = createMemo(() =>
		props.photo ? `photo-viewer-title-${props.photo.id}` : "photo-viewer-title"
	);
	const [isImageLoading, setIsImageLoading] = createSignal(false);
	const [spinnerStartedAt, setSpinnerStartedAt] = createSignal(0);
	let spinnerTimer: number | undefined;

	const clearSpinnerTimer = () => {
		if (spinnerTimer !== undefined) {
			window.clearTimeout(spinnerTimer);
			spinnerTimer = undefined;
		}
	};

	const resolveImageLoading = () => {
		if (typeof window === "undefined") {
			setIsImageLoading(false);
			return;
		}

		const elapsed = performance.now() - spinnerStartedAt();
		const remaining = Math.max(0, MIN_SPINNER_MS - elapsed);

		clearSpinnerTimer();
		if (remaining === 0) {
			setIsImageLoading(false);
			return;
		}

		spinnerTimer = window.setTimeout(() => {
			setIsImageLoading(false);
			spinnerTimer = undefined;
		}, remaining);
	};

	createEffect(() => {
		const shouldLoad = props.open && !!props.photo;
		clearSpinnerTimer();
		setIsImageLoading(shouldLoad);
		if (shouldLoad && typeof window !== "undefined") {
			setSpinnerStartedAt(performance.now());
		}
	});

	onCleanup(() => {
		clearSpinnerTimer();
	});

	return (
		<BaseDialog
			open={props.open && !!props.photo}
			onClose={props.onClose}
			labelledBy={titleId()}
			ariaLabel={messages().photoViewer.ariaLabel(props.photo?.title ?? "", props.galleryTitle)}
			contentClass={styles.photoViewerDialog}
		>
			<Show when={props.photo}>
				{(photoAccessor) => {
					const photo = photoAccessor();
					const photoUrl = toMediaUrl(photo.fileUrl);

					return (
						<div class={styles.photoViewerLayout}>
							<figure class={styles.photoViewerMedia} aria-busy={isImageLoading()}>
								<Show when={isImageLoading()}>
									<div
										class={styles.photoViewerLoading}
										aria-live="polite"
										aria-label={messages().photoViewer.loadingAria}
									>
										<span
											class={`loading loading-spinner loading-lg text-primary ${styles.photoViewerSpinner}`}
											aria-hidden="true"
										/>
									</div>
								</Show>
								<img
									src={photoUrl}
									alt={photo.title}
									loading="eager"
									classList={{ [styles.photoViewerImageLoading]: isImageLoading() }}
									onLoad={resolveImageLoading}
									onError={resolveImageLoading}
									ref={(image) => {
										if (image.complete) {
											resolveImageLoading();
										}
									}}
								/>
							</figure>

							<section class={styles.photoViewerInfo}>
								<p class={styles.photoViewerKicker}>{props.galleryTitle}</p>
								<h3 id={titleId()}>{photo.title}</h3>
								<Show when={photo.description?.trim()}>
									<p class={styles.photoViewerDescription}>{photo.description}</p>
								</Show>

								<Show when={exifEntries().length > 0}>
									<div class={styles.photoViewerMetadata} aria-label={messages().photoViewer.metadataAria}>
										<h4>{messages().photoViewer.metadataTitle}</h4>
										<dl>
											<For each={exifEntries()}>
												{(entry) => (
													<div class={styles.photoViewerMetadataRow}>
														<dt>{entry.label}</dt>
														<dd>{entry.value}</dd>
													</div>
												)}
											</For>
										</dl>
									</div>
								</Show>
							</section>
						</div>
					);
				}}
			</Show>
		</BaseDialog>
	);
}
