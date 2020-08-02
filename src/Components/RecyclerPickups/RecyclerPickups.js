import React, { useState, useEffect } from 'react';

import TextInput from '../TextInput/TextInput';
import SectionTitle from '../SectionTitle/SectionTitle';

import { useTranslation } from "react-i18next";
import './RecyclerPickups.css';

export default function RecyclerPickups({ recycleReports, setRecycleReports }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true)
    const [RecyclerPickupDetails, setRecyclerPickupDetails] = useState([])

    const updateReport = (index, type, value) => {
        let reportsNew = [...recycleReports];
        reportsNew[index][type] = !isNaN(value) ? value > 0 ? value : 0 : 0;
        setRecycleReports(reportsNew);
    }

    useEffect(() => {
        setRecyclerPickupDetails(recycleReports.map((report, index) => {
            return (
                <div
                    className="recycler-report-details"
                    key={`RECYCLEREPORTDETAILS${index}`}
                >
                    <div className="card">
                        <div className="label">{`${t("Harvest")} #${index + 1}`} - {report.ownerName}</div>

                        <div className="label">{t("FlightConsumption")}</div>
                        <div className="input-row">
                            {t("Deuterium")}
                            <TextInput
                                value={report.deuteriumConsumption}
                                onChange={event => updateReport(index, "deuteriumConsumption", parseInt(event.target.value))}
                                valid={report.deuteriumConsumption <= 0 ? false : true}
                            />
                        </div>

                        <div className="label">{t("FleetComposition")}</div>
                        <div className="input-row">
                            {t("Recycler")}
                            <TextInput
                                value={report.recyclers}
                                onChange={event => updateReport(index, "recyclers", parseInt(event.target.value))}
                                valid={report.recyclers < 0 ? false : true}
                            />
                        </div>
                        <div className="input-row">
                            {t("Reaper")}
                            <TextInput
                                value={report.reapers}
                                onChange={event => updateReport(index, "reapers", parseInt(event.target.value))}
                                valid={report.reapers < 0 ? false : true}
                            />
                        </div>

                        <div className="label">{t("Resources")}</div>
                        <div className="input-row">
                            {t("Metal")}
                            <TextInput
                                value={report.metal}
                                onChange={event => updateReport(index, "metal", parseInt(event.target.value))}
                                valid={report.metal <= 0 ? false : true}
                            />
                        </div>
                        <div className="input-row">
                            {t("Crystal")}
                            <TextInput
                                value={report.crystal}
                                onChange={event => updateReport(index, "crystal", parseInt(event.target.value))}
                                valid={report.crystal <= 0 ? false : true}
                            />
                        </div>

                    </div>
                </div>
            );
        }))
    }, [recycleReports])

    return (
        <div className="recycler-pickups-main">
            <SectionTitle
                title={t("HarvestsOverview")}
                icon={DataVisible ? "caret-up" : "caret-down"}
                onClick={() => setDataVisible(!DataVisible)}
            />
            <div
                className="recycler-pickups"
                style={{ display: !DataVisible || recycleReports.length === 0 ? "none" : "flex" }}
            >
                <div className="recycle-icon">
                    <i className="fas fa-recycle" />
                </div>
                <div className="recyclers-details-panel">
                    {RecyclerPickupDetails}
                </div>
            </div>
        </div>
    )
}