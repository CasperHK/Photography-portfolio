import { type ParentProps } from "solid-js";
import { Motion } from "solid-motionone";
import { getPageLoadMotion } from "../pages/PortfolioShared";

type PageFrameProps = ParentProps<{
  title: string;
  subtitle: string;
}>;

export default function PageFrame(props: PageFrameProps) {
  const pageLoadMotion = getPageLoadMotion();

  return (
    <Motion.main
      class="page"
      initial={pageLoadMotion.initial}
      animate={pageLoadMotion.animate}
      exit={pageLoadMotion.exit}
      transition={pageLoadMotion.transition}
    >
      {props.children}
      <footer class="site-footer">
        <p>Copyright © 2026 Casper Photography. All rights reserved.</p>
      </footer>
    </Motion.main>
  );
}