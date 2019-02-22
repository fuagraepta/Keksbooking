'use strict';

// Вспомогательные функции
(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 50;

var utils = {
    // Функия получения случайного значения
    'getRandomValue': function (max, min) {
      if (min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        return Math.floor(Math.random() * (max));
      }
    },
    // Функция случайной сортировки массива
    'getRandomArray': function (sourceArray) {
      for (var i = sourceArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tempValue = sourceArray[i];
        sourceArray[i] = sourceArray[j];
        sourceArray[j] = tempValue;
      }
      return sourceArray;
    },
    // Функция  получения массива с произвольной длиной
    'getRandomArrayLength': function (someArray) {
      var randomArray = [];
      for (var i = 0; i <= window.utils.getRandomValue(someArray.length); i++) {
        randomArray.push(someArray[i]);
      }
      return randomArray;
    },
    // Получение элементов разметки
    'getDefiniteElement': function (parentElement, elementSelector, elementContent) {
      var element = parentElement.querySelector(elementSelector);
      if (elementContent) {
        element.textContent = elementContent;
      }
      return element;
    },
    // Получение половины значения
    'getHalf': function (value) {
      return value / 2;
    },
    // Выполнение действия по нажатию на кнопку ESC
    'isEscPressEvent': function (escEvt, action) {
      if (escEvt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    // Выводит сообщение об ошибке при отправки и получении данных с сервера
    'onError': function (errorMessage) {
      var errorPopup = document.querySelector('.error__popup');
      var errorPopupMessage = errorPopup.querySelector('.error__message');
      errorPopupMessage.textContent = errorMessage;
      errorPopup.classList.remove('hidden')

      window.setTimeout(function () {
        errorPopup.classList.add('hidden')
      }, 10000);
    },
    'debounce': function (cb) {
      var lastTimeout = null;

      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          cb.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
  window.utils = utils;
})();
