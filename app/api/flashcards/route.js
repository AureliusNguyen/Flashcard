import { supabase } from "@/utils/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

function checkAuthState() {
	const { userId } = auth();
	if (!userId) redirect("/");
	return userId;
}

export async function GET() {
	const user_id = checkAuthState();

	const { data, error } = await supabase
		.from("flashcards")
		.select("*")
		.eq("user_id", user_id);

	if (error) return NextResponse(error);

	return NextResponse.json(data);
}

export async function POST(req) {
	const user_id = checkAuthState();

	const { name, items } = await req.json();
	const { data, error } = await supabase
		.from("flashcards")
		.upsert([{ user_id, name, items }])
		.select();

	if (error) return NextResponse.json(error);

	return NextResponse.json(data);
}
