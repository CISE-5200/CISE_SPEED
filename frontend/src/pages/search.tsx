import { useState, useEffect } from "react";
import formStyles from "../styles/Form.module.scss";
import data from "../utils/dummydata.json"; // TODO: fetch database data.
import ArticleTable, {ArticlesInterface} from "@/components/table/ArticleTable";

function onlyUnique(value: any, index: number, array: any[]) 
{
	return array.indexOf(value) === index;
}

interface MethodInterface // TODO: allow methods to be added
{
	id: string;
	name: string;
};

const methods: MethodInterface[] = [{id: 'TDD', name: 'TDD'}, {id: 'MP', name: 'Mob Programming'}, {id: 'AT', name: 'Automated Testing'}];

const SearchPage = () => {
	const [filteredArticles, setFilteredArticles] = useState<ArticlesInterface[] | null>(null);
	const [filteredArticlesByYear, setFilteredArticlesByYear] = useState<ArticlesInterface[] | null>(null);
	const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

	const onSearchFormSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
	    let formData = new FormData(event.currentTarget);
    	let formObject = Object.fromEntries(formData.entries());

		let method = formObject.method;
		setSelectedMethod(method.toString());

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
					<label htmlFor="method">Select Method:</label>
					<select id="methods" name="method" defaultValue={selectedMethod !== null ? selectedMethod : methods[0].name}>
						{methods.map((method) =>
						{
							return (
								<option key={method.id} value={method.id}>{method.name}</option>
							);
						})}
					</select>
					
					<button className={formStyles.formItem} type="submit">
						Search
					</button>
				</form>


			</div>
		
		);
	}
	else
	{
		const onYearChanged = (event: React.FormEvent<HTMLSelectElement>) =>
		{
			let value = parseInt(event.currentTarget.value);

			if(isNaN(value))
			{
				setFilteredArticlesByYear(null);
			}
			else
			{
				setFilteredArticlesByYear(filteredArticles.filter((article) => article.pubyear == parseInt(event.currentTarget.value)));
			}
		};

		const filteredArticlesYears = filteredArticles.map((article) => article.pubyear).filter(onlyUnique);

		return (
			<div className="container">
				<h1>Articles</h1>
				
				{filteredArticles !== null && filteredArticles.length > 0 && 
					<>
						<label htmlFor="pubYear">Filter by Year: </label>

						<select id="pubYear" name="pubYear" onChange={onYearChanged}>
							<option value="all">All Years</option>
							{filteredArticlesYears.sort((a, b) => a < b ? 1 : -1).map((year) =>
							{
								return (
									<option key={year} value={year}>{year}</option>
								);
							})}
						</select>
						<br/>
					</>
				}

				<ArticleTable articles={filteredArticlesByYear === null ? filteredArticles : filteredArticlesByYear}/>
				
				<form className={formStyles.dropDown} onSubmit={() => {
					setFilteredArticles(null);
					setFilteredArticlesByYear(null);
				}} action="#">
					<button className={formStyles.formItem} type="submit">
						Go Back
					</button>
				</form>
			</div>
		);
	}
};
export default SearchPage;