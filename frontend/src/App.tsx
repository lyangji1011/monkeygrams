import { useLayoutEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Bananas from "./components/Bananas";
import HomePageButtons from "./components/HomePageButtons";
import Room from "./pages/Room";

function App() {
	// Force user to top of page on reload
	useLayoutEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="page">
			<Routes>
				<Route
					path="/"
					element={
						<>
							<Bananas />
							<div className="title">
								<h1>MonkeyGrams</h1>
								<p>
									<em>By Lauren and Lucian</em>
								</p>
							</div>
							<HomePageButtons />
						</>
					}
				/>
				<Route path="/rooms/:roomCode" element={<Room />} />
			</Routes>
		</div>
	);
}

export default App;
