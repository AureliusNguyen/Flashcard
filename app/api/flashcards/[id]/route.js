import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
	const id = params.id;
	const { data, error } = await supabase.from("flashcards").select().eq("id", id);

	if (error) return NextResponse(error);

	return NextResponse.json(data ? data : []);
}
