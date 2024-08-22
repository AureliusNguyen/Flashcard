"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import getStripe from "@/utils/get-stripe";

export default function Home() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const handleSubmit = async (plan) => {
		const checkoutSession = await fetch("api/checkout_session?plan=" + plan, {
			method: "POST",
			headers: {
				origin: "",
			},
		});

		const checkoutSessionJSON = await checkoutSession.json();

		if (checkoutSession.statusCode === 500) {
			console.error(checkoutSession.message);
			return;
		}

		const stripe = await getStripe(process.env.STRIPE_SECRET_KEY);
		const { error } = await stripe.redirectToCheckout({
			sessionId: checkoutSessionJSON.id,
		});

		if (error) {
			console.warn(error.message);
		}
	};

	return (
		<div>
			<p>Add some stuff</p>
			<Link href="/generate" className="btn btn-primary">
				Generate flashcards
			</Link>
			<div className="flex gap-x-4">
				<div>
					<p className="font-semibold">Free Plan</p>
				</div>
				<div>
					<p className="font-semibold">Basic Plan</p>
					<SignedIn>
						<button
							className="btn btn-primary"
							onClick={() => handleSubmit("basic")}
						>
							Pay
						</button>
					</SignedIn>
					<SignedOut>
						<p>Sign in to pay</p>
					</SignedOut>
				</div>
				<div>
					<p className="font-semibold">Premium Plan</p>
					<SignedIn>
						<button
							className="btn btn-primary"
							onClick={() => handleSubmit("premium")}
						>
							Pay
						</button>
					</SignedIn>
					<SignedOut>
						<p>Sign in to pay</p>
					</SignedOut>
				</div>
			</div>
		</div>
	);
}
