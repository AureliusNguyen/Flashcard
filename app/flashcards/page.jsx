"use client";

import Cards from "@/components/Cards";
import { useEffect, useState } from "react";

export default function Flashcards() {
	const [flashcards, setFlashcards] = useState([]);
	const [flashcard, setFlashcard] = useState({
		id: "Select flashcard",
	});

	async function get() {
		let response = await fetch("/api/flashcards");

		if (response.ok) {
			response = await response.json();
			setFlashcards([...response]);
		}
	}

	useEffect(() => {
		get();
	}, []);

	const handleClick = (id) => {
		const card = flashcards.find((card) => card.id === id);

		setFlashcard(card);
	};

	const handleDelete = async () => {
		const response = await fetch("/api/flashcards/" + flashcard.id, {
			method: "DELETE",
		});
		if (response.ok) {
			setFlashcard({ id: "Select flashcard" });
			get();
		}
	};

	return (
		<div className="w-full">
			<h2>My flashcards</h2>

			<div className="dropdown">
				<div tabIndex={0} role="button" className="btn mr-1 w-80">
					{flashcard.id}
				</div>
				<ul
					tabIndex={0}
					className="dropdown-content menu bg-base-100 rounded-box z-[1] w-80 p-2 shadow gap-y-4"
				>
					{flashcards.map((card) => (
						<p
							key={card.id}
							className="cursor-pointer"
							onClick={() => handleClick(card.id)}
						>
							{card.name}
						</p>
					))}
				</ul>
			</div>

			<div className="tooltip" data-tip="Copy link">
				<button
					className="btn"
					onClick={() => {
						navigator.clipboard.writeText(
							"http://localhost:3000/flashcards/" + flashcard.id
						);
					}}
				>
					Share
				</button>
			</div>

			<div className="container mx-auto mt-4">
				<div className="w-full">
					{Object.keys(flashcard).length > 0 && flashcard.items && (
						<>
							<Cards flashcards={flashcard.items} handleDelete={() => null} />
							<button className="btn btn-error" onClick={handleDelete}>
								Delete
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
