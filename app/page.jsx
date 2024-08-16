"use client";

import { useRef, useState } from "react";

export default function Home() {
	const [flashcards, setFlashcards] = useState([]);
	const [message, setMessage] = useState("");
	const [value, setValue] = useState("");
	const index = useRef({ start: -1, end: 1 });

	function parse(content) {
		let { start, end } = index.current;

		if (start === -1) {
			const found = content.indexOf("{");
			if (found !== -1) start = found;
			//
		} else {
			const i = content.indexOf("}", end);
			if (i !== -1) {
				end = i + 1;
				const str = content.slice(start, end);
				start = end + 1;

				try {
					const flashcard = JSON.parse(str);
					if (flashcard)
						setFlashcards((prev) => [...prev, flashcard]);
				} catch (err) {}
			}
		}

		index.current = { start, end };
	}

	async function generate(e) {
		e.preventDefault();

		index.current = { start: -1, end: 1 };
		setMessage("");
		setFlashcards([]);

		const response = await fetch("/api/generate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: value,
		});

		if (response.ok) {
			const decoder = new TextDecoder();
			const completion = response.body;

			let content = "";
			for await (let chunk of completion) {
				const text = decoder.decode(chunk);
				content = content + text;
				parse(content);
			}
			setMessage(content);
		}
	}

	return (
		<main className="w-full">
			<form
				className="flex flex-col items-center p-10 w-full gap-y-4"
				onSubmit={generate}
			>
				<textarea
					className={`textarea textarea-bordered w-full max-w-lg h-28 max-h-36 px-4 py-3
								resize-none rounded-md text-sm focus:invalid:required:textarea-error`}
					placeholder={`Planets\n\nQ: Is sun hot?\nQ: what is the temperature on sun?`}
					value={value}
					minLength={2}
					required
					onChange={(e) => setValue(e.target.value)}
				/>
				<button
					className="btn btn-primary btn-md max-w-32 rounded-md hover:bg-primary/90"
					type="submit"
				>
					Generate
				</button>
			</form>
			<div className="flex flex-wrap p-8 w-full gap-y-4">
				{flashcards.map((card, index) => (
					<div key={index} className="relative gap-4 w-52 mb-8">
						<div className="flex items-center bg-base-100 shadow-xl size-48 text-center mb-2">
							<p className="card-body whitespace-pre-line">
								{card.front}
							</p>
						</div>
						<div className="flex items-center bg-base-100 shadow-xl size-48 text-center">
							<p className="card-body whitespace-pre-line">
								{card.back}
							</p>
						</div>
					</div>
				))}
				{flashcards.length === 0 ? (
					<p className="whitespace-pre-line max-w-3xl text-center">
						{message}
					</p>
				) : (
					""
				)}
			</div>
		</main>
	);
}
