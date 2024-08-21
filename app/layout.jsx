import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import Navbar from "./navbar";
import { ThemeProvider } from "next-themes";
import HomePage from "@/components/HomePage";

export default function RootLayout({ children }) {
	return (
		<html suppressHydrationWarning={true} lang="en">
			<ClerkProvider>
				<body>
					<ThemeProvider>
						{/* All private pages except below homepage and /flashcards/:id */}

						<Navbar />
						<main>{children}</main>

						{/* Default homepage on visit - public */}
						{/* <HomePage /> */}
					</ThemeProvider>
				</body>
			</ClerkProvider>
		</html>
	);
}
