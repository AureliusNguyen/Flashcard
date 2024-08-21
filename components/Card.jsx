import { useState } from "react";

export default function Card({ card, index, handleDelete }) {
	const [flip, setFlip] = useState(false);

	return (
		<div className="relative flex justify-center perspective-1000">
			<div
				className={`card  w-full h-64 shadow-xl cursor-pointer transition-all duration-500 
                            preserve-3d hover:shadow-2xl ${flip ? "rotate-y-180" : ""}`}
				onClick={() => setFlip(!flip)}
			>
				<div className="absolute w-full h-full backface-hidden">
					<div className="card-body flex flex-col justify-between h-full bg-base-100 rounded-xl p-6">
						<div className="flex justify-between">
							<h2 className="card-title text-lg font-semibold mb-2">
								Question
							</h2>
						</div>
						<p className="text-sm overflow-auto flex-grow">{card.front}</p>
						{handleDelete && (
							<button
								className="btn btn-error btn-sm w-fit"
								onClick={(e) => {
									e.stopPropagation();
									handleDelete(index);
								}}
							>
								Delete
							</button>
						)}
					</div>
				</div>
				<div className="absolute w-full h-full backface-hidden rotate-y-180">
					<div className="card-body flex flex-col justify-between h-full bg-secondary text-secondary-content rounded-xl p-6">
						<h2 className="card-title text-lg font-semibold mb-2">Answer</h2>
						<p className="text-sm overflow-auto flex-grow">{card.back}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
