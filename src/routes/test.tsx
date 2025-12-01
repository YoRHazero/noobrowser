import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Galaxy from "@/components/tailwind/Galaxy";
import TailwindTest from "@/components/tailwind/TailwindTest";
import { Slider } from "@/components/ui/slider";
import { useConnectionStore } from "@/stores/connection";
export const Route = createFileRoute("/test")({
	component: RouteComponent,
});

function RouteComponent() {
	const [value, setValue] = useState([20, 80]);
	const marks = [
		{ value: 0, label: "0%" },
		{ value: 25, label: "25%" },
		{ value: 50, label: "50%" },
		{ value: 75, label: "75%" },
		{ value: 100, label: "100%" },
	];

	const handleValueChange = (newValue: number[]) => {
		setValue(newValue);
	};

	return (
		<>
			<Slider
				value={value}
				marks={marks}
				onValueChange={(details) => handleValueChange(details.value)}
			/>
			<TailwindTest />
			<div style={{ width: "100%", height: "600px", position: "relative" }}>
				<Galaxy />
			</div>
		</>
	);
}
