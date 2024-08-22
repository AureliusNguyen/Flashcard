import { loadStripe } from "@stripe/stripe-js";
import { env } from "./secrets";

let stripePromise;
const getStripe = () => {
	if (!stripePromise) {
		stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
	}

	return stripePromise;
};

export default getStripe;
