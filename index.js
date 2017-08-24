myForm = {
  validate: function() {
    var inputs = document.getElementsByTagName('input'),
        fio = document.getElementById('fio'),
        email = document.getElementById('email'),
        phone = document.getElementById('phone');
        errorFields = [];

    // remove "error" class from inputs
    for (i = 0; i < inputs.length; ++i) {
      inputs[i].className = '';
    }

    // FIO check
    var fioPattern = /^[A-Za-zА-Яа-яЁё'-\s]+$/i;
    var fioCount = fio.value.trim().split(/\s+/).length;
    var fioWords = 3;

    if (!fioPattern.test(fio.value) || (fioCount != fioWords)) {
      fio.className = 'error';
      errorFields.push('fio');
    }

    // email check
    var emailPattern = /([A-Za-z0-9-.]+)@(ya.ru)|(yandex.(ru)|(ua)|(by)|(kz)|(com))/;
    if (!emailPattern.test(email.value)) {
      email.className = 'error';
      errorFields.push('email');
    }

    // phone check
    var phonePattern = /\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
    var phoneCalc = phone.value.replace(/\D+/g, '').split('');
    for (var i = 0; i < phoneCalc.length; i++) {
      phoneCalc[i] = +phoneCalc[i];
    }
    var phoneCalc = phoneCalc.reduce((a, b) => a + b, 0);
    var phoneMaxSum = 30;

    if (!phonePattern.test(phone.value) || !(phoneCalc <= phoneMaxSum)) {
      phone.className = 'error';
      errorFields.push('phone');
    }

    // if errorFields have any keys set isValid false
    if (errorFields.length) isValid = false; else isValid = true;
    return [isValid, errorFields];
  },
  getData: function() {
    // get all input values to array
    var myFormData = {
        fio: fio.value,
        email: email.value,
        phone: phone.value
    }
    return myFormData;
  },
  setData: function(myFormSet) {
    // check array and set values
    if (myFormSet['fio']) fio.value = myFormSet['fio'];
    if (myFormSet['email']) email.value = myFormSet['email'];
    if (myFormSet['phone']) phone.value = myFormSet['phone'];
  },
  submit: function() {
    var submit = document.getElementById('submitButton'),
    result = document.getElementById('resultContainer'),
    action = document.getElementById('myForm').action;

    // send AJAX request function
    sendRequest = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', action, true);
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        var serverResonse = JSON.parse(xhr.responseText);

        switch (serverResonse.status) {
          case "success":
            result.className = 'success';
            result.innerHTML = 'Success';
            submit.disabled = false;
            break;
          case "error":
            result.className = 'error';
            result.innerHTML = serverResonse.reason;
            submit.disabled = false;
            break;
          case "progress":
            result.className = 'progress';
            result.innerHTML = 'Progress';
            setTimeout(sendRequest, serverResonse.timeout);
        }
      }
      var jsonData = JSON.stringify(myForm.getData());
      xhr.send(jsonData);
    }

    // validate, if valid disable button and send AJAX request
    myForm.validate();
    if (isValid) {
      submit.disabled = true;
      sendRequest();
    }
  }
}

var preset = {fio:'Иванов Иван Иванович',email:'ivan@ya.ru',phone:'+7(111)111-11-11'}

window.onload = function() {
  document.getElementById('submitButton').addEventListener("click", function () {
    myForm.submit();
    event.preventDefault();
  });

  // auto setData - valid values to form
  //myForm.setData(preset);
}
