import React, { useState, useEffect } from 'react';

import ReportKeyInput from '../Components/ReportKeyInput/ReportKeyInput';
import ChooseSide from '../Components/ChooseSide/ChooseSide';
import AttackersPanel from '../AttackersPanel/AttackersPanel';

import { useTranslation } from "react-i18next";
import { GetCombatReport } from './GetCombatReport';
import { GetRecycleReport } from './GetRecycleReport';

import './Main.css';

export default function Main() {
    const { t } = useTranslation();
    const [Side, setSide] = useState(-1);
    const [CombatReports, setCombatReports] = useState([]);
    const [RecycleReports, setRecycleReports] = useState([]);
    const [ApiKeyInput, setApiKeyInput] = useState("");
    const [ApiKeyInputValidity, setApiKeyInputValidity] = useState(true);
    const [ApiKeyInputValidityMessage, setApiKeyInputValidityMessage] = useState("");
    const [Loading, setLoading] = useState(false);

    const GetReport = () => {
        let keyArray = ApiKeyInput.split('-');
        if (keyArray.length === 4) {
            switch (keyArray[0]) {
                case "cr":
                    GetCombatReport(ApiKeyInput, CombatReports, setCombatReports, setApiKeyInputValidity, setLoading, setApiKeyInputValidityMessage);
                    break;
                case "rr":
                    GetRecycleReport(ApiKeyInput, RecycleReports, setRecycleReports, setApiKeyInputValidity, setLoading, setApiKeyInputValidityMessage);
                    break;
                default:
                    setApiKeyInputValidity(false);
                    setApiKeyInputValidityMessage("InvalidKey");
                    break;
            }
        } else {
            setApiKeyInputValidity(false);
            setApiKeyInputValidityMessage("InvalidKey");
        }
    }

    const ResetReports = () => {
        setCombatReports([]);
        setRecycleReports([]);
        setApiKeyInputValidity(true);
        setApiKeyInputValidityMessage("");
        setSide(-1);
    }

    useEffect(() => {
        setLoading(false);
        setApiKeyInput("");
    }, [CombatReports, RecycleReports])

    if (Side === -1)
        return (<ChooseSide setSide={setSide} />)

    return (
        <div className="main">
            <ReportKeyInput
                loading={Loading}
                apiKeyInput={ApiKeyInput}
                setApiKeyInput={setApiKeyInput}
                getReport={GetReport}
                resetReports={ResetReports}
                apiKeyInputValidity={ApiKeyInputValidity}
                apiKeyInputValidityMessage={ApiKeyInputValidityMessage}
            />
            {Side === 0 ?
                <AttackersPanel
                    combatReports={CombatReports}
                    setCombatReports={setCombatReports}
                    recycleReports={RecycleReports}
                    setRecycleReports={setRecycleReports}
                />
                : "Defenders Panel Still Not Set"
            }
        </div>
    )
}