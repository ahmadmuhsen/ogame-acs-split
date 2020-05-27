import React, { useState, useEffect } from 'react';

import SectionTitle from '../Components/SectionTitle/SectionTitle';
import TextInput from '../Components/TextInput/TextInput';
import Button from '../Components/Button/Button';
import PlayerPanel from '../Components/PlayerPanel/PlayerPanel';
import ACSAttackResult from '../Components/ACSAttackResults/ACSAttackResults';

import { useTranslation } from "react-i18next";
import { GetCombatReport } from './GetCombatReport';
import { SetCombatStatistics } from './SetCombatStatistics';

import './Main.css';

export default function Main() {
    const { t } = useTranslation();

    const [CombatReports, setCombatReports] = useState([]);
    const [Attackers, setAttackers] = useState([]);
    const [Defenders, setDefenders] = useState([]);
    const [AttackersPanels, setAttackersPanels] = useState([]);
    const [DefendersPanels, setDefendersPanels] = useState([])
    const [ApiKeyInput, setApiKeyInput] = useState("")
    const [ApiKeyInputValidity, setApiKeyInputValidity] = useState(true)
    const [ApiKeyInputValidityMessage, setApiKeyInputValidityMessage] = useState("")
    const [Loading, setLoading] = useState(false)

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
    }, [CombatReports])

    useEffect(() => {
        let attackerPanels = [];
        let defenderPanels = [];
        Attackers.forEach((attacker, id) => {
            attackerPanels.push((
                <PlayerPanel
                    combatReports={CombatReports}
                    player={attacker}
                    id={id}
                    key={id}
                    isDefender={false}
                    isCoordinateOwner={false}
                />));
        })

        Object.keys(Defenders).forEach((id, index) => {
            defenderPanels.push((
                <PlayerPanel
                    combatReports={CombatReports}
                    player={Defenders[id]}
                    id={id}
                    key={id}
                    isDefender={true}
                    isCoordinateOwner={index === 0 ? true : false}
                />));
        })

        setAttackersPanels(attackerPanels);
        setDefendersPanels(defenderPanels);
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
                >{Loading ? t("Loading") : t("AddKey")}
                </Button>
                <Button
                    onClick={ResetCombatReports}
                    disabled={Loading}
                >{t("Reset")}
                </Button>
            </div>
            <div className="api-key-validity-message">
                {t(ApiKeyInputValidityMessage)}
            </div>
            <SectionTitle title="ACS Attack Results" icon="users" />
            <ACSAttackResult combatReports={CombatReports} />

            <SectionTitle title="Attackers" icon="fighter-jet" />
            {AttackersPanels}

            <SectionTitle title="Defenders" icon="shield-alt" />
            {DefendersPanels}

        </div>
    )
}