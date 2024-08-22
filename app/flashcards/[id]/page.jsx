// shareable link page
"use client";

import Cards from "@/components/Cards";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Flashcards() {
	const [flashcard, setFlashcard] = useState([]);
	const path = usePathname();

	async function get() {
		let response = await fetch("/api" + path);

		if (response.ok) {
			response = await response.json();
			setFlashcard(response.length > 0 ? response : []);
		}
	}

	useEffect(() => {
		get();
	}, []);

	return (
		<div>{flashcard.length > 0 ? <Cards flashcards={flashcard[0]?.items} /> : "No flashcard"}</div>
	);
}
