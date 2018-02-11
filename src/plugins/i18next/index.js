import i18next from 'i18next/index.js'
import numeral from 'numeral/numeral'
import 'numeral/locales/ru'
import moment from 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/ru'

const init = function ({ translations, lang }) {
  numeral.locale(lang)
  moment.locale('ru')

  i18next.init({
    resources: translations,
    // preload: ['ru', 'en'],
    lng: lang,
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      prefix: '{',
      suffix: '}',
      /**
       * Форматирование подставляемых значений
       * @see http://i18next.com/translate/formatting/
       * Дополнительно реализована поддержка нескольких форматов, перечисленных через " | "
       *
       * @param value
       * @param format
       * @param lng
       * @returns {*}
       */
      format (value, format, lng) {
        // Поддержка мультиформатов
        // Для мультиформатинга следует перечислить форматы, разделяя знаком ' | '
        // Например: $t('{- count, 0,0 | bold } объявлений', { count: 15567 })
        if (format.split('|').length >= 2) {
          const formats = format.split(' | ')
          formats.forEach((val, i) => {
            let f = val.trim()
            value = i18next.options.interpolation.format(value, f, lng)
          })
          return value
        }

        // Обрамляет value тегом "b"
        // Для использования нужно в подставляемом значении отключить escape
        // например, "{- count, bold }"
        if (format === 'bold') {
          return '<b>' + value + '</b>'
        }

        // Добавляет значок рубля после значения
        if (format === 'rub') {
          return value + '<i class="icontvil icontvil-Ruble"></i>'
        }

        // Форматирование чисел
        // Для вызова нужно в качестве формата указать соответсвующее значение из http://numeraljs.com
        // или "number", тогда значение будет отформатировано по-умолчанию как число (формат "0,0")
        // или "number 0,0", где 0,0 - формат
        if (typeof value === 'number' || format.split(' ')[0] === 'number') {
          let formatter = format.split(' ')[1]
          // Формат по-умолчанию
          if (format === 'number' && !formatter) formatter = '0,0'
          return numeral(value).format(formatter)
        }

        // Форматирование дат
        // Для вызова нужно в качестве формата указать соответсвующее значение из http://momentjs.com
        // или "date", тогда значение будет отформатировано по-умолчанию как дата формата "L"
        if (value instanceof Date || format === 'date') {
          if (format === 'date') format = 'L'
          return moment(value).format(format)
        }
        return value
      }
    },
    debug: false
  })

  i18next.on('languageChanged', function (lng) {
    numeral.locale(lng)
    moment.locale(lng)
  })
}

export default {
  install: function (Vue, { lang, translations }) {
    init(translations, lang)
    Vue.prototype.$t = (key, options = {}) => {
      options.lng = lang
      i18next.changeLanguage(lang)
      return i18next.t(key, options)
    }

    Vue.filter('translate', function (key) {
      return i18next.t(key)
    })
  }
}



// WEBPACK FOOTER //
// ./src/plugins/i18next/index.js