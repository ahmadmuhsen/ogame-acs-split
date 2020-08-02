import axios from 'axios';
import config from '../config.json';

export const GetSharedReport = (
    shareId,
    setShareLoading,
    setApiKeyInputValidity,
    setApiKeyInputValidityMessage,
    setCombatReports,
    setRecycleReports,
    setSide,
    setPlayerTotalsStatistics,
    setSettingsData
) => {
    const request = {
        method: "GET",
        url: `${config.api}/api/SharedReports/${shareId}`
    };

    setShareLoading(true);
    axios(request)
        .then(function (response) {
            let data = response.data;
            console.log(data);
            setSide(data.side);
            setCombatReports(data.combatReports);
            setRecycleReports(data.recycleReports);
            //setSettingsData(data.settings);
            setPlayerTotalsStatistics(data.playersStatistics);
            setApiKeyInputValidityMessage("");
            setApiKeyInputValidity(true);
            setShareLoading(false);
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