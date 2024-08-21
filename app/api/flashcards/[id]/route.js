import { supabase } from "@/utils/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

function checkAuthState() {
	const { userId } = auth();
	if (!userId) redirect("/sign-in");
	return userId;
}

export async function GET(req, { params }) {
	const user_id = checkAuthState();

	const id = params.id;
	const { data, error } = await supabase
		.from("flashcards")
		.select()
		.eq("user_id", user_id)
		.eq("id", id);

	if (error) return NextResponse(error);

	return NextResponse.json(data ? data : []);
}
