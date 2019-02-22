'use strict';

(function () {
  // Заполнение и валидация формы отправки объяления
  var noticeForm = document.querySelector('.notice__form');
  var allNoticeFormFieldset = noticeForm.querySelectorAll('fieldset');
  var allNoticeFormInputs = noticeForm.querySelectorAll('input');
  var inputAddress = noticeForm.querySelector('#address');
  var selectType = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  var timein = noticeForm.querySelector('#timein');
  var timeout = noticeForm.querySelector('#timeout');
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');
  var reset = noticeForm.querySelector('.form__reset');

  window.form = {
    // Активация формы для подачи объявления
    'enabledForm': function () {
      noticeForm.classList.remove('notice__form--disabled');
      for (var i = 0; i < allNoticeFormFieldset.length; i++) {
        allNoticeFormFieldset[i].disabled = false;
      }
    },
    // Получение  начального адреса основной метки
    'getMainPinAdress': function () {
      inputAddress.value = window.map.getMainPinCoord();
    }
  };

  // Сброс содержимого формы для Google Chrome (не отрабатывает input type = reset)
  var setInputValueDefault = function () {
    var textArea = noticeForm.querySelector('textarea');
    textArea.value = '';
    for (var i = 0; i < allNoticeFormInputs.length; i++) {
      allNoticeFormInputs[i].value = '';
      allNoticeFormInputs[i].checked = false;
    }
  };

  // Деактивация формы для подачи объявления
  var disabledForm = function () {
    noticeForm.classList.add('notice__form--disabled');
    for (var i = 0; i < allNoticeFormFieldset.length; i++) {
      allNoticeFormFieldset[i].disabled = true;
    }
  };

  disabledForm();

  //  Размещение делегирование на форму. При отправке подсвечивает не корректно заполненные поля.
  noticeForm.addEventListener('invalid', function (evt) {
    var target = evt.target;
    if (target.validity.valid === false) {
      target.classList.add('invalid');
    }
  }, true);

  // При выборе типа жилья меняется минимальная стоимость
  selectType.addEventListener('input', function () {
    if (selectType.value === 'flat') {
      price.min = 1000;
    }
    if (selectType.value === 'bungalo') {
      price.min = 0;
    }
    if (selectType.value === 'house') {
      price.min = 5000;
    }
    if (selectType.value === 'palace') {
      price.min = 10000;
    }
    price.placeholder = price.min;
  });

  // Функция синхронизации двух похожих(по длине) селектов
  var synchTime = function (selectOne, selectTwo) {
    selectOne.value = selectTwo.value;
  };

  // Время заезда синхронизируется со временем выезда
  timein.addEventListener('change', function () {
    synchTime(timeout, timein);
  });
  timeout.addEventListener('change', function () {
    synchTime(timein, timeout);
  });

  // Синхронизация комнат с количеством гостей
  var sinchRoomAndCapacity = function () {
    if (roomNumber.value === '1' && capacity.value !== '1') {
      roomNumber.setCustomValidity('для 1 гостя');
    } else if (roomNumber.value === '2' && capacity.value === '0') {
      roomNumber.setCustomValidity('для 2 гостей или для 1 гостя');
    } else if (roomNumber.value === '2' && capacity.value === '3') {
      roomNumber.setCustomValidity('для 2 гостей или для 1 гостя');
    } else if (roomNumber.value === '3' && capacity.value === '0') {
      roomNumber.setCustomValidity('для 3 гостей, для 2 гостей или для 1 гостя');
    } else if (roomNumber.value === '100' && capacity.value !== '0') {
      roomNumber.setCustomValidity('не для гостей');
    } else {
      roomNumber.setCustomValidity('');
    }
  };

  roomNumber.addEventListener('input', function () {
    sinchRoomAndCapacity();
  });

  capacity.addEventListener('input', function () {
    sinchRoomAndCapacity();
  });

  // Popup успешной отправки данных на сервер
  var successPopup = document.querySelector('.popup__success');

  // Закрыть popup
  var closeSuccessPopup = function () {
    successPopup.classList.add('hidden');
    setDefaultSetup();
    document.removeEventListener('keydown', onSuccessPopupPressEsc)
    document.removeEventListener('click', onDocumentClick);
  };

  // Открыть popup
  var openSuccessPopup = function () {
    successPopup.classList.remove('hidden');
    document.addEventListener('keydown', onSuccessPopupPressEsc);
    document.addEventListener('click', onDocumentClick);
  };

  // Закрыть popup по нажатию на ESC
  var onSuccessPopupPressEsc = function (escEvt) {
    window.utils.isEscPressEvent(escEvt, closeSuccessPopup);
  };

  // Закрыть popup по нажатию  на любую область документа
  var onDocumentClick = function () {
    closeSuccessPopup();
  };

  // Отправка данных на сервер без перезагрузки страницы
  noticeForm.addEventListener('submit', function (evt) {
    window.backend.saveData(new FormData(noticeForm), function () {
      openSuccessPopup();
    }, window.utils.onError);
    evt.preventDefault();
  });

  // Сброс страницы в исходное состояние.
  var setDefaultSetup = function () {
    disabledForm();
    setInputValueDefault();
    window.map.disabledMap();
  };

  reset.addEventListener('click', function () {
    setDefaultSetup();
  });
})();
