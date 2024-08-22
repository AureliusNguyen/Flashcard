import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const price = {
	basic: 10 * 100,
	premium: 20 * 100,
};

export async function GET(req) {
	const searchParams = req.nextUrl.searchParams;
	const session_id = searchParams.get("session_id");

	try {
		const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
		return NextResponse.json(checkoutSession);
	} catch (error) {
		console.error("Error retrieving checkout session:", error);
		return NextResponse.json(
			{ error: { message: error.message } },
			{ status: 500 }
		);
	}
}

export async function POST(req) {
	const searchParams = req.nextUrl.searchParams;
	const plan = searchParams.get("plan");

	const params = {
		mode: "payment",
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: plan === "basic" ? "Basic Plan" : "Premium Plan",
					},
					unit_amount: price[plan],
				},
				quantity: 1,
			},
		],
		success_url: `${req.headers.get("origin")}/result?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${req.headers.get("origin")}/result?session_id={CHECKOUT_SESSION_ID}`,
	};

	try {
		const checkoutSession = await stripe.checkout.sessions.create(params);
		return NextResponse.json(checkoutSession, {
			status: 200,
		});
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return NextResponse.json(
			{ error: { message: error.message } },
			{ status: 500 }
		);
	}
}
