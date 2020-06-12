import React, { useState, useEffect } from 'react';

import { useTranslation } from "react-i18next";
import './PlayerTotals.css';

export default function Result({ combatReports, recycleReports }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true);
    return (
        <div className="player-totals">
            <div
                className={`player-totals-label ${DataVisible ? "expanded" : ""}`}
                onClick={() => setDataVisible(!DataVisible)}
            >
                <i className={`fas fa-${DataVisible ? "caret-right" : "caret-down"}`} />
                {t("PlayerTotals")}
            </div>
        </div>
    )
}