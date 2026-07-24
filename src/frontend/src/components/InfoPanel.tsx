import { type ParentProps } from "solid-js";
import styles from "./InfoPanel.module.scss";

type InfoPanelProps = ParentProps<{
  heading: string;
}>;

export default function InfoPanel(props: InfoPanelProps) {
  return (
    <article class={styles.panel}>
      <h2>{props.heading}</h2>
      {props.children}
    </article>
  );
}