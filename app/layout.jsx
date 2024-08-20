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

export default function RootLayout({ children }) {
	return (
		<html suppressHydrationWarning={true} lang="en">
			<ClerkProvider>
				<body>
					<ThemeProvider>
						<Navbar />
						<main>{children}</main>
					</ThemeProvider>
				</body>
			</ClerkProvider>
		</html>
	);
}
