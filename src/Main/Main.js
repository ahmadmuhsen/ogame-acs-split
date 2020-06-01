import React, { useState, useEffect } from 'react';

import TextInput from '../Components/TextInput/TextInput';
import Button from '../Components/Button/Button';
import ReportKeyInput from '../Components/ReportKeyInput/ReportKeyInput';
import ChooseSide from '../Components/ChooseSide/ChooseSide';
import AttackersPanel from '../AttackersPanel/AttackersPanel';

import { useTranslation } from "react-i18next";
import { GetCombatReport } from './GetCombatReport';
import { SetResourceStatistics } from './SetResourceStatistics';

import './Main.css';

export default function Main() {
    const { t } = useTranslation();
    const [Side, setSide] = useState(-1);
    const [CombatReports, setCombatReports] = useState([]);
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

    const ResetCombatReports = () => {
        setCombatReports([]);
        setSide(-1);
    }

    useEffect(() => {
        setLoading(false);
        setApiKeyInput("");
        SetResourceStatistics(CombatReports);
    }, [CombatReports])

    if (Side === -1)
        return (<ChooseSide setSide={setSide} />)

    return (
        <div className="main">
            <ReportKeyInput
                loading={Loading}
                apiKeyInput={ApiKeyInput}
                setApiKeyInput={setApiKeyInput}
                getReport={GetReport}
                resetCombatReports={ResetCombatReports}
                apiKeyInputValidity={ApiKeyInputValidity}
                apiKeyInputValidityMessage={ApiKeyInputValidityMessage}
            />
            {Side === 0 ?
                <AttackersPanel
                    combatReports={CombatReports}
                    setCombatReports={setCombatReports}
                />
                : "Defenders Panel Still Not Set"
            }
        </div>
    )
}