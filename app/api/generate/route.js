import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content.
Follow these guidlines,
1. Create a clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use a simple language to make the flashcards to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisions, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level  of the flashcards to the user's specified preference.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Generate a maximum of 10 flashcards.

Remember the goal is to facilitate effective learning and retension of information through these flashcards.

Return in the following JSON format
[
    {
        "front": string,
        "back": string
    }
}
`;

export async function POST(req) {
	const data = await req.text();

	const groq = new Groq();
	const completion = await groq.chat.completions.create({
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: data },
		],

		model: "llama3-8b-8192",
		temperature: 0.5,
		max_tokens: 1024,
		stream: true,
	});

	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();
			try {
				for await (let chunk of completion) {
					const content = chunk.choices[0]?.delta?.content || "";
					if (content) {
						controller.enqueue(encoder.encode(content));
					}
				}
			} catch (err) {
				controller.error(err);
			} finally {
				controller.close();
			}
		},
	});

	return new NextResponse(stream);
}
