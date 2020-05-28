import React from 'react';
import { useTranslation } from "react-i18next";
import './PanelStatisticsLabel.css';

export default function PanelStatisticsLabel({ isDefender }) {
    const { t } = useTranslation();

    return (
        <div className="panel-statistics-label">
            <div className="resource-statistics-labels">
                <div>{t("Type")}</div>
                <div className={isDefender ? "hidden" : ""}>
                    <div className="resource-icon metal-icon"></div>
                </div>
                <div className={isDefender ? "hidden" : ""}>
                    <div className="resource-icon crystal-icon"></div>
                </div>
                <div className={isDefender ? "hidden" : ""}>
                    <div className="resource-icon deuterium-icon"></div>
                </div>
                <div className={isDefender ? "hidden" : ""}>
                    <div className="resource-icon metal-icon">{t("DF")}</div>
                </div>
                <div className={isDefender ? "hidden" : ""}>
                    <div className="resource-icon crystal-icon">{t("DF")}</div>
                </div>
            </div>
            <div className="fleet-statistics-label">
                {t("FleetComposition")}
            </div>
        </div>
    )
}