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

function verifyPlan(data) {
	// No flashcards
	if (data.length === 0) return true;
	data = data[0];

	if (data.plan === "free" && data.count < 5) return true;
	else if (data.plan === "basic" && data.count < 20) return true;
	else if (data.plan === "premium" && data.count < 40) return true;
	else return false;
}

export async function POST(req) {
	const user_id = checkAuthState();

	/* CREATE VIEW user_count AS
  			SELECT COUNT(*) AS COUNT, u.id, u.plan FROM flashcards f, users u
			where u.id=f.user_id GROUP BY u.id;
	*/
	const countTable = await supabase
		.from("user_count")
		.select()
		.eq("id", user_id);

	const isVerified = countTable.data ? verifyPlan(countTable.data) : false;
	if (!isVerified) {
		return NextResponse.json(
			{ error: "Plan limit exceeded." },
			{ status: 403, statusText: "Plan limit exceeded" }
		);
	}

	// save flashcards
	const { name, items } = await req.json();
	const { data, error } = await supabase
		.from("flashcards")
		.upsert([{ user_id, name, items }])
		.select();

	if (error) return NextResponse.json(error);
	return NextResponse.json(data);
}
