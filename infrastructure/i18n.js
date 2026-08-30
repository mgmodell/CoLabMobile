import i18n from "i18next";

import intervalPlural from "i18next-intervalplural-postprocessor";
import { initReactI18next } from "react-i18next";
import AsyncStoragePlugin from 'i18next-react-native-async-storage'


import Fetch from "i18next-fetch-backend";


i18n
  .use(Fetch)
  .use(AsyncStoragePlugin('en'))
  .use(initReactI18next)
  .use(intervalPlural)
  .init({
    backend: {
      loadPath: "http://localhost:3000/infra/locales/{{ns}}.json",
      // path to post missing resources
      addPath: "locales/add/{{ns}}",
    },
    defaultNS: "base",
    fallbackLng: "en",
    ns: "base",
    debug: false
  });

export default i18n;
