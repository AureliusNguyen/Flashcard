// shareable link page
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Flashcards() {
	const [flashcard, setFlashcard] = useState({});
	const path = usePathname();

	const handleFlip = (index) => {
		const items = flashcard.items.map((card, i) =>
			i === index ? { ...card, flipped: !card.flipped } : card
		);
		setFlashcard({ ...flashcard, items });
	};

	async function get() {
		let response = await fetch("/api" + path);

		if (response.ok) {
			response = await response.json();
			setFlashcard(response.length > 0 ? response[0] : []);
		}
	}

	useEffect(() => {
		get();
	}, []);

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
			{Object.keys(flashcard).length > 0 &&
				flashcard.items?.map((card, index) => (
					<div
						className="flex justify-center perspective-1000"
						key={index}
					>
						<div
							className={`card w-full h-64 shadow-xl cursor-pointer transition-all duration-500 preserve-3d hover:shadow-2xl ${card.flipped ? "rotate-y-180" : ""}`}
							onClick={() => handleFlip(index)}
						>
							<div className="absolute w-full h-full backface-hidden">
								<div className="card-body flex flex-col justify-between h-full bg-base-100 rounded-xl p-6">
									<h2 className="card-title text-lg font-semibold mb-2">
										Question
									</h2>
									<p className="text-sm overflow-auto flex-grow">
										{card.front}
									</p>
									<div className="card-actions justify-end mt-4">
										<span className="badge badge-ghost">
											Flip
										</span>
									</div>
								</div>
							</div>
							<div className="absolute w-full h-full backface-hidden rotate-y-180">
								<div className="card-body flex flex-col justify-between h-full bg-secondary text-secondary-content rounded-xl p-6">
									<h2 className="card-title text-lg font-semibold mb-2">
										Answer
									</h2>
									<p className="text-sm overflow-auto flex-grow">
										{card.back}
									</p>
									<div className="card-actions justify-end mt-4">
										<span className="badge border-black text-white bg-black">
											Flip back
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			{Object.keys(flashcard).length === 0 ? "No flashcards" : ""}
		</div>
	);
}
