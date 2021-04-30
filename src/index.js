import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import English from "./I18n/English.json";
import Balkan from "./I18n/Balkan.json";
import Danish from "./I18n/Danish.json";
import French from "./I18n/French.json";

i18n.use(initReactI18next).init({
  resources: {
    en: English,
    ba: Balkan,
    da: Danish,
    fr: French
  },
  lng: getPreferredLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

function getPreferredLanguage() {
  if (!localStorage.preferredLanguage)
    localStorage.preferredLanguage = "en";
  return localStorage.preferredLanguage;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);