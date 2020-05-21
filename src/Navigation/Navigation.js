import React from 'react';
import { useTranslation } from "react-i18next";
import './Navigation.css';

export default function Navigation(){
    const { t } = useTranslation();

    return (
        <div className="navigation">
            <div className="site-name">{t("SiteName")}</div>
        </div>
    )
}