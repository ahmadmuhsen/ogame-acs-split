import React from 'react';
import { useTranslation } from "react-i18next";
import './PanelStatisticsLabel.css';

export default function PanelStatisticsLabel({ hidden }) {
    const { t } = useTranslation();

    return (
        <div className={`panel-statistics-label ${hidden ? "hidden" : ""}`}>
            <div className="resource-statistics-labels">
                <div></div>
                <div>
                    <div className="resource-icon metal-icon"></div>
                </div>
                <div>
                    <div className="resource-icon crystal-icon"></div>
                </div>
                <div>
                    <div className="resource-icon deuterium-icon"></div>
                </div>
            </div>
            <div className="fleet-statistics-label">
                {t("FleetComposition")}
            </div>
        </div>
    )
}