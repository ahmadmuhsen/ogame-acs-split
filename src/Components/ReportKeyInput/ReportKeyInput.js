import React from 'react';
import TextInput from '../TextInput/TextInput';
import Button from '../Button/Button';
import { useTranslation } from "react-i18next";

export default function ReportKeyInput({ loading, setApiKeyInput, apiKeyInput, apiKeyInputValidity, apiKeyInputValidityMessage, getReport, resetCombatReports }) {
    const { t } = useTranslation();
    return (
        <div className="main">
            <div className="api-keys-input">
                <TextInput
                    placeholder={t("ApiKeysInputPlaceholder")}
                    value={apiKeyInput}
                    onChange={(event) => setApiKeyInput(event.target.value)}
                    valid={apiKeyInputValidity}
                    disabled={loading}
                />
                <Button
                    onClick={getReport}
                    disabled={loading}
                >
                    <i className={`fas fa-${loading ? "spinner" : "plus"}`} />
                    {loading ? t("Loading") : t("AddKey")}
                </Button>
                <Button
                    onClick={resetCombatReports}
                    disabled={loading}
                >
                    <i className="fas fa-trash-alt" />
                    {t("Reset")}
                </Button>
            </div>
            <div className="api-key-validity-message">
                {t(apiKeyInputValidityMessage)}
            </div>
        </div>
    )
}