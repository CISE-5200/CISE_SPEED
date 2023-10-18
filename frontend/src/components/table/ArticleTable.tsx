import SortableTable from "./SortableTable";

export interface ArticlesInterface {
	id: string;
	title: string;
	authors: string;
	source: string;
	pubyear: number;
	doi: string;
	claim: string;
	evidence: string;
	method: string;
}

export type ArticlesProps = {
	articles: ArticlesInterface[];
};

const ArticleTable = (props: {articles: ArticlesInterface[]}) => {
	const { articles } = props;
	
	const headers: { key: keyof ArticlesInterface; label: string }[] = [
		{ key: "title", label: "Title" },
		{ key: "authors", label: "Authors" },
		{ key: "source", label: "Source" },
		{ key: "pubyear", label: "Publication Year" },
		{ key: "doi", label: "DOI" },
		{ key: "claim", label: "Claim" },
		{ key: "evidence", label: "Evidence" },
	];

	if(articles.length > 0)
	{
		return (
			<div className="container">
				<SortableTable headers={headers} data={articles}/>
			</div>
		);
	}
	else
	{
		return (
			<p>No articles found.</p>
		);
	}
};

export default ArticleTable;