import { supabase } from "@/utils/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
	// const { userId } = auth();
	// if (!userId) redirect("/sign-in");

	const id = params.id;
	const { data, error } = await supabase
		.from("flashcards")
		.select()
		.eq("user_id", "user1")
		.eq("id", id);

	if (error) return new NextResponse(error);

	return new NextResponse(JSON.stringify(data ? data : []));
}

export async function PUT(req, { params }) {
	// const { userId } = auth();
	// if (!userId) redirect("/sign-in");

	const id = params.id;
	const values = await req.json();

	const { data, error } = await supabase
		.from("flashcards")
		.upsert([
			{
				id,
				user_id: "user1",
				items: values,
			},
		])
		.select();

	if (error) return new NextResponse(error);

	return new NextResponse(JSON.stringify(data ? data : []));
}

export async function DELETE(req, { params }) {
	// const { userId } = auth();
	// if (!userId) redirect("/sign-in");

	const id = params.id;
	const response = await supabase
		.from("flashcards")
		.delete()
		.eq("id", id)
		.eq("user_id", "user1");

	if (response.error) return new NextResponse(error);

	return new NextResponse(JSON.stringify(response));
}
