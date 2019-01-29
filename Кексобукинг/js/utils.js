'use strict';

// Вспомогательные функции
(function () {

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
    'getRandomArray': function (someArray) {
      for (var i = someArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tempValue = someArray[i];
        someArray[i] = someArray[j];
        someArray[j] = tempValue;
      }
      return someArray;
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
    }
  };


})();
