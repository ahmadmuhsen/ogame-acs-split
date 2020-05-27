import React from 'react';

import TextInput from '../TextInput/TextInput';
import './AttackResult.css';

export default function AttackResult({ combatReport, number }) {
    return (
        <div className="attack-result">
            <div className="attack-number">
                {`#${number}`}
            </div>
            <div>
                <TextInput
                    value={combatReport.metalLoot}
                    valid={true}
                />
            </div>
            <div>
                <TextInput
                    value={combatReport.crystalLoot}
                    valid={true}
                />
            </div>
            <div>
                <TextInput
                    value={combatReport.deuteriumLoot}
                    valid={true}
                />
            </div>
            <div>
                <TextInput
                    value={combatReport.debrisMetal}
                    valid={true}
                />
            </div>
            <div>
                <TextInput
                    value={combatReport.debrisCrystal}
                    valid={true}
                />
            </div>
            <div>
                <TextInput
                    value={combatReport.debrisReaperMetal}
                    valid={true}
                />
            </div>
            <div>
                <TextInput
                    value={combatReport.debrisReaperCrystal}
                    valid={true}
                />
            </div>
        </div>
    )
}