import React from "react";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import "./ChooseSide.css";
export default function ChooseSide({ setSide }) {
    const { t } = useTranslation();
    return (
        <div className="choose-side">
            <div className="label">
                {t("ChooseSidePrompt")}
            </div>
            <Button
                disabled={false}
                onClick={() => setSide(0)}
            >
                {t("Attackers")}
            </Button>
            <Button
                disabled={false}
                onClick={() => setSide(1)}
            >
                {t("Defenders")}
            </Button>
        </div>
    )
}