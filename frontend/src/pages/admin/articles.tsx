import ArticleEditor from "@/components/editor/ArticleEditor";
import Popup from "@/components/popup/Popup";
import ArticleTable, { ArticlesInterface, QueryFunction } from "@/components/table/ArticleTable";
import { RequestType, User, makeAuthRequest, useRequest } from "@/lib/auth";
import { useEffect, useState } from "react";

interface AdminArticleTableProps {
  adminUser: User | null;
}

const AdminArticleTable = (props: AdminArticleTableProps) => {
  const articlesResponse = useRequest('/article/all', RequestType.GET);
  const [articles, setArticles] = useState<ArticlesInterface[]>();

  useEffect(() => {
    setArticles(articlesResponse.data?.articles);
  }, [articlesResponse.data]);

  const [articleQuery, setArticleQuery] = useState<QueryFunction | undefined>(undefined);
  const [edit, setEdit] = useState<ArticlesInterface>();

  const [success, setSuccess] = useState<boolean>();
  const [message, setMessage] = useState<string | undefined>();

  const editArticle = (article: ArticlesInterface) => {
    setEdit(article);
  };

  const onEditedArticleSaved = (newArticle: ArticlesInterface) => {
    makeAuthRequest("/article/update", RequestType.POST, props.adminUser, {
      title: "Article Title",
      authors: ["Article Author"],
      journalName: "Journal Name",
      pubYear: "2023",
      volume: 1,
      number: 1,
      pages: [1, 2],
      DOI: "doi",
      keywords: ["keyword"],
      abstract: "abstract",
      // TODO add other article fields following CreateArticleDTO / UpdateArticleDTO
    }).then((response) => {
      setSuccess(response.success);

      if(response.success)
      {
        setMessage("Successfully updated article.");
        articlesResponse.update();
      }
      else
      {
        setMessage("Failed to update article.");
      }
    });
  };

  const articleActions: { label?: string; action: any; }[] = [
    {
      action: (article: ArticlesInterface) => (
        <>
          <button onClick={() => editArticle(article)}>Edit</button>
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
      {message !== undefined && (
        <Popup message={message} success={success}/>
      )}

      {edit !== undefined && (
        <Popup>
          <ArticleEditor article={edit} visible={edit !== undefined} submit="Save" onSubmit={onEditedArticleSaved} onCancel={() => setEdit(undefined)}/>
        </Popup>
      )}

      <input type="text" placeholder="Search for an article..." onInput={articleSearch}/>
      <ArticleTable articles={articles} actions={articleActions} query={articleQuery}/>
    </>
  );
};

export default AdminArticleTable;