import React, { useState, useEffect } from 'react';

import { useTranslation } from "react-i18next";
import { FormatUnits } from "../../../Main/FormatUnits";
import './Summary.css';

export default function Summary({ totalResult }) {
    const { t } = useTranslation();
    const [SummaryView, setSummaryView] = useState([]);

    useEffect(() => {
        if (totalResult.gain) {
            setSummaryView((
                <div className="result-summary">
                    <div className="data">
                        <div className="row title">
                            <div>{t("Summary")}</div>
                        </div>
                        <div className="row">
                            <div><i className={`fas fa-calculator`} /></div>
                            <div>{t("Metal")}</div>
                            <div>{t("Crystal")}</div>
                            <div>{t("Deuterium")}</div>
                        </div>
                        <div className="row">
                            <div>{t("TotalGain")}</div>
                            <div>{FormatUnits(Math.round(totalResult.gain.metal))}</div>
                            <div>{FormatUnits(Math.round(totalResult.gain.crystal))}</div>
                            <div>{FormatUnits(Math.round(totalResult.gain.deuterium))}</div>
                        </div>

                        <div className="row">
                            <div>{t("TotalLoss")}</div>
                            <div>{FormatUnits(Math.round(totalResult.loss.metal))}</div>
                            <div>{FormatUnits(Math.round(totalResult.loss.crystal))}</div>
                            <div>{FormatUnits(Math.round(totalResult.loss.deuterium))}</div>
                        </div>
                    </div>
                </div>
            ))
        }
    }, [totalResult])

    return (SummaryView)
}