const formSections = document.querySelectorAll('h2, h3');
const formInputs = document.querySelectorAll('input[type="checkbox"]:checked, textarea:not(:empty)');

function saveFormData() {
  const formData = {};

  formSections.forEach(section => {
    const sectionTitle = section.textContent.trim();
    const inputsInSection = Array.from(section.nextElementSibling.querySelectorAll('input[type="checkbox"]:checked, textarea:not(:empty)'));
    
    if (inputsInSection.length > 0) {
      formData[sectionTitle] = {};

      inputsInSection.forEach(input => {
        formData[sectionTitle][input.id] = input.value;
      });
    }
  });

  localStorage.setItem('formData', JSON.stringify(formData));
}

window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('formData');

  if (savedData) {
    const formData = JSON.parse(savedData);

    for (const sectionTitle in formData) {
      const section = Array.from(formSections).find(section => section.textContent.trim() === sectionTitle);

      if (section) {
        const inputsInSection = Array.from(section.nextElementSibling.querySelectorAll('input[type="checkbox"], textarea'));

        inputsInSection.forEach(input => {
          const inputId = input.id;
          const inputValue = formData[sectionTitle][inputId];

          if (typeof inputValue !== 'undefined') {
            input.value = inputValue;
          }
        });
      }
    }
  }
});

const formSaveBtn = document.getElementById('feedbackSaveBtn');
const formSendBtn = document.getElementById('feedbackSendBtn');

formSaveBtn.addEventListener('click', saveFormData);
//formSendBtn.addEventListener('click', sendData);

function saveFormData() {
  const formData = {};

  formSections.forEach(section => {
    const sectionTitle = section.textContent.trim();
    const inputsInSection = Array.from(section.nextElementSibling.querySelectorAll('input[type="checkbox"]:checked, textarea:not(:empty)'));

    if (inputsInSection.length > 0) {
      formData[sectionTitle] = {};

      inputsInSection.forEach(input => {
        formData[sectionTitle][input.id] = input.value;
      });
    }
  });

  localStorage.setItem('formData', JSON.stringify(formData));
}


formSendBtn.addEventListener('click', function () {
  const formData = JSON.parse(localStorage.getItem('formData'));
  
  // Perform data validation and send the data using the sendEmail function
  sendEmail(formData)
    .then(function () {
      showConfirmationModal();
      form.reset(); // Clear the form
    })
    .catch(function (error) {
      console.error(error);
      alert('An error occurred while sending the email.');
    });

  // Clear the form data from Local Storage after sending
  localStorage.removeItem('formData');
});

function showConfirmationModal() {
  $('#confirmationModal').modal('show');
}