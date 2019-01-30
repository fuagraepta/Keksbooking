'use strict';

(function () {
  // Данные необходимые для объявлений
  var OFFER_NUMBER = 8;
  var OFFERS_INFORMATION = {
    'title': ['Большая уютная квартира', 'Маленькая не уютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    'price': {
      'min': 1000,
      'max': 1000000
    },
    'type': ['palace', 'flat', 'house', 'bungalo'],
    'rooms': {
      'min': 1,
      'max': 5
    },
    'guests': {
      'min': 1,
      'max': 10
    },
    'checkin': ['12:00', '13:00', '14:00'],
    'checkout': ['12:00', '13:00', '14:00'],
    'features': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    'photos': ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    'location': {
      'x': {
        'min': 20,
        'max': 1180
      },
      'y': {
        'min': 130,
        'max': 630
      }
    }
  };

  // Генерация списка авторов объявлений
  var getAutorList = function (AuthorNumber) {
    var authorsList = [];
    for (var i = 0; i < AuthorNumber; i++) {
      var avatar = 'img/avatars/user0' + (i + 1) + '.png';
      authorsList.push(avatar);
    }
    return window.utils.getRandomArray(authorsList);
  };

  var authors = getAutorList(OFFER_NUMBER);

  // Генерация содержимого объявлений.
  var fillOffer = function (offerData) {
    var offersContent = [];
    for (var i = 0; i < OFFER_NUMBER; i++) {
      var offerDescription = {
        'title': offerData.title[i],
        'address': '',
        'price': window.utils.getRandomValue(offerData.price.max, offerData.price.min),
        'type': offerData.type[window.utils.getRandomValue(offerData.type.length)],
        'rooms': window.utils.getRandomValue(offerData.rooms.max, offerData.rooms.min),
        'guests': window.utils.getRandomValue(offerData.guests.max, offerData.guests.min),
        'checkin': offerData.checkin[window.utils.getRandomValue(offerData.checkin.length)],
        'checkout': offerData.checkout[window.utils.getRandomValue(offerData.checkout.length)],
        'feature': window.utils.getRandomArrayLength(offerData.features),
        'description': '',
        'photos': window.utils.getRandomArray(offerData.photos)
      };
      offersContent.push(offerDescription);
    }
    return window.utils.getRandomArray(offersContent);
  };

  var filling = fillOffer(OFFERS_INFORMATION);

  // Сборка объявлений в целое
  var createOfferDataList = function (offerAuthor, offerContent) {
    var offersList = [];
    for (var i = 0; i < OFFER_NUMBER; i++) {
      var offer = {
        author: {
          avatar: offerAuthor[i]
        },
        offer: offerContent[i],
        location: {
          x: window.utils.getRandomValue(OFFERS_INFORMATION.location.x.max, OFFERS_INFORMATION.location.x.min),
          y: window.utils.getRandomValue(OFFERS_INFORMATION.location.y.max, OFFERS_INFORMATION.location.y.min)
        },
      };
      offer.offer.address = offer.location.x + ',' + ' ' + offer.location.y;
      offersList.push(offer);
    }
    return offersList;
  };

  window.data = createOfferDataList(authors, filling);
})();
