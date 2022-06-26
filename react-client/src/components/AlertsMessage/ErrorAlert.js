import { Alert } from "@fluentui/react-northstar";

import 'animate.css';
import './AlertMessage.css';

const ErrorAlert = ({show, message }) => {

    return (
        <Alert content={message} danger
            className={show ? 'animate__animated animate__fadeInDown' : 'al-hide'} />
    )
};

export default ErrorAlert;