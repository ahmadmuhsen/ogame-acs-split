import React from 'react';
import TextInput from '../Components/TextInput/TextInput';
import './Settings.css';
import { useTranslation } from "react-i18next";

export default function Settings({ settingsData, setSettingsData, setShowSettings }) {
    const { t } = useTranslation();

    const onConverstionRateChange = (type, value) => {
        let pattern = /^[1-3](\.[1-9]*)?$/;
        if (!pattern.test(value))
            value = parseFloat(value);
        let parsedValue = parseFloat(value);
        value = isNaN(parsedValue) ? type === 0 ? 2 : 1 : value;
        value = parsedValue < 0 ? type === 0 ? 2 : 1 : value;
        value = type === 0 && parsedValue > 3 ? 3 : value;
        value = type === 1 && parsedValue > 2 ? 2 : value;
        let rate = [...settingsData.conversationRate];
        rate[type] = value;
        setSettingsData({ ...settingsData, conversationRate: rate })
    }
    return (
        <div className="settings-panel">
            <div className="card">
                <div className="title">
                    {t("Settings")}
                    <i
                        className="fas fa-times-circle"
                        onClick={() => setShowSettings(false)}
                    />
                </div>
                <div className="setting-section">
                    <div className="description">{t("ReimburseFleetLossDescription")}</div>
                    <div className="control">
                        <i
                            className={`fas fa-toggle-${settingsData.reimburseFleetLoss ? "on" : "off"}`}
                            onClick={() => setSettingsData({ ...settingsData, reimburseFleetLoss: !settingsData.reimburseFleetLoss })}
                        />
                    </div>
                </div>
                <div className="setting-section">
                    <div className="description">{t("ReimburseDeutConsumptionDescription")}</div>
                    <div className="control">
                        <i
                            className={`fas fa-toggle-${settingsData.reimburseDeutConsumption ? "on" : "off"}`}
                            onClick={() => setSettingsData({ ...settingsData, reimburseDeutConsumption: !settingsData.reimburseDeutConsumption })}
                        />
                    </div>
                </div>
                <div className="setting-section">
                    <div className="description">{t("WeighedSettingDescription")}</div>
                    <div className="control">
                        <i
                            className={`fas fa-toggle-${settingsData.weightedCut ? "on" : "off"}`}
                            onClick={() => setSettingsData({ ...settingsData, weightedCut: !settingsData.weightedCut })}
                        />
                    </div>
                </div>
                <div className="setting-section">
                    <div className="description">{t("ConsumptionSettingDescription")}</div>
                    <div className="control">
                        <i
                            className={`fas fa-toggle-${settingsData.convertConsumption ? "on" : "off"}`}
                            onClick={() => setSettingsData({ ...settingsData, convertConsumption: !settingsData.convertConsumption })}
                        />
                    </div>
                </div>
                {settingsData.convertConsumption ?
                    <div className="setting-section convert-consumption">
                        <div className="description">{t("ConsumptionRateSettingDescription")}</div>
                        <div className="control conversion">
                            <TextInput
                                value={settingsData.conversationRate[0]}
                                onChange={event => onConverstionRateChange(0, event.target.value)}
                            />:
                            <TextInput
                                value={settingsData.conversationRate[1]}
                                onChange={event => onConverstionRateChange(1, event.target.value)}
                            />:1
                        </div>
                    </div> : ""}
            </div>
        </div>
    );
}
