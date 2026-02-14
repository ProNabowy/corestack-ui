import React from "react";
import { cn } from "../../utils";
import type { ButtonProps } from "./Button.types";

const getParentBackground = (button: HTMLButtonElement) => {
	const computedStyle = getComputedStyle(button);
	let bgColor = computedStyle.backgroundColor;

	const fallback = "rgba(0, 0, 0, 0.1)";

	try {
		const match = bgColor.match(/\d+/g);
		if (match && match.length >= 3) {
			const r = Math.max(0, parseInt(match[0]) - 30);
			const g = Math.max(0, parseInt(match[1]) - 30);
			const b = Math.max(0, parseInt(match[2]) - 30);
			const a = match[3] ? parseFloat(match[3]) : 0.3;

			return {
				bgColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
			};
		}
	} catch (err) {
		console.warn("Error parsing background color:", err);
	}

	return { bgColor: fallback };
};

function createRipple(event: React.MouseEvent<HTMLButtonElement>) {
	const button = event.currentTarget;
	const rect = button.getBoundingClientRect();

	const circle = document.createElement("span");
	const diameter = Math.max(button.clientWidth, button.clientHeight);
	const radius = diameter / 2;

	circle.style.width = circle.style.height = `${diameter}px`;
	circle.style.left = `${event.clientX - rect.left - radius}px`;
	circle.style.top = `${event.clientY - rect.top - radius}px`;
	circle.classList.add("ripple");

	const { bgColor } = getParentBackground(button);

	circle.style.backgroundColor = bgColor;

	const existingRipple = button.getElementsByClassName("ripple")[0];
	if (existingRipple) existingRipple.remove();

	button.appendChild(circle);

	const timer = setTimeout(() => {
		// circle.remove();
	}, 300);

	return () => clearTimeout(timer);
}

export function Button({
	children,
	disableRipple,
	isLoading,
	className,
	onClick,
	...props
}: ButtonProps) {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (onClick) onClick(e);

		if (!disableRipple) createRipple(e);
	};

	return (
		<button {...props} className={cn(className)} onClick={handleClick}>
			{isLoading ? (
				<svg
					aria-hidden="true"
					className="w-4 h-4 m-auto animate-spin dark:text-gray-500 fill-primary-700 dark:fill-white"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
			) : (
				children
			)}
		</button>
	);
}
