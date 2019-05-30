'use strict';

(function () {
  // Разметка метки объявления
  var mapPins = document.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('template')
  .content.querySelector('.map__pin');
  var PIN_TAIL = 40;
  var PIN_NUMBER = 5;

  var getPin = function (offerMark) {
    var pin = mapPinTemplate.cloneNode(true);
    pin.style = 'left:' + offerMark.location.x + 'px;' + 'top:' +
    (offerMark.location.y - PIN_TAIL) + 'px';
    pin.firstElementChild.src = offerMark.author.avatar;
    pin.firstElementChild.alt = offerMark.offer.title;
    return pin;
  };

  var pin = {
    // Добавление метки объявления на карту
    'addPin': function (offerPin) {
      var pinNumber = offerPin.length > PIN_NUMBER ? PIN_NUMBER : offerPin.length;
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < pinNumber; i++) {
        fragment.appendChild(getPin(offerPin[i]));
        mapPins.appendChild(fragment);
      }
    },
    // Удаление метки объявления с карты
    'removePin': function () {
      var pins = mapPins.querySelectorAll('.map__pin');
      for (var i = 1; i < pins.length; i++) {
        mapPins.removeChild(pins[i]);
      }
    }
  };
  window.pin = pin;
})();
