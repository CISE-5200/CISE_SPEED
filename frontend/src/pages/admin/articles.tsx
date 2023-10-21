import ArticleTable, { ArticlesInterface, QueryFunction } from "@/components/table/ArticleTable";
import { RequestType, useRequest } from "@/lib/auth";
import { useState } from "react";

const AdminArticleTable = () => {
    const articlesResponse = useRequest('/user/allArticles', RequestType.GET);
  
    const [articleQuery, setArticleQuery] = useState<QueryFunction | undefined>(undefined);
  
    const articleActions: { label?: string; action: any; }[] = [
      {
        action: (article: ArticlesInterface) => (
          <>
            <button>Edit</button>
          </>
        )
      }
    ];
  
    const articleSearch = (event: React.FormEvent<HTMLInputElement>) => {
      let searchQuery = event.currentTarget.value;
  
      let query: QueryFunction = (article: ArticlesInterface): boolean => { 
        return article !== undefined && article.title.toLowerCase().startsWith(searchQuery.toLowerCase());
      };
  
      setArticleQuery(() => query);
    };
  
    return (
      <>
        <input type="text" placeholder="Search for an article..." onInput={articleSearch}/>
        <ArticleTable articles={articlesResponse?.articles} actions={articleActions} query={articleQuery}/>
      </>
    );
};

export default AdminArticleTable;