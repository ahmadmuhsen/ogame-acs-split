import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import SectionTitle from '../../Components/SectionTitle/SectionTitle';
import FleetDetails from './FleetDetails/FleetDetails';

import './FleetOverview.css';

export default function FleetOverview({ combatReports, setCombatReports, side, settingsData }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true)
    const [AttacksDetails, setAttacksDetails] = useState([]);

    useEffect(() => {
        setAttacksDetails(combatReports.map((report, index) => {
            return (
                <FleetDetails
                    combatReports={combatReports}
                    setCombatReports={setCombatReports}
                    index={index}
                    key={`FLEETDETAILS${index}`}
                    side={side}
                    settingsData={settingsData}
                />
            )
        }));
    }, [combatReports])

    return (
        <div className="fleet-overview-main">
            <SectionTitle
                title={side === 0 ? t("AttackersOverview") : t("DefendersOverview")}
                icon={DataVisible ? "caret-up" : "caret-down"}
                onClick={() => setDataVisible(!DataVisible)}
            />
            <div
                className="fleet-overview"
                style={{ display: DataVisible ? "flex" : "none" }}
            >
            {AttacksDetails}
            </div>
        </div>

    )
}