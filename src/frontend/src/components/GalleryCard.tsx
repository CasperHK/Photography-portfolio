import { Link } from "@tanstack/solid-router";
import type { GalleryInfo } from "../i18n/types";
import styles from "./GalleryCard.module.scss";

type GalleryCardProps = {
  gallery: GalleryInfo;
  openGalleryLabel: string;
};

export default function GalleryCard(props: GalleryCardProps) {
  return (
    <Link
      class={styles.galleryCard}
      style={{ "--gallery-card-image": `url(${props.gallery.coverImageUrl})` }}
      to="/gallery/$galleryId"
      params={{ galleryId: props.gallery.id }}
    >
      <div class={styles.galleryCardContent}>
        <p class={styles.galleryCardKicker}>{props.gallery.kicker}</p>
        <h3 class={styles.galleryCardTitle}>{props.gallery.title}</h3>
        <p class={styles.galleryCardSubtitle}>{props.gallery.subtitle}</p>
        <p class={styles.galleryCardSummary}>{props.gallery.summary}</p>
        <span class={styles.galleryCardLink}>{props.openGalleryLabel}</span>
      </div>
    </Link>
  );
}