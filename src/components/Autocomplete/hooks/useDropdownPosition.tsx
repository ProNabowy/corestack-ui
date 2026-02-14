import { RefObject, useLayoutEffect, useState } from "react";

export type AnchorElement = Element | null | (() => Element | null) | undefined;

export interface DropdownPosition {
	top: number;
	left: number;
	width: number;
	placement: "bottom" | "top";
}

const MARGIN = 16;

export default function useDropdownPosition(
	anchor: AnchorElement,
	menuRef: RefObject<HTMLElement | null>
): { position: DropdownPosition | null } {
	const [position, setPosition] = useState<DropdownPosition | null>(null);

	useLayoutEffect(() => {
		let mounted = true;
		let ro: ResizeObserver | null = null;
		let rafId: number | null = null;
		let stopPolling = false;

		function getAnchor(): Element | null {
			if (!anchor) return null;
			return typeof anchor === "function" ? anchor() : (anchor ?? null);
		}

		function calc(menu: HTMLElement, a: Element): DropdownPosition {
			const aRect = a.getBoundingClientRect();
			const mRect = menu.getBoundingClientRect();

			const vw = window.innerWidth;
			const vh = window.innerHeight;

			let placement: DropdownPosition["placement"] = "bottom";
			let top = Math.round(aRect.bottom);

			if (aRect.bottom + mRect.height + MARGIN > vh) {
				placement = "top";
				top = Math.round(aRect.top - (mRect.height + MARGIN));
			}

			let left = Math.round(aRect.left);
			const width = Math.round(aRect.width);

			if (left + width + MARGIN > vw) {
				left = Math.max(MARGIN, vw - width - MARGIN);
			}

			return { top, left, width, placement };
		}

		function scheduleUpdate(menu: HTMLElement, a: Element) {
			if (rafId != null) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				if (!mounted) return;
				const next = calc(menu, a);
				setPosition((prev) => {
					if (
						!prev ||
						prev.top !== next.top ||
						prev.left !== next.left ||
						prev.width !== next.width ||
						prev.placement !== next.placement
					) {
						return next;
					}
					return prev;
				});
			});
		}

		function setupForMenu(menu: HTMLElement) {
			const a = getAnchor();
			if (!a) return;

			// Initial synchronous calculation before paint
			const initial = calc(menu, a);
			if (mounted)
				setPosition((prev) => {
					if (
						!prev ||
						prev.top !== initial.top ||
						prev.left !== initial.left ||
						prev.width !== initial.width ||
						prev.placement !== initial.placement
					) {
						return initial;
					}
					return prev;
				});

			// observe size changes of menu
			ro = new ResizeObserver(() => scheduleUpdate(menu, a));
			ro.observe(menu);
		}

		// Wait until menuRef.current is available. Do not include menuRef.current in deps.
		let cleanupFn: (() => void) | null = null;
		(function waitForMenu() {
			const menu = menuRef.current;
			if (menu) {
				setupForMenu(menu);
				// attach global listeners
				const onScroll = () => {
					const a = getAnchor();
					if (!a || !menu) return;
					scheduleUpdate(menu, a);
				};

				const onResize = () => {
					const a = getAnchor();
					if (!a || !menu) return;
					scheduleUpdate(menu, a);
				};

				window.addEventListener("scroll", onScroll, true);
				window.addEventListener("resize", onResize);

				// cleanup handler closure
				cleanupFn = () => {
					if (ro) {
						ro!.disconnect();
						ro = null;
					}
					if (rafId != null) {
						cancelAnimationFrame(rafId);
						rafId = null;
					}
					window.removeEventListener("scroll", onScroll, true);
					window.removeEventListener("resize", onResize);
				};

				return;
			}

			if (stopPolling) return;
			requestAnimationFrame(waitForMenu);
		})();

		return () => {
			mounted = false;
			stopPolling = true;
			if (cleanupFn) cleanupFn();
		};
	}, [anchor, menuRef]);

	return { position };
}
