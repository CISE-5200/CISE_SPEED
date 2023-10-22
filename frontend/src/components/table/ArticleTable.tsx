import SortableTable, {DisplayFunction} from "./SortableTable";

export interface ArticlesInterface {
	_id?: string;	
	title: string;
	authors: string;
	journal: string;
	pubYear: string;
	source: string;
	doi: string;
	participant: string;
	method: string;
	claim: string;
	result: string;
	researchType: string;
	abstract: string;
	type: string;
}

export type ArticlesProps = {
	articles: ArticlesInterface[];
};

export type QueryFunction = (object: any) => boolean;

const ArticleTable = (props: {articles: ArticlesInterface[] | undefined, actions?: { label?: string; action: any; }[], query?: QueryFunction}) => {
	const { articles, actions, query } = props;
	
	const headers: { key: keyof ArticlesInterface; label: string; display?: DisplayFunction | undefined }[] = [
		{ key: "title", label: "Title" },
		{ key: "authors", label: "Authors", display: (authors: string[]) => authors.join(", ") },
		{ key: "journal", label: "Journal" },
		{ key: "pubYear", label: "Year" },
		{ key: "source", label: "Source" },
		{ key: "doi", label: "DOI" },
		{ key: "participant", label: "Participant" },
		{ key: "method", label: "Method" },
		{ key: "claim", label: "Claim" },
		{ key: "result", label: "Result" },
		{ key: "researchType", label: "Research Type" },
		{ key: "abstract", label: "Abstract" },
		{ key: "type", label: "Type" }
	];

	const filteredArticles = articles?.filter((article) => query === undefined || query(article));

	if(filteredArticles !== undefined && filteredArticles.length > 0)
	{
		return (
			<div className="container">
				<SortableTable headers={headers} data={filteredArticles} actions={actions}/>
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