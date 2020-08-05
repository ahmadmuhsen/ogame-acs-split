import axios from 'axios';
import config from '../config.json';

export const GetRecycleReport = (recycleReport, RecycleReports, setRecycleReports, setApiKeyInputValidity, setLoading, setApiKeyInputValidityMessage) => {
    let exists = RecycleReports.find(rr => rr.key === recycleReport);
    if (!exists) {
        setLoading(true);
        const request = {
            method: "GET",
            url: `${config.api}/api/recycler?recyclerReport=${recycleReport}`
        };

        axios(request)
            .then(function (response) {
                let data = response.data;

                if (RecycleReports.length > 0 && RecycleReports[0].coordinates !== data.generic.coordinates) {
                    setApiKeyInputValidity(false);
                    setApiKeyInputValidityMessage("InvalidCoordinates");
                    setLoading(false);
                } else {
                    let rrdata = {
                        key: data.Id,
                        coordinates: data.generic.coordinates,
                        metal: data.generic.recycler_metal_retrieved + data.generic.reaper_metal_retrieved,
                        crystal: data.generic.recycler_crystal_retrieved + data.generic.reaper_crystal_retrieved,
                        ownerId: data.generic.owner_id,
                        ownerName: data.generic.owner_name,
                        deuteriumConsumption: 0,
                        recyclers: data.generic.recycler_count,
                        reapers: data.generic.reaper_count
                    };

                    let rrs = [...RecycleReports];
                    rrs.push(rrdata);
                    setApiKeyInputValidity(true);
                    setApiKeyInputValidityMessage("");
                    setRecycleReports(rrs);
                }
            })
            .catch(function (error) {
                setLoading(false);
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
    } else {
        setApiKeyInputValidity(false);
        setApiKeyInputValidityMessage("KeyAlreadyExists");
    }
}