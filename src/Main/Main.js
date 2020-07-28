import React, { useState, useEffect } from 'react';

import ReportKeyInput from '../Components/ReportKeyInput/ReportKeyInput';
import ChooseSide from '../Components/ChooseSide/ChooseSide';
import CustomReport from '../Components/CustomReport/CustomReport';
import ACSplitPanel from '../ACSplitPanel/ACSplitPanel';

import { useTranslation } from "react-i18next";
import { GetCombatReport } from './GetCombatReport';
import { GetRecycleReport } from './GetRecycleReport';

import './Main.css';
import Button from '../Components/Button/Button';

export default function Main({ settingsData, setShowSettings }) {
    const { t } = useTranslation();
    const [Side, setSide] = useState(-1);
    const [CombatReports, setCombatReports] = useState([]);
    const [RecycleReports, setRecycleReports] = useState([]);
    const [ApiKeyInput, setApiKeyInput] = useState("");
    const [ApiKeyInputValidity, setApiKeyInputValidity] = useState(true);
    const [ApiKeyInputValidityMessage, setApiKeyInputValidityMessage] = useState("");
    const [Loading, setLoading] = useState(false);
    const [ApiKeyList, setApiKeyList] = useState([])
    const [ShowCustom, setShowCustom] = useState(false);

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

    const DeleteCombatReport = index => {
        let combatReports = [...CombatReports];
        combatReports.splice(index, 1);
        setCombatReports(combatReports);
    }

    const DeleteRecycleReport = index => {
        let recycleReports = [...RecycleReports];
        recycleReports.splice(index, 1);
        setRecycleReports(recycleReports);
    }

    useEffect(() => {
        setLoading(false);
        setApiKeyInput("");
        let reports = [];
        CombatReports.forEach((rep, index) => {
            reports.push((
                <div
                    key={`CRLIST${index}`}
                    className="api-key-list-item"
                >
                    <i
                        className="fas fa-times-circle"
                        onClick={() => DeleteCombatReport(index)}
                    />
                    {`${t(Side === 0 ? "Attack" : "Defend")} #${index + 1} [${rep.key}] `}
                </div>
            ))
        })

        RecycleReports.forEach((rep, index) => {
            console.log(rep);
            reports.push((
                <div
                    key={`RRLIST${index}`}
                    className="api-key-list-item"
                >
                    <i
                        className="fas fa-times-circle"
                        onClick={() => DeleteRecycleReport(index)}
                    />
                    {`${t("Harvest")} #${index + 1} [${rep.key}] `}
                </div>
            ))
        })
        setApiKeyList(reports);
    }, [CombatReports, RecycleReports, t])

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
                setShowSettings={setShowSettings}
            />
            <div
                className="manual-add-button"
                onClick={() => setShowCustom(true)}
            >
                <i className="fas fa-plus" />
                {t("AddManual")}
            </div>
            {ShowCustom ?
                <CustomReport
                    combatReports={CombatReports}
                    setCombatReports={setCombatReports}
                    recycleReports={RecycleReports}
                    setRecycleReports={setRecycleReports}
                    side={Side}
                    addCustomReport={() => { }}
                    setShowCustom={setShowCustom}
                /> : ""}
            {ApiKeyList}
            <ACSplitPanel
                combatReports={CombatReports}
                setCombatReports={setCombatReports}
                recycleReports={RecycleReports}
                setRecycleReports={setRecycleReports}
                settingsData={settingsData}
                side={Side}
            />
        </div>
    )
}