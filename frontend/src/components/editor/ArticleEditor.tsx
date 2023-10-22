import { ArticlesInterface } from "../table/ArticleTable"
import EditForm from "./EditForm";
import formStyles from "../../styles/Form.module.scss";
import { useEffect, useState } from "react";
import { RequestType, useRequest } from "@/lib/auth";

interface ArticleEditorProps {
    article: ArticlesInterface;
    visible: boolean;
    submit: string;
    onSubmit: (newArticle: ArticlesInterface) => void;
    onCancel?: () => void;
};

interface Method {
    id: string;
    name: string;
}  

const ArticleEditor = (props: ArticleEditorProps) => {
    const [title, setTitle] = useState<string>(props.article?.title);
    const [authors, setAuthors] = useState<string>(props.article?.authors);
    const [journal, setJournal] = useState<string>(props.article?.journal);
    const [pubYear, setPubYear] = useState<string>(props.article?.pubYear);
    const [source, setSource] = useState<string>(props.article?.source);
    const [doi, setDOI] = useState<string>(props.article?.doi);
    const [participant, setParticipant] = useState<string>(props.article?.participant);
    const [method, setMethod] = useState<string>(props.article?.method);
    const [claim, setClaim] = useState<string>(props.article?.claim);
    const [result, setResult] = useState<string>(props.article?.result);
    const [researchType, setResearchType] = useState<string>(props.article?.researchType);
    const [abstract, setAbstract] = useState<string>(props.article?.abstract);
    const [type, setType] = useState<string>(props.article?.type);

    const methodsResponse = useRequest('/method/all', RequestType.GET);
    const [methods, setMethods] = useState<Method[]>();
  
    useEffect(() => {
      setMethods(methodsResponse.data?.methods);
    }, [methodsResponse.data]);

    const onSubmitArticle = () => {
        props.onSubmit({
            title: title,
            authors: authors,
            journal: journal,
            pubYear: pubYear,
            source: source,
            doi: doi,
            participant: participant,
            method: method,
            claim: claim,
            result: result,
            researchType: researchType,
            abstract: abstract,
            type: type,
        });
    };

    const onCancelArticle = () => {
        if(props.onCancel !== undefined)
            props.onCancel();
    }

    return (
        <EditForm onSubmit={onSubmitArticle} visible={props.visible}>
            <input className={formStyles.formItem} type="text" name="title" placeholder="Article Title" value={title} onChange={(Event) => {
                setTitle(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="authors" placeholder="Article Authors" value={authors} onChange={(Event) => {
                setAuthors(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="journal" placeholder="Article Journal" value={journal} onChange={(Event) => {
                setJournal(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="pubYear" placeholder="Article Year" value={pubYear} onChange={(Event) => {
                setPubYear(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="source" placeholder="Article Source" value={source} onChange={(Event) => {
                setSource(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="doi" placeholder="Article DOI" value={doi} onChange={(Event) => {
                setDOI(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="participant" placeholder="Article Participant" value={participant} onChange={(Event) => {
                setParticipant(Event.target.value);
            }}/>

            <select
                className={formStyles.formItem}
                id="method"
                name="method"
                onChange={(event) => setMethod(event.target.value)}
                defaultValue={method}
            >
                {methods?.map((method) => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                ))}
            </select>

            <input className={formStyles.formItem} type="text" name="claim" placeholder="Article Claim" value={claim} onChange={(Event) => {
                setClaim(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="result" placeholder="Article Result" value={result} onChange={(Event) => {
                setResult(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="researchType" placeholder="Article Research Type" value={researchType} onChange={(Event) => {
                setResearchType(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="abstract" placeholder="Article Abstract" value={abstract} onChange={(Event) => {
                setAbstract(Event.target.value);
            }}/>

            <input className={formStyles.formItem} type="text" name="type" placeholder="Article Type" value={type} onChange={(Event) => {
                setType(Event.target.value);
            }}/>

            <button className={formStyles.formItem} type="submit">
                {props.submit}
            </button>

            {props.onCancel !== undefined && (
                <button className={formStyles.formItem} onClick={onCancelArticle}>
                    Cancel
                </button>
            )}
        </EditForm>
    );
};

export default ArticleEditor;