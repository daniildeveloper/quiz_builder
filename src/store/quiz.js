import Vue from 'vue';
import uuid from '../utils/uuid';
import ccc from 'ccc';
import _ from 'lodash';
import queryString from 'query-string';
import numeral from 'numeral';

/**
 * Получает extra для заявки из query string, переданной из quiz-script
 */
const getExtraFromQS = () => {
  const qs = queryString.parse(window.location.search);
  const extra = {
    domain: qs.origin,
  };
  try {
    const utm = qs.utm ? JSON.parse(qs.utm) : null;
    if (utm) {
      extra.utm = utm;
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  }
  try {
    const cookies = qs.cookies ? JSON.parse(qs.cookies) : null;
    if (cookies) {
      extra.cookies = cookies;
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  }

  return extra;
};

// Валюты с символами
const currencyObj = {
  USD: '$',
  RUR: '₽',
  EUR: '€',
  UAH: '₴',
  BYB: 'Br',
  KZT: '₸',
};


export default {
  namespaced: true,
  state: {
    // Загружен ли квиз
    loaded: false,
    // ID квиза
    id: null,
    // Вопросы
    questions: [],
    // Индекс текущего вопроса
    activeQuestion: 0,
    // ID текущего вопроса
    answerId: null,
    // Информация о квизе
    info: {
      title: '',
      assistant: {
        name: '',
        title: '',
        avatar: '',
      },
      form: {
        text: '',
        fields: ['name', 'phone', 'email'],
        thanks: '',
        extra: '',
      },
      marketing: {
        discount: {},
      },
      design: {
        colors: {
          main: '#ca2f94',
        },
      },
    },
    // Скидка
    discount: 0,
    // Зафиксированная скидка
    fixedDiscount: 0,
    // Ответы на текущий вопрос
    answers: [],
  },
  getters: {
    // Возвращает текущий вопрос
    getQuestion(state) {
      return state.questions[state.activeQuestion];
    },
    // Возвращает общее количество вопросов
    countQuestions(state) {
      return state.questions.length + 1;
    },
    // Возвращает порядковый номер текущего вопроса
    questionNumber(state) {
      return state.activeQuestion + 1;
    },
    // Проверяет на тип - нарастающая скидка
    isIncreasingDiscount(state) {
      const discount = _.get(state, 'info.marketing.discount');
      return discount && discount.type === 'increasing';
    },
    // Проверяет на тип - нарастающий процент
    isIncreasingPercentDiscount(state) {
      const discount = _.get(state, 'info.marketing.discount');
      return discount && discount.type === 'increasingPercent';
    },
    // Возвращает форматированную скидку
    formattedDiscount(state) {
      return numeral(state.discount).format('0,0');
    },
    // Возвращает шаг нарастающей скидки
    getIncreasingDiscountStep(state, getters) {
      const discount = _.get(state, 'info.marketing.discount');
      return numeral(Math.round(_.get(discount, 'value') / getters.countQuestions)).format('0,0');
    },
    // Возвращает шаг нарастающего процента
    getIncreasingPercentDiscountStep(state, getters) {
      const discount = _.get(state, 'info.marketing.discount');
      return numeral(Math.floor((_.get(discount, 'percent') / getters.countQuestions) * 100) / 100).format('0,0');
    },
    // Возвращает символ валюты скидки
    currencySymbol(state) {
      return currencyObj[_.get(state, 'info.marketing.discount.currency')] || currencyObj.RUR;
    },
    // Возвращает последний шаг
    getLastStep(state, getters) {
      return getters.countQuestions;
    },
    // Возвращает, является ли текущий шаг финальным
    isLastStep(state, getters) {
      return getters.getLastStep === state.activeQuestion;
    },
    // Возвращает значение ответа
    getAnswerValue(state, getters) {
      const question = getters.getQuestion;
      if (!question) return null;
      const isMany = question.select === 'many';
      if (!state.answers[state.activeQuestion]) return isMany ? [] : null;
      const answer = state.answers[state.activeQuestion].a;
      if (!answer || answer.length === 0) return isMany ? [] : null;

      return answer;
    },
    // Вовзращает пройденный процент вопросов
    getPassedPercent(state) {
      return (state.activeQuestion) / state.questions.length;
    },
    // Возвращает, есть ли ответ на текущий вопрос
    getIsFilled(state, getters) {
      if (!getters.getQuestion) return false;
      if (getters.getQuestion.select === 'many') return !!getters.getAnswerValue.length;
      return !!getters.getAnswerValue;
    },
    // Возвращает активные поля для шага 1
    // или поля по-умолчанию, если в квизе нет информации о полях
    getEnabledField1(state) {
      return state.info.form.fields1 ? state.info.form.fields1.filter(v => v.enabled) : [{ key: 'email', name: 'Email', enabled: true }];
    },
    // Возвращает активные поля для шага 2
    // или поля по-умолчанию, если в квизе нет информации о полях
    getEnabledField2(state) {
      return state.info.form.fields2 ? state.info.form.fields2.filter(v => v.enabled) : [
        { key: 'name', name: 'Имя', enabled: true },
        { key: 'phone', name: 'Телефон', enabled: true },
      ];
    },
    // Цвета, генерируются из основного с помощью ccc
    colors(state) {
      const main = _.get(state, 'info.design.colors.main', '#ca2f94') || '#ca2f94';
      const isDark = ccc(main).darken(7).dark();
      return {
        main,
        lighten: ccc(main).lighten(20).hex(),
        lighten2: ccc(main).lighten(35).hex(),
        alpha: ccc(main).alpha(0.5).rgbString(),
        text: isDark ? '#ffffff' : '#000000',
        text2: isDark ? main : '#000000',
      };
    },
    // Перескакивать ли на следующий вопрос автоматически
    // Отключается, если в одном из вопросов можно выбрать несколько
    // вариантов ответа или есть вопрос с полем "другое"
    autoNextQuestion(state) {
      let autoNextQuestion = true;
      state.questions.forEach((question) => {
        if (question.select === 'many') {
          autoNextQuestion = false;
        }
        if (question.other) {
          autoNextQuestion = false;
        }
      });
      return autoNextQuestion;
    },
  },
  mutations: {
    // Устанавливает вопросы
    setQuestions(state, questions) {
      questions.sort((a, b) => {
        if (a.order < b.order) return -1;
        else if (a.order > b.order) return 1;
        else if (a.order === b.order) return 0;
        return 0;
      });
      state.questions = questions;
    },
    // Устанавливает текущий вопрос
    setActiveQuestion(state, index) {
      let i = index;
      if (i < 0) i = 0;
      if (i > (state.questions.length)) i = state.questions.length;
      state.activeQuestion = i;
    },
    // Устанавливает информацию о квизе
    setInfo(state, info) {
      state.info = { ...state.info, ...info };
      if (!info.form.fields.length) {
        Vue.set(state.info.form, 'fields', ['name', 'phone', 'email']);
      }
    },
    // Устанавливает id квиза
    setId(state, id) {
      state.id = id;
    },
    // Устанавливает ответ на вопрос
    setAnswerValue(state, answer) {
      // const id = state.questions[state.activeQuestion].id;
      const answerObject = {
        q: state.questions[state.activeQuestion].title,
        a: answer,
      };

      Vue.set(state.answers, state.activeQuestion, answerObject);
    },
    // Устанавливает загрузку страницы выполненной
    loaded(state) {
      state.loaded = true;
    },
    // Устанавливает id ответа
    setAnswerId(state, id) {
      state.answerId = id;
    },
    // Устанавливает скидку
    setDiscount(state, value) {
      state.discount = value;
    },
    setCurrency(state, currency) {
      state.currency = currency;
    },
    fixDiscount(state) {
      state.fixedDiscount = state.discount;
    },
  },
  actions: {
    // Получает информацию о квизе по апи
    async get({ commit, state, getters }, id) {
      const response = await Vue.axios.get(`v1/Quizzes/${id}`);
      const quizData = response.data;
      commit('loaded');

      // Обозначает готовность пользователя проходить квиз
      const readyPromise = new Promise((resolve) => {
        window.onmousemove = () => {
          resolve();
          window.isActive = true;
        };
      });

      commit('setQuestions', quizData.questions);
      commit('setInfo', quizData.info);
      commit('setId', quizData.id);

      const lng = _.get(quizData, 'info.design.lng');
      if (lng) commit('setLang', lng, { root: true });

      // Аналитика
      const analyticPromises = [readyPromise];
      // Наш общий счетчик метрики отключен
      // analyticPromises.push(Vue.analytic.init({ yaCounterId: 46117494 }));
      const metrikaId = _.get(quizData, 'info.analytic.metrika.id');
      if (metrikaId) {
        analyticPromises.push(Vue.analytic.init({ yaCounterId: metrikaId }));
      }
      // Наш счётчик гугл-аналитики
      const gaIds = ['UA-113524925-1'];
      const userGaId = _.get(quizData, 'info.analytic.ga.id');
      if (userGaId) gaIds.push(userGaId);
      if (gaIds.length) {
        analyticPromises.push(Vue.analytic.init({ gaIds }));
      }
      Promise.all(analyticPromises).then(() => {
        Vue.analytic.event('marquiz-start');
      });

      // Маркетинг
      if (quizData.info.marketing) {
        const marketing = quizData.info.marketing;
        // Тающая скидка>
        if (marketing.discount && marketing.discount.type === 'melting') {
          // Тает из того расчета, что на каждый вопрос отводится 60 секунд
          const updateTime = 1000;
          const diff = Math.round(
            (marketing.discount.value / 60 / getters.countQuestions) * 1.5);
          let price = marketing.discount.value;
          const currency = _.get(marketing, 'discount.currency');
          commit('setDiscount', price);
          commit('setCurrency', currency);
          // Скидка может истекать только когда квиз открыт
          window.onblur = () => { window.isActive = false; };
          const interval = setInterval(() => {
            if (window.isActive) {
              price = state.discount - diff > 0 ? state.discount - diff : 0;
              commit('setDiscount', price);
              if (price === 0 || getters.isLastStep) {
                clearInterval(interval);
              }
            }
          }, updateTime);
        }
        if (marketing.discount && marketing.discount.type === 'increasing') {
          commit('setDiscount', Math.round(marketing.discount.value / getters.countQuestions));
        }
        if (marketing.discount && marketing.discount.type === 'increasingPercent') {
          commit('setDiscount', Math.floor((marketing.discount.percent / getters.countQuestions) * 100) / 100);
        }
      }
    },
    // Переключает на следующий вопрос
    nextQuestion({ state, commit, getters, dispatch }) {
      if (!getters.getIsFilled) return;
      const step = state.activeQuestion + 1;
      Vue.analytic.event(`marquiz-step${step}`);
      if (step === (getters.getLastStep - 1)) {
        Vue.analytic.event('marquiz-form');
      }
      // Редирект сразу если все поля выключены
      if (state.info.form.redirect && step === (getters.getLastStep - 1)
        && !getters.getEnabledField1.length && !getters.getEnabledField2.length) {
        dispatch('sendAnswers', {}).then(() => {
          dispatch('redirect');
        });
      } else {
        if (getters.isIncreasingDiscount) {
          const discount = state.info.marketing.discount;
          commit('setDiscount',
            Math.round((discount.value / getters.countQuestions) * (getters.questionNumber + 1)));
        }
        if (getters.isIncreasingPercentDiscount) {
          const discount = state.info.marketing.discount;
          const percentsByStep = discount.percent / getters.countQuestions;
          commit('setDiscount',
            (Math.floor(percentsByStep * (getters.questionNumber + 1) * 100)) / 100);
        }
        commit('setActiveQuestion', step);
      }
    },
    // Переключает на предыдущий вопрос
    prevQuestion({ state, commit, getters }) {
      if (getters.isIncreasingDiscount) {
        const discount = state.info.marketing.discount;
        commit('setDiscount',
          Math.round((discount.value / getters.countQuestions) * (getters.questionNumber - 1)));
      }
      commit('setActiveQuestion', state.activeQuestion - 1);
    },
    // Сохраняет ответ
    setAnswer({ commit, dispatch, getters }, answer) {
      const question = getters.getQuestion;
      commit('setAnswerValue', answer);
      // Если можно выбрать только одно значение, то сразу перебрасываем на следующий в��прос
      if (getters.autoNextQuestion && (!question.type || question.type === 'answers') && question.select === 'one' && !question.other) {
        setTimeout(() => {
          dispatch('nextQuestion');
        }, 400);
      }
    },
    // Отправляет ответы по апи
    sendAnswers({ state, commit }, contacts) {
      const answers = state.answers;
      const extra = getExtraFromQS();
      if (state.fixedDiscount) {
        extra.discount = state.fixedDiscount;
      }

      const data = {
        quizId: state.id,
        answers2: answers,
        clientId: uuid.get(),
        contacts,
        extra,
      };

      let promise = new Promise(() => {});
      if (state.answerId) {
        promise = Vue.axios.patch(`/v1/answers/${state.answerId}`, data);
      } else {
        promise = Vue.axios.post('/v1/answers', data);
      }
      promise.then((res) => {
        if (!state.answerId) {
          // Аналитика, контакты шаг 1
          Vue.analytic.event('marquiz-contacts1');
        } else {
          // Аналитика, контакты шаг 2
          Vue.analytic.event('marquiz-contacts2');
        }
        commit('setAnswerId', res.data.id);
      });

      return promise;
    },
    finish() {
      Vue.analytic.event('marquiz-finish');
    },
    // Редирект
    redirect({ state }) {
      const redirectUrl = _.get(state, 'info.form.redirect');
      if (redirectUrl) {
        window.top.location.href = redirectUrl;
      }
    },
  },
};



// WEBPACK FOOTER //
// ./src/store/quiz.js