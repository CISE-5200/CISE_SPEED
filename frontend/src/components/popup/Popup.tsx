import { ReactNode } from "react";
import "../../styles/globals.scss";

interface PopupProps {
    children?: ReactNode;
    message?: string;
    success?: boolean;
};

const Popup = (props: PopupProps) => {
    return (
        <div className={"info-box" + " " + (props.success !== undefined ? (props.success ? "success" : "error") : "info")}>
            {props.message !== undefined && (
                <p>{props.message}</p>
            )}
            
            {props.children !== undefined && props.children}
        </div>
    );
};

export default Popup;