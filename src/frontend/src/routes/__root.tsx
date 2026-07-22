import { Outlet, createRootRoute, useLocation } from "@tanstack/solid-router";
import { Motion, Presence } from "solid-motionone";
import TopNavBar from "../components/TopNavBar";
import { getPageLoadMotion } from "../pages/PortfolioShared";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const pageLoadMotion = getPageLoadMotion();

  return (
    <>
      <TopNavBar />
      <Presence exitBeforeEnter>
        <Motion.div
          key={location.pathname}
          class="route-motion-layer"
          initial={pageLoadMotion.initial}
          animate={pageLoadMotion.animate}
          exit={pageLoadMotion.exit}
          transition={pageLoadMotion.transition}
        >
          <Outlet />
        </Motion.div>
      </Presence>
    </>
  );
}