import { createEffect, createSignal, onCleanup } from "solid-js";

type ScrollTopButtonProps = {
	target: HTMLElement | null;
	showAfter?: number;
	ariaLabel?: string;
};

export default function ScrollTopButton(props: ScrollTopButtonProps) {
	const [isVisible, setIsVisible] = createSignal(false);
	const [isAutoScrolling, setIsAutoScrolling] = createSignal(false);
	const [hasAppearedOnce, setHasAppearedOnce] = createSignal(false);
	let scrollAnimationFrame: number | null = null;

	createEffect(() => {
		const target = props.target;
		const threshold = props.showAfter ?? 240;

		if (!target) {
			setIsVisible(false);
			return;
		}

		const handleScroll = () => {
			setIsVisible(target.scrollTop > threshold);
		};

		handleScroll();
		target.addEventListener("scroll", handleScroll, { passive: true });

		onCleanup(() => {
			target.removeEventListener("scroll", handleScroll);
		});
	});

	const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

	const stopScrollAnimation = () => {
		if (scrollAnimationFrame !== null) {
			cancelAnimationFrame(scrollAnimationFrame);
			scrollAnimationFrame = null;
		}

		setIsAutoScrolling(false);
	};

	const animateScrollToTop = (target: HTMLElement, durationMs: number) => {
		const startTop = target.scrollTop;
		const startTime = performance.now();

		if (startTop <= 0) {
			target.scrollTop = 0;
			return;
		}

		const step = (now: number) => {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / durationMs, 1);
			const easedProgress = easeOutCubic(progress);

			target.scrollTop = Math.round(startTop * (1 - easedProgress));

			if (progress < 1 && target.scrollTop > 0) {
				scrollAnimationFrame = requestAnimationFrame(step);
				return;
			}

			target.scrollTop = 0;
			stopScrollAnimation();
		};

		setIsAutoScrolling(true);
		scrollAnimationFrame = requestAnimationFrame(step);
	};

	const scrollToTop = () => {
		const target = props.target;
		if (!target || isAutoScrolling()) {
			return;
		}

		// Scale duration by distance to keep long jumps smooth and short jumps snappy.
		const durationMs = Math.max(360, Math.min(920, target.scrollTop * 0.5));
		animateScrollToTop(target, durationMs);
	};

	onCleanup(() => {
		stopScrollAnimation();
	});

	const shouldShow = () => isVisible() || isAutoScrolling();

	createEffect(() => {
		if (shouldShow()) {
			setHasAppearedOnce(true);
		}
	});

	return (
		<button
			type="button"
			class={`scroll-top-fab ${shouldShow() ? "is-visible" : "is-hidden"} ${hasAppearedOnce() ? "has-appeared" : ""}`}
			onClick={scrollToTop}
			aria-label={props.ariaLabel ?? "Scroll to top"}
			tabIndex={shouldShow() ? 0 : -1}
			disabled={!shouldShow()}
		>
			<span class="scroll-top-fab-core" aria-hidden="true">
				<svg viewBox="0 0 24 24" role="presentation">
					<path d="M12 5.8 6.9 10.9a1 1 0 1 0 1.4 1.4l2.7-2.7V18a1 1 0 1 0 2 0V9.6l2.7 2.7a1 1 0 0 0 1.4-1.4L12 5.8z" />
				</svg>
			</span>
		</button>
	);
}
