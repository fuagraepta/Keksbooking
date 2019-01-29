'use strict';
(function () {
  var cityMap = document.querySelector('.map');
  var ESC_KEYCODE = 27;
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT = 750;

window.map = {
    'mapPinMain': cityMap.querySelector('.map__pin--main'),
    'MAIN_PIN_TAIL': 20,
    'MAIN_PIN_HEIGHT': 60,
    'X_MAX_COORD': 1170,
    'X_MIN_COORD': 30,
    'Y_MAX_COORD': 660,
    'Y_MIN_COORD': 130,

    // Активация карты и формы для подачи объявления
    'enabledMap': function () {
      cityMap.classList.remove('map--faded');
      window.form.enabledForm();
      addEventToPin(enabledPins(offerPins));
    },

    // Деактивация карты
    'disabledMap': function () {
      cityMap.classList.add('map--faded');
      disabledPins(offerPins);
      setMainPinCoordsDefault();
    }
  };

  // Взаимодействие с метками объявления
  // Добавление метки объявления на карту
  var addOfferMark = function (element) {
    var mapPins = cityMap.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < element.length; i++) {
      fragment.appendChild(window.getPin(element[i]));
      mapPins.appendChild(fragment);
    }
  };

  addOfferMark(window.data);
  var offerPins = cityMap.querySelectorAll('.map__pin');

  // Активация меток на карте
  var enabledPins = function (noActivPin) {
    for (var i = 1; i < noActivPin.length; i++) {
      noActivPin[i].classList.remove('hidden');
    }
    return noActivPin;
  };

  // Деакттвация меток на карте
  var disabledPins = function (activPin) {
    for (var i = 1; i < activPin.length; i++) {
      activPin[i].classList.add('hidden');
    }
  };

  // Маркировка выбраной на карте отметки
  var markPin = function (unmarkPin) {
    unmarkPin.classList.add('map__pin--active');
  };

  // Снятие маркировки с отметки
  var unmarkPin = function (markPins) {
    // var pins = cityMap.querySelectorAll('.map__pin');
    for (var i = 1; i < markPins.length; i++) {
      markPins[i].classList.remove('map__pin--active');
    }
  };

  // Сброс кординат основной метки по умолчанию
  var setMainPinCoordsDefault = function () {
    window.map.mapPinMain.style.left = window.utils.getHalf(MAP_WIDTH) + 'px';
    window.map.mapPinMain.style.top = window.utils.getHalf(MAP_HEIGHT) + 'px';
  };

  window.map.disabledMap();

  // Взаимодействие с карточками объявления
  // Добавление объявления в DOM
  var addAdvertising = function (element) {
    var mapFilters = cityMap.querySelector('.map__filters-container');
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.getCard(element));
    cityMap.insertBefore(fragment, mapFilters);
  };

  // Открыть попап с объявлением
  var openPopup = function (offer) {
    addAdvertising(offer);
    document.addEventListener('keydown', popupPressEscHendler);
    var popupClose = cityMap.querySelector('.popup__close');
    popupClose.addEventListener('click', closePopup);
  };

  // Закрыть попап с объявлением
  var closePopup = function () {
    if (cityMap.querySelector('.popup')) {
      var popup = cityMap.querySelector('.popup');
      cityMap.removeChild(popup);
      unmarkPin(offerPins);
    }
    document.removeEventListener('keydown', popupPressEscHendler);
  };

  // Закрытие попап по нажатию на ESC
  var popupPressEscHendler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  // Добавление обработчиков событий для открытия и закрытия объявления по щелчку на каждую метку
  var addPinClickHendler = function (pin, offer) {
    pin.addEventListener('click', function () {
      openPopup(offer);
      markPin(pin);
    });
  };

  var addPinCloseClickHendler = function (mark) {
    mark.addEventListener('click', function () {
      closePopup();
    });
  };

  var addEventToPin = function (pins) {
    for (var i = 0; i < window.data.length; i++) {
      addPinCloseClickHendler(pins[i + 1]);
      addPinClickHendler(pins[i + 1], window.data[i]);
    }
  };
})();
