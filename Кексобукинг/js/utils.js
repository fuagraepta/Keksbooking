'use strict';

// Вспомогательные функции
(function () {
  var ESC_KEYCODE = 27;

window.utils = {
    // Функия получения случайного значения
    'getRandomValue': function (max, min) {
      if (min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        return Math.floor(Math.random() * (max));
      }
    },
    // Функция случайной сортировки массива из другова массива
    'getRandomArray': function (sourceArray) {
      for (var i = sourceArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tempValue = sourceArray[i];
        sourceArray[i] = sourceArray[j];
        sourceArray[j] = tempValue;
      }
      return sourceArray;
    },
    // Функция  получения массива с произвльной длиной
    'getRandomArrayLength': function (someArray) {
      var randomArray = [];
      for (var i = 0; i <= window.utils.getRandomValue(someArray.length); i++) {
        randomArray.push(someArray[i]);
      }
      return randomArray;
    },
    // Получение елементов разметки
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
    'isEscPressEvent': function (escEvt, action) {
      if (escEvt.keyCode === ESC_KEYCODE) {
        action();
      }
    }
  };
})();
