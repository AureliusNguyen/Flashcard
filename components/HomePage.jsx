import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

function checkAuthState() {
	const { userId } = auth();
	return userId;
}

export default function HomePage() {
	const isAuthenticated = checkAuthState();

	return (
		<div>
			<p>Add some stuff</p>
			<Link href="/" className="btn btn-primary">
				Generate flashcards
			</Link>
			<div className="flex gap-x-4">
				<div>
					<p className="font-semibold">Free Plan</p>
				</div>
				<div>
					<p className="font-semibold">Basic Plan</p>
					{isAuthenticated ? (
						<Link
							href="https://buy.stripe.com/test_00g02tey8dwlgk8289"
							className="btn btn-primary"
						>
							Pay
						</Link>
					) : (
						"Sign in to pay"
					)}
				</div>
				<div>
					<p className="font-semibold">Premium Plan</p>
					{isAuthenticated ? (
						<Link
							href="https://buy.stripe.com/test_3cs02t3Tu3VL2tidQQ"
							className="btn btn-primary"
						>
							Pay
						</Link>
					) : (
						"Sign in to pay"
					)}
				</div>
			</div>
		</div>
	);
}
