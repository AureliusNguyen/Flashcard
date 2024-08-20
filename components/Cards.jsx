import Card from "./Card";

export default function Cards({ flashcards, handleDelete }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
			{flashcards.map((card, index) => (
				<Card
					key={index}
					card={card}
					handleDelete={handleDelete}
					index={index}
				/>
			))}
		</div>
	);
}
