import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import SectionTitle from '../../Components/SectionTitle/SectionTitle';
import AttackDetails from '../AttackDetails/AttackDetails';

import './AttacksOverview.css';

export default function AttacksOverview({ combatReports, setCombatReports }) {
    const { t } = useTranslation();
    const [DataVisible, setDataVisible] = useState(true)
    const [AttacksDetails, setAttacksDetails] = useState([]);

    useEffect(() => {
        setAttacksDetails(combatReports.map((report, index) => {
            return (
                <AttackDetails
                    combatReports={combatReports}
                    setCombatReports={setCombatReports}
                    index={index}
                    key={`ATTACKDETAILS${index}`}
                />
            )
        }));
    }, [combatReports])

    return (
        <div className="attacks-overview-main">
            <SectionTitle
                title={t("AttacksOverview")}
                icon={DataVisible ? "caret-up" : "caret-down"}
                onClick={() => setDataVisible(!DataVisible)}
            />
            <div
                className="attacks-overview"
                style={{ display: DataVisible ? "flex" : "none" }}
            >
            {AttacksDetails}
            </div>
        </div>

    )
}