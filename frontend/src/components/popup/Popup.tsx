import { ReactNode } from "react";
import "../../styles/globals.scss";

interface PopupProps {
    children: ReactNode;
    success?: boolean;
};

const Popup = (props: PopupProps) => {
    return (
        <p className={"info-box" + " " + (props.success !== undefined ? (props.success ? "success" : "error") : "info")}>{props.children}</p>
    );
};

export default Popup;