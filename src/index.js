import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18nJSON from "./I18n.json";

i18n.use(initReactI18next).init({
  resources: i18nJSON,
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