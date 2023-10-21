import { ReactNode, FormEvent } from "react";
import formStyles from "../../styles/Form.module.scss";

interface EditFormProps {
    onSubmit: () => void;
    children: ReactNode;
    visible: boolean;
};

const EditForm = (props: EditFormProps) => {
    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSubmit();
    };

    return (
        <>
            {props.visible && (
                <form className={formStyles.form} onSubmit={submitForm} action="#">
                    {props.children}
                </form>
            )}
        </>
    );
}

export default EditForm;