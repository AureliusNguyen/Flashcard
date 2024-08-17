"use client";

import { useEffect } from "react";

export default function Flashcards() {
	async function get() {
		let response = await fetch("/api/flashcards");
		response = await response.json();

		if (response.ok) {
			console.log(response);
		}
	}

	useEffect(() => {
		// get();
	}, []);

	return null;
}
