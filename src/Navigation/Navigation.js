import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import './Navigation.css';

export default function Navigation() {
    const [Language, setLanguage] = useState(localStorage.preferredLanguage);
    const [LanguageSelect, setLanguageSelect] = useState([])
    const [SelectVisible, setSelectVisible] = useState(false)
    const { t } = useTranslation();
    const AllLanguages = ["en"]

    useEffect(() => {
        localStorage.preferredLanguage = Language;
        i18next.changeLanguage(Language)

        let otherLanguages = AllLanguages.filter(lng => lng !== Language);
        setLanguageSelect(otherLanguages.map(lng => (
            <div
                className="language-option"
                onClick={() => setLanguage(lng)}
                key={`LANGUAGE${lng}`}
            >
                {t(lng)}
            </div>
        )))
        setSelectVisible(false)
    }, [Language])

    return (
        <div className="navigation">
            <div className="site-name">{t("SiteName")}</div>
            <div className="right-toolbar">
                <div className="language">
                    <div
                        className="selected-language"
                        onClick={() => setSelectVisible(!SelectVisible)}
                    >
                        <i className="fas fa-globe-asia" />
                        {t(Language)}
                    </div>
                    {SelectVisible ?
                        <div className="language-options">
                            {LanguageSelect}
                            <a
                                className="language-option"
                                href="https://github.com/ahmadmuhsen/ogame-acs-split/wiki/Adding-Languages"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fas fa-file-alt" />
                                {t("AddEditLanguage")}
                            </a>
                        </div> : ""}
                </div>
                <a
                    href="https://github.com/ahmadmuhsen/ogame-acs-split"
                    className="repo"
                    target="_blank"
                    rel="noopener noreferrer"
                ><i className="fab fa-github" />{t("Repository")}</a>
                <a
                    href="https://github.com/ahmadmuhsen/ogame-acs-split/issues"
                    className="issue"
                    target="_blank"
                    rel="noopener noreferrer"
                ><i className="fas fa-bug" />{t("ReportIssue")}</a>
            </div>
        </div>
    )
}