// shareable link page
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Flashcards() {
	const path = usePathname();

	async function get() {
		let response = await fetch("/api" + path);
		response = await response.json();

		if (response.ok) {
			console.log(response);
		}
	}

	useEffect(() => {
		get();
	}, []);

	return null;
}
