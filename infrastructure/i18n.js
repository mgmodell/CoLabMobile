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
      loadPath: "/infra/locales/{{ns}}.json",
      // path to post missing resources
      addPath: "locales/add/{{ns}}",
      // define how to stringify the data when adding missing resources
      stringify: JSON.stringify
    },
    cache: {
      enabled: true,
      prefix: "i18next_translations_",
      expirationTime: 24 * 60 * 60 * 1000 //one day
    },
    defaultNS: "base",
    fallbackLng: "en",
    initImmediate: true,
    ns: "base",
    debug: false
  });

export default i18n;
