import { ArticlesInterface } from "../table/ArticleTable"
import EditForm from "./EditForm";
import formStyles from "../../styles/Form.module.scss";
import { useState } from "react";

interface ArticleEditorProps {
    article: ArticlesInterface;
    visible: boolean;
    submit: string;
    onSubmit: (newArticle: ArticlesInterface) => void;
    onCancel?: () => void;
};

const ArticleEditor = (props: ArticleEditorProps) => {
    const [name, setName] = useState<string>(props.article?.title);

    const onSubmitArticle = () => {
        props.onSubmit(props.article); // TODO: create new ArticlesInterface instance with updated fields.
    };

    const onCancelArticle = () => {
        if(props.onCancel !== undefined)
            props.onCancel();
    }

    return (
        <EditForm onSubmit={onSubmitArticle} visible={props.visible}>
            <input className={formStyles.formItem} type="text" name="name" placeholder="Article Name" value={name} onChange={(Event) => {
                setName(Event.target.value);
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