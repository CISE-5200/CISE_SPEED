import { useState, useEffect } from "react";
import formStyles from "../styles/Form.module.scss";
import data from "../utils/dummydata.json"; // TODO: fetch database data.
import ArticleTable, {ArticlesInterface} from "@/components/table/ArticleTable";

const SearchPage = () => {
	const currentYear = new Date().getFullYear();
    const [pubYear, setPubYear] = useState<number>(currentYear);
	const [filteredArticles, setFilteredArticles] = useState<ArticlesInterface[] | null>(null);
	const [filteredArticlesByYear, setFilteredArticlesByYear] = useState<ArticlesInterface[] | null>(null);

	const onSearchFormSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
	    let formData = new FormData(event.currentTarget);
    	let formObject = Object.fromEntries(formData.entries());

		let method = formObject.method;
		let pubYear = formObject.pubYear;

		let filteredArticles: ArticlesInterface[] = data.articles.filter((article) => article.method === method).map(article => article as ArticlesInterface);
		setFilteredArticles(filteredArticles);
	};

	// TODO: change pub year input to select box and get all distinct years and map to dropbox entry HTML. Have a "All Years" option too.

	if(filteredArticles === null)
	{
		return(
			<div className ="container">
				<h1>Search for Articles</h1>
				<form className={formStyles.dropDown} onSubmit={onSearchFormSubmit} action="#">
					<table style="border-collapse: collapse;">
						<tr>
							<th>Select method</th>
							<th>Filter results by Year</th>
						</tr>
						<tr>
							<td>
								<select id="methods" name="method" onChange={this.form.submit()}>
									<option value="TDD">TDD</option>
									<option value="Mob Programming">Mob Programming</option>
									<option value="Automated Testing">Automated Testing</option>
								</select>
							</td>
							<td>
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
										setFilteredArticlesByYear(null);
									} else {
										setPubYear(parseInt(val));
										setFilteredArticlesByYear(filteredArticles.filter((article) => article.pubYear === pubYear));
									}
								}}
								/>
							</td>
						</tr>
					</table>
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