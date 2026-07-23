import { For, Show, createMemo } from "solid-js";
import BaseDialog from "./BaseDialog";
import { getPhotoExifEntries, toMediaUrl, type Photo } from "../../pages/PortfolioShared";

type PhotoViewerProps = {
	open: boolean;
	photo: Photo | null;
	galleryTitle: string;
	onClose: () => void;
};

export default function PhotoViewer(props: PhotoViewerProps) {
	const exifEntries = createMemo(() => getPhotoExifEntries(props.photo?.exif));
	const titleId = createMemo(() =>
		props.photo ? `photo-viewer-title-${props.photo.id}` : "photo-viewer-title"
	);

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

					return (
						<div class="photo-viewer-layout">
							<figure class="photo-viewer-media">
								<img src={toMediaUrl(photo.fileUrl)} alt={photo.title} loading="eager" />
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
