"use client";

import Cards from "@/components/Cards";
import { useEffect, useState } from "react";

export default function Flashcards() {
	const [flashcards, setFlashcards] = useState([]);
	const [flashcard, setFlashcard] = useState({});
	const path = window.location.href;

	async function get() {
		let response = await fetch("/api/flashcards");

		if (response.ok) {
			response = await response.json();
			setFlashcards(response);
		}
	}

	useEffect(() => {
		get();
	}, []);

	const handleChange = (id) => {
		const card = flashcards.find((card) => card.id === id);
		setFlashcard(card);
	};

	return (
		<div className="flex flex-col items-center p-4 pt-6 md:p-8 bg-base-200 gap-y-4">
			<div className="text-3xl font-bold">{flashcard.name}</div>

			<div className="flex gap-x-6">
				<div className="dropdown dropdown-bottom">
					<label tabIndex={0} className="btn btn-primary border mb-1 rounded-lg">
						{flashcard.name ? flashcard.name : "Select flashcard"}
						<svg
							width="12px"
							height="12px"
							className="h-2 w-2 fill-current opacity-60 inline-block"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 2048 2048"
						>
							<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
						</svg>
					</label>
					<ul
						tabIndex={0}
						className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box rounded-lg w-52"
					>
						{flashcards.map((card) => (
							<li key={card.id}>
								<input
									id={card.id}
									type="radio"
									className="btn btn-sm btn-ghost justify-start w-full rounded-lg"
									aria-label={card.name}
									value={card.name}
									checked={card.id === flashcard.id}
									onChange={() => handleChange(card.id)}
								/>
							</li>
						))}
					</ul>
				</div>
				{Object.keys(flashcard).length > 0 && (
					<div className="tooltip" data-tip="Copy link">
						<button
							className="btn btn-primary rounded-lg"
							onClick={() => {
								navigator?.clipboard?.writeText(path + "/" + flashcard.id);
							}}
						>
							Share
						</button>
					</div>
				)}
			</div>

			<div className="container mx-auto mt-2 min-h-[75dvh]">
				<div className="w-full">
					{Object.keys(flashcard).length > 0 && flashcard.items && (
						<Cards flashcards={flashcard.items} />
					)}
				</div>
			</div>
		</div>
	);
}
