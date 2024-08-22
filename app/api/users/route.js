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
		.from("users")
		.select("*")
		.eq("id", user_id);

	if (error) return NextResponse(error);

	return NextResponse.json(data);
}

export async function POST(req) {
	const user_id = checkAuthState();

	const values = await req.json();
	const { data, error } = await supabase
		.from("users")
		.upsert([{ id: user_id, ...values }])
		.select();

	if (error) return NextResponse.json(error);

	return NextResponse.json(data);
}
