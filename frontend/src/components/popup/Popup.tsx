import "../../styles/globals.scss";

interface PopupProps {
    message: string;
    success: boolean;
};

const Popup = (props: PopupProps) => {
    return (
        <p className={"info-box" + " " + (props.success ? "success" : "error")}>{props.message}</p>
    );
};

export default Popup;