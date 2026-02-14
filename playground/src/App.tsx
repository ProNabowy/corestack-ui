import { Autocomplete, Button, TextField } from "../../dist";
import "./App.css";

function App() {
	const t = (string: any) => string;
	const brands = [
		{
			name: "nabowy",
			id: 1,
		},
	];
	return (
		<>
			<Button className="flex flex-row items-center gap-2 bg-primary-700 py-2.5  leading-[24px] px-13 text-white rounded-full text-nowrap w-full justify-center !font-semibold">
				{"get_it_now"}
			</Button>

			<TextField
				placeholder={t("phone_number")}
				name="phone"
				label={t("phone_number")}
				required
			/>

			<Autocomplete
				options={brands}
				getOptionLabel={(brand) => brand.name}
				renderInput={(params) => (
					<TextField {...params} placeholder={t("brand")} />
				)}
			/>
		</>
	);
}

export default App;

