import { GetStaticProps, NextPage } from "next";
import ArticleTable, {ArticlesProps} from "@/components/table/ArticleTable";
import data from "../../utils/dummydata.json";

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
	return (
		<div className="container">
			<h1>Articles Index Page</h1>
			<p>Page containing a table of articles:</p>
			<ArticleTable articles={articles}/>
		</div>
	);
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async (_) => {
	// Map the data to ensure all articles have consistent property names
	const articles = data.articles.map((article) => ({
		id: article.id ?? article._id,
		title: article.title,
		authors: article.authors,
		source: article.source,
		pubyear: article.pubyear,
		doi: article.doi,
		claim: article.claim,
		evidence: article.evidence,
	}));
	return {
		props: {
			articles,
		},
	};
};

export default Articles;