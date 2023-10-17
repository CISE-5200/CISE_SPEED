import { useState } from "react";
import formStyles from "../styles/Form.module.scss";
import data from "../utils/dummydata.json"; // TODO: fetch database data.
import ArticleTable, {ArticlesInterface} from "@/components/table/ArticleTable";

const SearchPage = () => {
	const currentYear = new Date().getFullYear();
    const [pubYear, setPubYear] = useState<number>(currentYear);
	const [filteredArticles, setFilteredArticles] = useState<ArticlesInterface[] | null>(null);

	const onSearchFormSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
	    let formData = new FormData(event.currentTarget);
    	let formObject = Object.fromEntries(formData.entries());

		let method = formObject.method;
		let pubYear = formObject.pubYear;

		let filteredArticles: ArticlesInterface[] = data.articles.filter((article) => article.pubyear === pubYear).map(article => article as ArticlesInterface);
		setFilteredArticles(filteredArticles);
	};
	
	if(filteredArticles === null)
	{
		return(
			<div className ="container">
				<h1>Search for Articles</h1>
				<form className={formStyles.dropDown} onSubmit={onSearchFormSubmit} action="#">
					<label htmlFor="method">Select Method:</label>
					<select id="methods" name="method">
						<option value="TDD">TDD</option>
						<option value="Mob Programming">Mob Programming</option>
						<option value="Automated Testing">Automated Testing</option>
					</select>

					<label htmlFor="year">Select Publication Year:</label>
					<input
						className={formStyles.formItem}
						type="number"
						name="pubYear"
						id="pubYear"
						value={pubYear}
						onChange={(event) => {
							const val = event.target.value;
							if (val === "") {
								setPubYear(currentYear);
							} else {
								setPubYear(parseInt(val));
							}
						}}
					/>
					<button className={formStyles.formItem} type="submit">
						Submit
					</button>

				</form>


			</div>
		
		);
	}
	else
	{
		return (
			<div className="container">
				<h1>Articles</h1>

				<ArticleTable articles={filteredArticles}/>
				
				<form className={formStyles.dropDown} onSubmit={() => setFilteredArticles(null)} action="#">
					<button className={formStyles.formItem} type="submit">
						Go Back
					</button>
				</form>
			</div>
		);
	}
};
export default SearchPage;