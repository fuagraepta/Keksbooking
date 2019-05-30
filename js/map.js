'use strict';
(function () {
  var MapSetting = {
    'WIDTH': 1200,
    'HEIGHT': 750,
    'MAIN_PIN_TAIL': 20,
    'MAIN_PIN_HEIGHT': 60,
    'X_MAX_COORD': 1170,
    'X_MIN_COORD': 30,
    'Y_MAX_COORD': 660,
    'Y_MIN_COORD': 130
  };

  var map = {
    'cityMap': document.querySelector('.map'),
    // Получение координат основной метки
    'getMainPinCoord': function () {
      return mapPinMain.offsetLeft + ', ' + (mapPinMain.offsetTop + window.utils.getHalf(MapSetting.MAIN_PIN_HEIGHT) + MapSetting.MAIN_PIN_TAIL);
    },
    // Деактивация карты
    'disabledMap': function () {
      this.cityMap.classList.add('map--faded');
      disabledFilters();
      setMainPinCoordsDefault();
      window.pin.removePin();
      window.card.closePopup();
    },
    // Синхронизация меток с карточками
    'synhPinAndCards': function (offersCard) {
      var pins = getPins();
      for (var i = 0; i < offersCard.length; i++) {
        addOnPinClickCloseCard(pins[i + 1]);
        addOnPinClickOpenCard(pins[i + 1], offersCard[i]);
      }
    }
  };

  // Активация карты и формы для подачи объявления
  var enabledMap = function () {
    map.cityMap.classList.remove('map--faded');
    enabledFilters();
    window.form.enabledForm();
    window.filterPins();
  };

  var mapFilter = map.cityMap.querySelector('.map__filters-container');

  // Активация фильта
  var enabledFilters = function () {
    mapFilter.classList.remove('hidden');
  };

  // Блокировка фильтра
  var disabledFilters = function () {
    mapFilter.classList.add('hidden');
  };

  disabledFilters();

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
    markPins.forEach(function (pin) {
      pin.classList.remove('map__pin--active');
    });
  };

  // Сброс координат основной метки по умолчанию
  var mapPinMain = map.cityMap.querySelector('.map__pin--main');

  var setMainPinCoordsDefault = function () {
    mapPinMain.style.left = window.utils.getHalf(MapSetting.WIDTH) + 'px';
    mapPinMain.style.top = window.utils.getHalf(MapSetting.HEIGHT) + 'px';
  };

  // Добавление обработчиков событий для открытия объявления по щелчку на метку
  var addOnPinClickOpenCard = function (pin, offer) {
    if (pin) {
      pin.addEventListener('click', function () {
        window.card.openPopup(offer);
        markPin(pin);
      });
    }
  };

  // Добавление обработчиков событий для закрытия объявления по щелчку на другую метку
  var addOnPinClickCloseCard = function (mark) {
    if (mark) {
      mark.addEventListener('click', function () {
        window.card.closePopup();
        unmarkPin(getPins());
      });
    }
  };

  // Drag and drop основной метки объявления
  var Coords = function (x, y) {
    this.x = x;
    this.y = y;
  };

  mapPinMain.addEventListener('mousedown', function (evt) {

    var startCoords = new Coords(evt.clientX, evt.clientY);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = new Coords(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);

      startCoords = new Coords(moveEvt.clientX, moveEvt.clientY);

      if (mapPinMain.offsetTop < MapSetting.Y_MIN_COORD) {
        mapPinMain.style.top = MapSetting.Y_MIN_COORD + 'px';
      } if (mapPinMain.offsetTop > MapSetting.Y_MAX_COORD) {
        mapPinMain.style.top = MapSetting.Y_MAX_COORD + 'px';
      } if (mapPinMain.offsetLeft < MapSetting.X_MIN_COORD) {
        mapPinMain.style.left = MapSetting.X_MIN_COORD + 'px';
      } if (mapPinMain.offsetLeft > MapSetting.X_MAX_COORD) {
        mapPinMain.style.left = MapSetting.X_MAX_COORD + 'px';
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
