"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const paymentLink = {
	basic: "https://buy.stripe.com/test_00g02tey8dwlgk8289",
	premium: "https://buy.stripe.com/test_3cs02t3Tu3VL2tidQQ",
};

export default function Home() {
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
						<Link className="btn btn-primary" href={paymentLink.basic}>
							Pay
						</Link>
					</SignedIn>
					<SignedOut>
						<p>Sign in to pay</p>
					</SignedOut>
				</div>
				<div>
					<p className="font-semibold">Premium Plan</p>
					<SignedIn>
						<Link className="btn btn-primary" href={paymentLink.premium}>
							Pay
						</Link>
					</SignedIn>
					<SignedOut>
						<p>Sign in to pay</p>
					</SignedOut>
				</div>
			</div>
		</div>
	);
}
