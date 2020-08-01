import axios from 'axios';
import config from '../config.json';

export const PostSharedReport = (data, setSharedReportId, setApiKeyInputValidity, setShareLoading, setApiKeyInputValidityMessage) => {
    const request = {
        method: "POST",
        url: `${config.api}/api/SharedReports`,
        data: data
    };
    setShareLoading(true);
    axios(request)
        .then(function (response) {
            setSharedReportId(response.data);
            setShareLoading(false);
            setApiKeyInputValidityMessage("");
            setApiKeyInputValidity(true);
        })
        .catch(function (error) {
            setShareLoading(false);
            setApiKeyInputValidity(false);
            console.log(error);
            if (error.response)
                switch (error.response.status) {
                    case 400:
                        setApiKeyInputValidityMessage("InvalidKey");
                        break;
                    case 500:
                        setApiKeyInputValidityMessage("ServerError");
                        break;
                    default:
                        setApiKeyInputValidityMessage("UnknownError");
                }
            else
                setApiKeyInputValidityMessage("UnknownError");
        })
}