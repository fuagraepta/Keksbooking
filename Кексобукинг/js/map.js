'use strict';

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var mapCardTemplate = document.querySelector('template')
.content.querySelector('.map__card');
var mapPinTemplate = document.querySelector('template')
.content.querySelector('.map__pin');
var MAP_PIN_TAIL_HEIGHT = 18;
var MAP_PIN_HEIGHT = 44;
var OFFER_TYPE_RU = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

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
  'x': {
    'min': 0,
    'max': 1180,
  },
  'y': {
    'min': 130,
    'max': 630
  }
};

// Вспомогательные функции

// Функия получения случайного значения
var getRandomValue = function (max, min) {
  if (min) {
    return Math.floor(Math.random() * (max)) + min;
  } else {
    return Math.floor(Math.random() * (max));
  }
};

// Функция случайной сортировки массива из другова массива
var getRandomArray = function (someArray) {
  for (var i = someArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tempValue = someArray[i];
    someArray[i] = someArray[j];
    someArray[j] = tempValue;
  }
  return someArray;
};

// Функция  получения массива с произвльной длиной
var getRandomArrayLength = function (someArray) {
  var randomArray = [];
  for (var i = 0; i <= getRandomValue(someArray.length); i++) {
    randomArray.push(someArray[i]);
  }
  return randomArray;
};

// Получение елементов разметки
var getDefiniteElement = function (parentElement, elementSelector, elementContent) {
  var element = parentElement.querySelector(elementSelector);
  if (elementContent) {
    element.textContent = elementContent;
  }
  return element;
};

// Основной код

// Генерация списка авторов объявлений
var getAutorList = function (AuthorNumber) {
  var authorsList = [];
  for (var i = 0; i < AuthorNumber; i++) {
    var avatar = 'img/avatars/user0' + (i + 1) + '.png';
    authorsList.push(avatar);
  }
  return getRandomArray(authorsList);
};

var authors = getAutorList(OFFER_NUMBER);

// Генерация содержимого объявлений.
var fillOffer = function (offerData) {
  var offersContent = [];
  for (var i = 0; i < OFFER_NUMBER; i++) {
    var offerDescription = {
      'title': offerData.title[i],
      'address': '',
      'price': getRandomValue(offerData.price.max, offerData.price.min),
      'type': offerData.type[getRandomValue(offerData.type.length)],
      'rooms': getRandomValue(offerData.rooms.max, offerData.rooms.min),
      'guests': getRandomValue(offerData.guests.max, offerData.guests.min),
      'checkin': offerData.checkin[getRandomValue(offerData.checkin.length)],
      'checkout': offerData.checkout[getRandomValue(offerData.checkout.length)],
      'feature': getRandomArrayLength(offerData.features),
      'description': '',
      'photos': getRandomArray(offerData.photos)
    };
    offersContent.push(offerDescription);
  }
  return getRandomArray(offersContent);
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
        x: getRandomValue(OFFERS_INFORMATION.x.max, OFFERS_INFORMATION.x.min),
        y: getRandomValue(OFFERS_INFORMATION.y.max, OFFERS_INFORMATION.y.min)
      },
    };
    offer.offer.address = offer.location.x + ',' + ' ' + offer.location.y;
    offersList.push(offer);
  }
  return offersList;
};

var offers = createOfferDataList(authors, filling);

// Отрисовка метки объявления
var renderOfferCoords = function (offersMark) {
  var pin = mapPinTemplate.cloneNode(true);
  pin.style = 'left:' + offersMark.location.x + 'px;' + 'top:' +
  (offersMark.location.y - MAP_PIN_TAIL_HEIGHT) + 'px';
  pin.firstElementChild.src = offersMark.author.avatar;
  pin.firstElementChild.alt = offersMark.offer.title;
  return pin;
};

// Добавление метки объявления в DOM
var addOfferCoords = function (element) {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < element.length; i++) {
    fragment.appendChild(renderOfferCoords(element[i]));
    mapPins.appendChild(fragment);
  }
};

addOfferCoords(offers);

// Отрисовка объявления
var markingOffer = function (advertising) {
  var popup = mapCardTemplate.cloneNode(true);
  var popupAvatar = getDefiniteElement(popup, '.popup__avatar'); // Аватарка
  popupAvatar.src = advertising.author.avatar;
  var popupPrice = getDefiniteElement(popup, '.popup__text--price', advertising.offer.price); // Цена
  popupPrice.textContent += ' ₽/Ночь';
  var popupCapacity = getDefiniteElement(popup, '.popup__text--capacity'); // Вмистительность помешения
  popupCapacity.textContent = advertising.offer.rooms + ' комнаты для ' + advertising.offer.guests + ' гостей';
  var popupTime = getDefiniteElement(popup, '.popup__text--time');
  popupTime.textContent = 'Заезд после ' + advertising.offer.checkin + ', выезд до ' + advertising.offer.checkout;
  var popupFeatures = popup.querySelectorAll('.feature'); // Преимушества

  for (var i = 0; i < popupFeatures.length; i++) {
    if (i >= advertising.offer.feature.length) {
      popupFeatures[i].classList.remove('feature');
    }
  }

  var popupPhotos = getDefiniteElement(popup, '.popup__photos'); // Фотографии объявления
  var popupPhotoItem = popupPhotos.querySelector('li');

  for (var j = 0; j < advertising.offer.photos.length; j++) {
    var itemImg = document.createElement('img');
    itemImg.src = advertising.offer.photos[j];
    itemImg.style.width = '60px';
    itemImg.style.height = '60px';
    popupPhotoItem.appendChild(itemImg);
  }

  getDefiniteElement(popup, '.popup__title', advertising.offer.title); // Заголовок объявления
  getDefiniteElement(popup, '.popup__text--address', advertising.offer.address); // Адресс объявления
  getDefiniteElement(popup, '.popup__type', OFFER_TYPE_RU[advertising.offer.type]); // Тип жилья
  getDefiniteElement(popup, '.popup__description', advertising.offer.description); // Описание

  return popup;
};

// Добавление объявления в DOM
var addAdvertising = function (element) {
  var mapFilters = document.querySelector('.map__filters-container');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < 1; i++) {
    fragment.appendChild(markingOffer(element[i]));
    map.insertBefore(fragment, mapFilters);
  }
};

addAdvertising(offers);
