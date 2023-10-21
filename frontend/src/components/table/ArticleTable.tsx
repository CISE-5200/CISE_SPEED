import SortableTable, {DisplayFunction} from "./SortableTable";

export interface ArticlesInterface {	
	title: string;
	authors: string;
	date: Date;
	journal: string;
	volume: number;
	issue: number;
	pageRange: [number, number];
	doi: string;

	claim: string;
	evidence: string;

	method: string;
}

export type ArticlesProps = {
	articles: ArticlesInterface[];
};

const ArticleTable = (props: {articles: ArticlesInterface[] | undefined}) => {
	const { articles } = props;
	
	const headers: { key: keyof ArticlesInterface; label: string; display?: DisplayFunction | undefined }[] = [
		{ key: "title", label: "Title" },
		{ key: "authors", label: "Authors", display: (authors: string[]) => authors.join(", ") },
		{ key: "date", label: "Publication Date", display: (date: Date) => `${new Date(date).toLocaleDateString("en-NZ")}` },
		{ key: "journal", label: "Journal" },
		{ key: "volume", label: "Volume" },
		{ key: "issue", label: "Issue" },
		{ key: "pageRange", label: "Pages", display: (pages: [number, number]) => pages[0] + " \u2012 " + pages[1]},
		{ key: "doi", label: "DOI" },
		{ key: "claim", label: "Claim" },
		{ key: "evidence", label: "Evidence" },
		{ key: "method", label: "Method" }
	];

	if(articles !== undefined && articles.length > 0)
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