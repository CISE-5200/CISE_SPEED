import "../../styles/globals.scss";

interface PopupProps {
    message: string;
    success?: boolean;
};

const Popup = (props: PopupProps) => {
    return (
        <p className={"info-box" + " " + (props.success !== undefined ? (props.success ? "success" : "error") : "info")}>{props.message}</p>
    );
};

export default Popup;