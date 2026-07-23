import { For, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import BaseDialog from "./BaseDialog";
import { getPhotoExifEntries, toMediaUrl, type Photo } from "../../pages/PortfolioShared";

type PhotoViewerProps = {
	open: boolean;
	photo: Photo | null;
	galleryTitle: string;
	onClose: () => void;
};

export default function PhotoViewer(props: PhotoViewerProps) {
	const MIN_SPINNER_MS = 450;
	const exifEntries = createMemo(() => getPhotoExifEntries(props.photo?.exif));
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
			ariaLabel={props.photo ? `Photo detail: ${props.photo.title}` : `${props.galleryTitle} photo detail`}
			contentClass="photo-viewer-dialog"
		>
			<Show when={props.photo}>
				{(photoAccessor) => {
					const photo = photoAccessor();
					const photoUrl = toMediaUrl(photo.fileUrl);

					return (
						<div class="photo-viewer-layout">
							<figure class="photo-viewer-media" aria-busy={isImageLoading()}>
								<Show when={isImageLoading()}>
									<div class="photo-viewer-loading" aria-live="polite" aria-label="Loading photo">
										<span
											class="loading loading-spinner loading-lg text-primary photo-viewer-spinner"
											aria-hidden="true"
										/>
									</div>
								</Show>
								<img
									src={photoUrl}
									alt={photo.title}
									loading="eager"
									classList={{ "photo-viewer-image-loading": isImageLoading() }}
									onLoad={resolveImageLoading}
									onError={resolveImageLoading}
									ref={(image) => {
										if (image.complete) {
											resolveImageLoading();
										}
									}}
								/>
							</figure>

							<section class="photo-viewer-info">
								<p class="photo-viewer-kicker">{props.galleryTitle}</p>
								<h3 id={titleId()}>{photo.title}</h3>
								<Show when={photo.description?.trim()}>
									<p class="photo-viewer-description">{photo.description}</p>
								</Show>

								<Show when={exifEntries().length > 0}>
									<div class="photo-viewer-metadata" aria-label="Photo metadata">
										<h4>EXIF Metadata</h4>
										<dl>
											<For each={exifEntries()}>
												{(entry) => (
													<div class="photo-viewer-metadata-row">
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
