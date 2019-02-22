'use strict';
(function () {
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT = 750;
  var MAIN_PIN_TAIL = 20;
  var MAIN_PIN_HEIGHT = 60;
  var X_MAX_COORD = 1170;
  var X_MIN_COORD = 30;
  var Y_MAX_COORD = 660;
  var Y_MIN_COORD = 130;

  var map = {
    'cityMap': document.querySelector('.map'),
    // Получение координат основной метки
    'getMainPinCoord': function () {
      return mapPinMain.offsetLeft + ', ' + (mapPinMain.offsetTop + window.utils.getHalf(MAIN_PIN_HEIGHT) + MAIN_PIN_TAIL);
    },
    // Деактивация карты
    'disabledMap': function () {
      map.cityMap.classList.add('map--faded');
      disabledFilters();
      setMainPinCoordsDefault();
      window.pin.removePin();
      window.card.closePopup();
    },
    // Синхронизация меток с карточками
    'synhPinAndCards': function (offersCard) {
      var pins = getPins();
      for (var i = 0; i < offersCard.length; i++) {
        addOnPinClickClose(pins[i + 1]);
        addOnPinClickOpen(pins[i + 1], offersCard[i]);
      }
    }
  };

  var mapPinMain = map.cityMap.querySelector('.map__pin--main');

  // Активация карты и формы для подачи объявления
  var enabledMap = function () {
    map.cityMap.classList.remove('map--faded');
    enabledFilters();
    window.form.enabledForm();
    window.filterPins();
  };

  // Получение Элементов метки после активации карты
  var getPins = function () {
    var offerPins = map.cityMap.querySelectorAll('.map__pin');
    return offerPins;
  };

  // Маркировка выбранной на карте метки
  var markPin = function (unmarkPin) {
    unmarkPin.classList.add('map__pin--active');
  };

  // Снятие маркировки с метки
  var unmarkPin = function (markPins) {
    for (var i = 1; i < markPins.length; i++) {
      markPins[i].classList.remove('map__pin--active');
    }
  };

  // Сброс координат основной метки по умолчанию
  var setMainPinCoordsDefault = function () {
    mapPinMain.style.left = window.utils.getHalf(MAP_WIDTH) + 'px';
    mapPinMain.style.top = window.utils.getHalf(MAP_HEIGHT) + 'px';
  };

  var mapFilter = map.cityMap.querySelector('.map__filters-container');

  // Блокировка фильтра
  var disabledFilters = function () {
    mapFilter.classList.add('hidden');
  };

  disabledFilters();

  // Активация фильта
  var enabledFilters = function () {
    mapFilter.classList.remove('hidden');
  };

  // Добавление обработчиков событий для открытия объявления по щелчку на метку
  var addOnPinClickOpen = function (pin, offer) {
    if (pin) {
      pin.addEventListener('click', function () {
        window.card.openPopup(offer);
        markPin(pin);
      });
    }
  };

  // Добавление обработчиков событий для закрытия объявления по щелчку на другую метку
  var addOnPinClickClose = function (mark) {
    if (mark) {
      mark.addEventListener('click', function () {
        window.card.closePopup();
        unmarkPin(getPins());
      });
    }
  };

  // Drag and drop основной метки объявления
  mapPinMain.addEventListener('mousedown', function (evt) {

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (mapPinMain.offsetTop < Y_MIN_COORD) {
        mapPinMain.style.top = Y_MIN_COORD + 'px';
      } if (mapPinMain.offsetTop > Y_MAX_COORD) {
        mapPinMain.style.top = Y_MAX_COORD + 'px';
      } if (mapPinMain.offsetLeft < X_MIN_COORD) {
        mapPinMain.style.left = X_MIN_COORD + 'px';
      } if (mapPinMain.offsetLeft > X_MAX_COORD) {
        mapPinMain.style.left = X_MAX_COORD + 'px';
      } else {
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      enabledMap();
      window.form.getMainPinAdress();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  window.map = map;
})();
