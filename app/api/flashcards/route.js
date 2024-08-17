import { supabase } from "@/utils/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
	const { userId } = auth();
	if (!userId) redirect("/sign-in");

	const { data, error } = await supabase
		.from("flashcards")
		.select("*")
		.eq("user_id", userId);

	if (error) return new NextResponse(error);

	return new NextResponse(JSON.stringify(data));
}

export async function POST(req) {
	const { userId } = auth();
	if (!userId) redirect("/sign-in");

	const values = await req.json();

	const { data, error } = await supabase
		.from("flashcards")
		.upsert([
			{
				user_id: userId,
				items: values,
			},
		])
		.select();

	if (error) return new NextResponse(error);

	return new NextResponse(JSON.stringify(data));
}
