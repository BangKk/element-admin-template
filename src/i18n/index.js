import Vue from 'vue';
import axios from 'axios';
import Element from 'element-ui';
import VueI18n from 'vue-i18n';
import localStorage from '@/libs/localStorage';

Vue.use(VueI18n);

export const CN = 'cn';
export const EN = 'en';

const loadedLanguages = [];

export const i18n = new VueI18n({
  locale: CN, // set locale
  fallbackLocale: CN,
  messages: {}
});

Vue.use(Element, {
  i18n: (key, value) => i18n.t(`element.${key}`, value)
});

function setI18nLanguage(lang) {
  localStorage.set('lang', lang);
  i18n.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
  return i18n;
}

export function loadLanguageAsync(lang) {
  if (loadedLanguages.length === 0) {
    return import(/* webpackChunkName: "lang-[request]" */ `./${lang}`).then(
      msgs => {
        i18n.setLocaleMessage(lang, msgs.default.messages);
        loadedLanguages.push(lang);
        return setI18nLanguage(lang);
      }
    );
  } else if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(/* webpackChunkName: "lang-[request]" */ `./${lang}`).then(
        msgs => {
          i18n.setLocaleMessage(lang, msgs.default.messages);
          loadedLanguages.push(lang);
          return setI18nLanguage(lang);
        }
      );
    }
    return Promise.resolve(setI18nLanguage(lang));
  }
  return Promise.resolve(i18n);
}
