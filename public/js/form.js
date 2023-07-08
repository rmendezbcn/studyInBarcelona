// save & finish later funcitonality
// collecting the data inserted by the user
const formInputs = document.querySelectorAll('input, textarea');

formInputs.forEach(input => { // adding a listener to every input DOM element
  input.addEventListener('change', saveFormData);
});


// function to write the data to the local storage of the client
function saveFormData() {
  const formData = {};

  formInputs.forEach(input => {
    formData[input.id] = input.value;
  });

  localStorage.setItem('formData', JSON.stringify(formData));
}

// function to recover the data in the local storage to populate the form
// with existing the data 
window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('formData');

  if (savedData) {
    const formData = JSON.parse(savedData);

    for (const inputId in formData) {
      const input = document.getElementById(inputId);

      if (input) {
        input.value = formData[inputId];
      }
    }
  }
});

const formSaveBtn = document.getElementById('feedbackSaveBtn');
const formSendBtn = document.getElementById('feedbackSendBtn');

formSaveBtn.addEventListener('click', saveFormData);
formSendBtn.addEventListener('click', sendData);

function saveFormData() {
  const formData = {};

  formInputs.forEach(input => {
    formData[input.id] = input.value;
  });

  localStorage.setItem('formData', JSON.stringify(formData));
}

function sendData() {
  const formData = JSON.parse(localStorage.getItem('formData'));

  // Perform data validation and send the data using the sendEmail function
  sendEmail(formData);

  // Clear the form data from Local Storage after sending
  localStorage.removeItem('formData');
}