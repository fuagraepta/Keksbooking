'use strict';

(function () {
  var typeFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var roomFilter = document.querySelector('#housing-rooms');
  var guestFilter = document.querySelector('#housing-guests');
  var featuresFilter = document.querySelector('.features');

  var ANY_VALUE = 'any';
  var LIMIT_PRICE = {
    min: 10000,
    middle: 50000
  };

  // Получение данных объявления
  var advertisingStore = [];

  var getAdvertisin = function () {
    if (window.advertisingData) {
      advertisingStore = window.advertisingData;
    }
    return advertisingStore;
  };

  window.filterPins = function () {
    // Фильтр по типу жилья
    var checkType = function (advertising) {
      return (typeFilter.value === advertising.offer.type) || (typeFilter.value === ANY_VALUE);
    };

    // Фильтр по цене
    var checkPrice = function (advertising) {
      switch (priceFilter.value) {
        case 'low':
          return advertising.offer.price < LIMIT_PRICE.min;
        case 'middle':
          return advertising.offer.price >= LIMIT_PRICE.min && advertising.offer.price <= LIMIT_PRICE.middle;
        case 'high':
          return advertising.offer.price > LIMIT_PRICE.middle;
        default:
          return true;
      }
    };

    // Фильтр по количеству комнат
    var checkRoomNumber = function (advertising) {
      return (+roomFilter.value === advertising.offer.rooms) || (roomFilter.value === ANY_VALUE);
    };

    // Фильтр по количеству гостей
    var checkGuestNumber = function (advertising) {
      return (+guestFilter.value === advertising.offer.guests) || (guestFilter.value === ANY_VALUE);
    };

    // Фильтр преимуществ
    var checkFeatures = function (advertising) {
      var checkedFeatures = Array.from(featuresFilter.querySelectorAll('input[type=checkbox]:checked'));
      var selectedFeatures = checkedFeatures.map(function (item) {
        return item.value;
      });
      return selectedFeatures.every(function (currentFeature) {
        return advertising.offer.features.includes(currentFeature);
      });
    };

    // Фильтр всех свойств
    var allFilteredPins = getAdvertisin().filter(checkType).filter(checkPrice).filter(checkRoomNumber).filter(checkGuestNumber).filter(checkFeatures);
    window.card.closePopup();
    window.pin.removePin();
    window.pin.addPin(allFilteredPins);
    window.map.synhPinAndCards(allFilteredPins);
  };

  var onFilterChange = window.utils.debounce(window.filterPins);

  typeFilter.addEventListener('change', onFilterChange);
  priceFilter.addEventListener('change', onFilterChange);
  roomFilter.addEventListener('change', onFilterChange);
  guestFilter.addEventListener('change', onFilterChange);
  featuresFilter.addEventListener('change', onFilterChange, true);
})();
