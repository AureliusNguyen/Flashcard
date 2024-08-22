"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
	const searchParams = new URLSearchParams(window.location.search);
	const session_id = searchParams.get("session_id");

	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCheckoutSession = async () => {
			if (!session_id) return;

			try {
				const res = await fetch(
					`/api/checkout_session?session_id=${session_id}`
				);
				const sessionData = await res.json();

				if (res.ok) {
					setSession(sessionData);
				} else {
					// Handle error messages
					const errorMessage =
						typeof sessionData.error === "object"
							? sessionData.error.message || "An unknown error occurred."
							: sessionData.error || "An unknown error occurred.";
					setError(errorMessage);
				}
			} catch (err) {
				setError("An error occurred while fetching the checkout session.");
			} finally {
				setLoading(false);
			}
		};

		fetchCheckoutSession();
	}, [session_id]);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary"></div>
				<p className="text-xl mt-4">Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<p className="text-xl text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			{session?.payment_status === "paid" ? (
				<>
					<h1 className="text-3xl font-bold mb-4">
						Thank you for your purchase
					</h1>
					<div className="bg-gray-100 p-4 rounded-lg">
						<p className="text-lg">Session ID: {session_id}</p>
						<p className="text-base mt-2">
							We have received your payment. You will receive an email with the
							order details shortly.
						</p>
					</div>
				</>
			) : (
				<>
					<h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
					<div className="bg-gray-100 p-4 rounded-lg">
						<p className="text-lg">Session ID: {session_id}</p>
						<p className="text-base mt-2">
							Your payment was not successful. Please try again.
						</p>
					</div>
				</>
			)}
		</div>
	);
}
