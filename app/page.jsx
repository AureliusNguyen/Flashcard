"use client";

import Link from "next/link";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";

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

		const stripe = await getStripe();
		const { error } = await stripe.redirectToCheckout({
			sessionId: checkoutSessionJSON.id,
		});

		if (error) {
			console.warn(error.message);
		}
	};

	return (
		<div className="min-h-screen bg-base-200">
			<div className="hero min-h-[90dvh] bg-base-200">
				<div className="hero-content text-center">
					<div className="max-w-md">
						<h1 className="text-4xl leading-relaxed font-bold">
							Welcome to <br /> Flashcard Generator
						</h1>
						<p className="pt-6 pb-10">
							Generate and study flashcards with ease. Choose a plan that suits your needs and start
							learning today!
						</p>
						<Link href="/generate" className="btn btn-primary">
							Generate Flashcards
						</Link>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Free Plan */}
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h2 className="card-title">Free Plan</h2>
							<p className="text-2xl font-bold mb-4">$0/month</p>
							<ul className="list-disc list-inside mb-6">
								<li>Create up to 50 flashcards</li>
								<li>Basic study mode</li>
								<li>Limited customization options</li>
								<li>Access to community templates</li>
							</ul>
							<p className="text-sm mb-4">Perfect for casual learners and students</p>
							<div className="card-actions justify-end">
								<button className="btn btn-ghost">Current Plan</button>
							</div>
						</div>
					</div>

					{/* Basic Plan */}
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h2 className="card-title">Basic Plan</h2>
							<p className="text-2xl font-bold mb-4">$9.99/month</p>
							<ul className="list-disc list-inside mb-6">
								<li>Create up to 500 flashcards</li>
								<li>Advanced study modes</li>
								<li>More customization options</li>
								<li>Progress tracking</li>
								<li>Export flashcards to PDF</li>
							</ul>
							<p className="text-sm mb-4">Great for dedicated students and professionals</p>
							<div className="card-actions justify-end">
								<SignedIn>
									<button className="btn btn-primary" onClick={() => handleSubmit("basic")}>
										Upgrade Now
									</button>
								</SignedIn>
								<SignedOut>
									<p className="text-sm text-gray-500">Sign in to upgrade</p>
								</SignedOut>
							</div>
						</div>
					</div>

					{/* Premium Plan */}
					<div className="card bg-primary text-primary-content shadow-xl">
						<div className="card-body">
							<h2 className="card-title">Premium Plan</h2>
							<p className="text-2xl font-bold mb-4">$19.99/month</p>
							<ul className="list-disc list-inside mb-6">
								<li>Unlimited flashcards</li>
								<li>All study modes unlocked</li>
								<li>Full customization options</li>
								<li>Advanced analytics and insights</li>
								<li>Collaborative features</li>
								<li>Priority customer support</li>
								<li>AI-powered learning suggestions</li>
							</ul>
							<p className="text-sm mb-4">Ideal for power users and educational institutions</p>
							<div className="card-actions justify-end">
								<SignedIn>
									<button
										className="btn bg-base-100 text-primary"
										onClick={() => handleSubmit("premium")}
									>
										Go Premium
									</button>
								</SignedIn>
								<SignedOut>
									<p className="text-sm">Sign in to upgrade</p>
								</SignedOut>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
