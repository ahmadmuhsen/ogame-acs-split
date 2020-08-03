import React, { useState, useEffect } from 'react';

import ReportKeyInput from '../Components/ReportKeyInput/ReportKeyInput';
import ChooseSide from '../Components/ChooseSide/ChooseSide';
import CustomReport from '../Components/CustomReport/CustomReport';
import ACSplitPanel from '../ACSplitPanel/ACSplitPanel';

import { useTranslation } from "react-i18next";
import { GetCombatReport } from './GetCombatReport';
import { GetRecycleReport } from './GetRecycleReport';
import { PostSharedReport } from './PostSharedReport';
import { GetSharedReport } from './GetSharedReport';

import config from '../config.json';

import './Main.css';
import { SetResourceStatistics } from './SetResourceStatistics';

export default function Main({ settingsData, setShowSettings, setSettingsData }) {
    const { t } = useTranslation();
    const [Side, setSide] = useState(-1);
    const [CombatReports, setCombatReports] = useState([]);
    const [RecycleReports, setRecycleReports] = useState([]);
    const [PlayerTotalsStatistics, setPlayerTotalsStatistics] = useState([]);
    const [ApiKeyInput, setApiKeyInput] = useState("");
    const [ApiKeyInputValidity, setApiKeyInputValidity] = useState(true);
    const [ApiKeyInputValidityMessage, setApiKeyInputValidityMessage] = useState("");
    const [Loading, setLoading] = useState(false);
    const [ApiKeyList, setApiKeyList] = useState([])
    const [ShowCustom, setShowCustom] = useState(false);
    const [ShareLoading, setShareLoading] = useState(false);
    const [SharedReportId, setSharedReportId] = useState(0);
    const [DataFromSharedReport, setDataFromSharedReport] = useState(false);

    const GetReport = () => {
        let keyArray = ApiKeyInput.split('-');
        if (keyArray.length === 4) {
            switch (keyArray[0]) {
                case "cr":
                    GetCombatReport(ApiKeyInput, CombatReports, setCombatReports, setApiKeyInputValidity, setLoading, setApiKeyInputValidityMessage, settingsData, setSettingsData);
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
        setSharedReportId(0);
        setDataFromSharedReport(false);
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
        let cmbtrp = [...CombatReports];
        SetResourceStatistics(cmbtrp, settingsData);
        setCombatReports(cmbtrp);
    }, [settingsData])

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

    const shareSplitReport = () => {
        let data = {
            combatReports: CombatReports,
            recycleReports: RecycleReports,
            side: Side,
            settings: settingsData,
            playersStatistics: PlayerTotalsStatistics
        }
        PostSharedReport(data, setSharedReportId, setApiKeyInputValidity, setShareLoading, setApiKeyInputValidityMessage);
    }

    useEffect(() => {
        window.location.search.replace("?", "").split("&").map(srch => srch.split("=")).forEach(prm => {
            switch (prm[0]) {
                case "share":
                    setDataFromSharedReport(true);
                    GetSharedReport(prm[1], setShareLoading, setApiKeyInputValidity, setApiKeyInputValidityMessage, setCombatReports, setRecycleReports, setSide, setPlayerTotalsStatistics, setSettingsData)
                    break;
                default: break;
            }
        });
    }, [])

    if (Side === -1 && ShareLoading)
        return (<div className="loading-main"><i className="fas fa-spinner" /></div>)

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
            <div className="add-share">
                <div
                    className="manual-add-button"
                    onClick={() => setShowCustom(true)}
                >
                    <i className="fas fa-plus" />
                    {t("AddManual")}
                </div>
                <div className="share">
                    {CombatReports.length > 0 || RecycleReports.length > 0 ?

                        <div
                            className={`share-button ${SharedReportId !== 0 ? "small" : ""}`}
                            onClick={shareSplitReport}
                        >
                            <i className={`fas fa-${ShareLoading ? "spinner" : "share-alt"}`} />
                            {SharedReportId === 0 ? t("Share") : ""}
                        </div> : ""}
                    {SharedReportId !== 0 && (CombatReports.length > 0 || RecycleReports.length > 0) ?
                        <div
                            className="share-link"
                        >
                            {config.app}{"?share="}{SharedReportId}
                        </div> : ""}
                </div>
            </div>
            {ShowCustom ?
                <CustomReport
                    combatReports={CombatReports}
                    setCombatReports={setCombatReports}
                    recycleReports={RecycleReports}
                    setRecycleReports={setRecycleReports}
                    side={Side}
                    setShowCustom={setShowCustom}
                    settingsData={settingsData}
                /> : ""}
            {ApiKeyList}
            <ACSplitPanel
                combatReports={CombatReports}
                setCombatReports={setCombatReports}
                recycleReports={RecycleReports}
                setRecycleReports={setRecycleReports}
                playerTotalsStatistics={PlayerTotalsStatistics}
                setPlayerTotalsStatistics={setPlayerTotalsStatistics}
                settingsData={settingsData}
                side={Side}
                dataFromSharedReport={DataFromSharedReport}
            />
        </div>
    )
}