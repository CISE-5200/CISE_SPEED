import { GetStaticProps, NextPage } from "next";
import ArticleTable, {ArticlesInterface, ArticlesProps} from "@/components/table/ArticleTable";
import { useState, useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "@/global";

const ArticlesPage: NextPage<ArticlesProps> = () => {
	const [articleData, setArticleData] = useState<ArticlesInterface[]>();

	useEffect(() => {
		getArticleData();
	}, []);

	const getArticleData = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/user/list`);
		  	setArticleData(response.data.articles);
		} catch (error) {
		  console.log(error);
		}
	  };

	return (
		<div className="container">
			<h1>Articles Index Page</h1>
			<ArticleTable articles={articleData}/>
		</div>
	);
};

export default ArticlesPage;