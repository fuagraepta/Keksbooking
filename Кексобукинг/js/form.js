'use strict';

(function () {
  // Заполнение и валидация формы отправки объяления
  var noticeForm = document.querySelector('.notice__form');
  var allNoticeFormFieldset = noticeForm.querySelectorAll('fieldset');
  var allNoticeFormInputs = noticeForm.querySelectorAll('input');
  var inputAddress = noticeForm.querySelector('#address');

  var form = {
    // Активация формы для подачи объявления
    'enabledForm': function () {
      noticeForm.classList.remove('notice__form--disabled');
      allNoticeFormFieldset.forEach(function (input) {
        input.disabled = false;
      });
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
    allNoticeFormInputs.forEach(function (input) {
      input.value = '';
      input.checked = false;
    });
  };

  // Деактивация формы для подачи объявления
  var disabledForm = function () {
    noticeForm.classList.add('notice__form--disabled');
    allNoticeFormFieldset.forEach(function (activeInput) {
      activeInput.disabled = true;
    });
  };

  disabledForm();

  //  Размещение делегирование на форму. При отправке подсвечивает не корректно заполненные поля.
  noticeForm.addEventListener('invalid', function (evt) {
    var target = evt.target;
    if (target.validity.valid === false) {
      target.classList.add('invalid');
    }
  }, true);

  // Добавление аватарки пользователя
  var avatarFileChooser = noticeForm.querySelector('.notice__photo input[type=file]');
  var avatarPreview = noticeForm.querySelectorAll('.notice__preview img');
  var dropZone = noticeForm.querySelectorAll('.drop-zone');
  var FILE_TYPES = ['png', 'jpg', 'jpeg', 'svg'];

  // Добавление аватарки пользователя через input file
  var addPicture = function (preview, picture) {
    var files = picture ? picture : avatarFileChooser.files;
    for (var i = 0; i < files.length; i++) {
      var fileName = files[i].name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          preview.forEach(function (img) {
            img.src = reader.result;
          });
        });
        reader.readAsDataURL(files[i]);
      }
    }
  };

  avatarFileChooser.addEventListener('change', function () {
    addPicture(avatarPreview);
  });

  var onDropZoneDragenter = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  // Добавление аватарки пользователя с помощью Drag and Drop
  var onDropZoneDragover = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var onDropZoneDrop = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var dt = evt.dataTransfer;
    var files = dt.files;
    addPicture(avatarPreview, files);
  };

  dropZone[0].addEventListener('dragenter', onDropZoneDragenter, false);
  dropZone[0].addEventListener('dragover', onDropZoneDragover, false);
  dropZone[0].addEventListener('drop', onDropZoneDrop, false);

  // Добавление фотографий жилья
  var photoFileChooser = noticeForm.querySelector('.form__photo-container input[type=file]');
  var housePreview = noticeForm.querySelectorAll('.form__photo-container img');

  photoFileChooser.addEventListener('change', function () {
    addPicture(housePreview);
  });


  // При выборе типа жилья меняется минимальная стоимость
  var selectType = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  var typeToMinPrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  selectType.addEventListener('input', function () {
    price.min = typeToMinPrice[selectType.value];
    price.placeholder = price.min;
  });

  // Функция синхронизации двух похожих(по длине) селектов
  var synchTime = function (selectOne, selectTwo) {
    selectOne.value = selectTwo.value;
  };

  // Время заезда синхронизируется со временем выезда
  var timein = noticeForm.querySelector('#timein');
  var timeout = noticeForm.querySelector('#timeout');

  timein.addEventListener('change', function () {
    synchTime(timeout, timein);
  });
  timeout.addEventListener('change', function () {
    synchTime(timein, timeout);
  });

  // Синхронизация комнат с количеством гостей
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');

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
  var reset = noticeForm.querySelector('.form__reset');

  var setDefaultSetup = function () {
    disabledForm();
    setInputValueDefault();
    window.map.disabledMap();
  };

  reset.addEventListener('click', function () {
    setDefaultSetup();
  });
  window.form = form;
})();
