import Popup from "@/components/popup/Popup";
import { useAuth } from "@/lib/auth";
import { NextPage } from "next";

const HomePage: NextPage = () => {
	const user = useAuth();

	return (
		<div className="container">
			{user !== undefined && user !== null && (
				<Popup message={`Welcome back, ${user.username}.`}/>
			)}

			<h1>Software Practice Empirical Evidence Database (SPEED)</h1>
		</div>
	);
}

export default HomePage;