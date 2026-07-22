import { type ParentProps } from "solid-js";
import TopNavBar from "./TopNavBar";

type PageFrameProps = ParentProps<{
  title: string;
  subtitle: string;
}>;

export default function PageFrame(props: PageFrameProps) {
  return (
    <main class="page">
      <TopNavBar title={props.title} subtitle={props.subtitle} />
      {props.children}
      <footer class="site-footer">
        <p>Copyright © 2026 Casper Photography. All rights reserved.</p>
      </footer>
    </main>
  );
}