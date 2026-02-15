import { Autocomplete, TextField } from "../../dist";
import "./App.css";

function App() {
	const t = (string: string) => string;
	const brands = new Array(100)
		.fill(null)
		.map((_, index) => ({ name: `Brand ${index + 1}` }));

	return (
		<div className="w-[300px] m-auto mt-10">
			{/* <Button className="flex flex-row items-center gap-2 bg-primary-700 py-2.5  leading-6 px-13 text-white rounded-full text-nowrap w-full justify-center !font-semibold">
				{"get_it_now"}
			</Button>

			<TextField
				placeholder={t("phone_number")}
				name="phone"
				label={t("phone_number")}
				required
			/> */}

			<Autocomplete
				options={brands}
				multiple
				getOptionLabel={(brand) => brand.name}
				renderInput={(params) => (
					<TextField {...params} placeholder={t("brand")} />
				)}
			/>
		</div>
	);
}

export default App;
