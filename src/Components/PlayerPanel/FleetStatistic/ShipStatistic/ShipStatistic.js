import React from 'react';
import { useTranslation } from "react-i18next";

import TextInput from '../../../TextInput/TextInput';
import './ShipStatistic.css';

export default function ShipStatistic({ ship, name }) {
    return (
        <div className="ship-statistic">
            <div className="ship-name">
                {name}
            </div>
            <TextInput
                value={ship.preCount}
                valid={true}
            />
            <TextInput
                value={ship.postCount}
                valid={true}
            />
            <div className="ship-loss">
                {-(ship.preCount - ship.postCount)}
            </div>
        </div>
    )
}