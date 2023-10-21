import { NextPage } from "next";
import ArticleTable, {ArticlesInterface, ArticlesProps} from "@/components/table/ArticleTable";
import { useState, useEffect } from "react";
import { RequestType, useRequest } from "@/lib/auth";

const ArticlesPage: NextPage<ArticlesProps> = () => {
	const articlesResponse = useRequest('/article/all', RequestType.GET);
	const [articles, setArticles] = useState<ArticlesInterface[]>();

	useEffect(() => {
		setArticles(articlesResponse.data?.articles);
	}, [articlesResponse.data]);

	return (
		<div className="container">
			<h1>Articles Index Page</h1>
			<ArticleTable articles={articles}/>
		</div>
	);
};

export default ArticlesPage;