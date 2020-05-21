import React from 'react';
import { useTranslation } from "react-i18next";
import './Navigation.css';

export default function Navigation() {
    const { t } = useTranslation();

    return (
        <div className="navigation">
            <div className="site-name">{t("SiteName")}</div>
            <div className="github">
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