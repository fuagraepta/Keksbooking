'use strict';

// Модуль для работы с сервером
(function () {
  var SUCCESS_CODE = 200;
  var READY_STATE_SUCCESS = 4
  var TIMEOUT_LIMIT = 10000;

  var backend = {
    // Загрузка данных с сервера
    loadData: function (onLoad, onError) {
      var URL = 'https://javascript.pages.academy/keksobooking/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_CODE) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Превышено время ожидания запроса');
      });

      xhr.timeout = TIMEOUT_LIMIT;

      xhr.open('GET', URL);
      xhr.send();
    },
    // Отправка данных на сервер
    saveData: function (data, onLoad, onError) {
      var URL = 'https://javascript.pages.academy/keksobooking';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.readyState === READY_STATE_SUCCESS && xhr.status === SUCCESS_CODE) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка при отправки данных');
      });

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };

  window.backend = backend;
})();
