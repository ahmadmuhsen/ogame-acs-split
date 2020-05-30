import React, { useState, useEffect } from 'react';

import TextInput from '../Components/TextInput/TextInput';
import Button from '../Components/Button/Button';

import { useTranslation } from "react-i18next";
import { GetCombatReport } from './GetCombatReport';
import { SetCombatStatistics } from './SetCombatStatistics';
import { SetResourceStatistics } from './SetResourceStatistics';

import './Main.css';

export default function Main() {
    const { t } = useTranslation();

    const [CombatReports, setCombatReports] = useState([]);
    const [Attackers, setAttackers] = useState([]);
    const [Defenders, setDefenders] = useState([]);
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
    }

    useEffect(() => {
        SetCombatStatistics(CombatReports, setAttackers, setDefenders);
        setLoading(false);
        setApiKeyInput("");
        SetResourceStatistics(CombatReports);
    }, [CombatReports])

    useEffect(() => {
        let attackerPanels = [];
        let defenderPanels = [];

        Attackers.forEach((attacker, id) => {
        })

        Object.keys(Defenders).forEach((id, index) => {
            
        })

    }, [Attackers, Defenders]);

    return (
        <div className="main">
            <div className="api-keys-input">
                <TextInput
                    placeholder={t("ApiKeysInputPlaceholder")}
                    value={ApiKeyInput}
                    onChange={(event) => setApiKeyInput(event.target.value)}
                    valid={ApiKeyInputValidity}
                    disabled={Loading}
                />
                <Button
                    onClick={GetReport}
                    disabled={Loading}
                >
                    <i className={`fas fa-${Loading ? "spinner" : "plus"}`} />
                    {Loading ? t("Loading") : t("AddKey")}
                </Button>
                <Button
                    onClick={ResetCombatReports}
                    disabled={Loading}
                >
                    <i className="fas fa-trash-alt" />
                    {t("Reset")}
                </Button>
            </div>
            <div className="api-key-validity-message">
                {t(ApiKeyInputValidityMessage)}
            </div>
        </div>
    )
}