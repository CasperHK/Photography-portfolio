import { type ParentProps } from "solid-js";
import { Motion } from "solid-motionone";
import { useI18n } from "../i18n/context";
import { getPageLoadMotion } from "../pages/PortfolioShared";

type PageFrameProps = ParentProps<{
  title: string;
  subtitle: string;
}>;

export default function PageFrame(props: PageFrameProps) {
  const pageLoadMotion = getPageLoadMotion();
  const { messages } = useI18n();

  return (
    <Motion.main
      class="page"
      initial={pageLoadMotion.initial}
      animate={pageLoadMotion.animate}
      exit={pageLoadMotion.exit}
      transition={pageLoadMotion.transition}
    >
      {props.children}
      <footer class="site-footer footer footer-center text-base-content/70">
        <p>{messages().footer.copyright}</p>
      </footer>
    </Motion.main>
  );
}