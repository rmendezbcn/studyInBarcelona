const url_to_strapi = {
  current: 'http://localhost:1337',
  //current: 'https://cms.studyinbarcelona.net',
}


function saveFormData() {
  const formSections = document.getElementsByClassName('section-block');
  const formData = {};

  // Helper function to get the labels and values of inputs within a subsection
  function getInputsData(subsection) {
    const inputs = Array.from(subsection.querySelectorAll('input[type="checkbox"]:checked, input[type="text"], textarea:not(:empty)'));
    const inputInfo = inputs.map(input => {
      if (input.type === 'checkbox') {
        const label = subsection.querySelector(`label[for="${input.id}"]`);
        return { type: 'checkbox', label: label ? label.textContent.trim() : '', value: input.checked ? 'checked' : '' };
      } else if (input.tagName === 'TEXTAREA') {
        return { type: 'textarea', label: input.id, value: input.value };
      } else {
        return { type: 'text', label: input.id, value: input.value };
      }
    });
    return inputInfo;
  }

  for (const section of formSections) {
    const titleElement = section.querySelector('h2');
    if (!titleElement) continue; // Skip sections without h2 title
    const title = titleElement.textContent.trim();
    formData[title] = {};

    const subsections = Array.from(section.querySelectorAll('h3'));
    if (subsections.length === 0) {
      // No subsections, collect data directly from the section
      const inputsData = getInputsData(section);
      inputsData.forEach(inputData => {
        formData[title][inputData.label] = inputData.value;
      });
    } else {
      subsections.forEach(subsection => {
        const subsectionTitle = subsection.textContent.trim();
        formData[title][subsectionTitle] = {};

        // Traverse down to the children div and collect input labels and values
        const childrenDiv = subsection.nextElementSibling;
        if (childrenDiv && childrenDiv.classList.contains('children')) {
          const inputsData = getInputsData(childrenDiv);
          inputsData.forEach(inputData => {
            formData[title][subsectionTitle][inputData.label] = inputData.value;
          });
        }
      });
    }
  }

  // Collect data from textarea elements with specific ids
  const specificCourseTextarea = document.getElementById('specificCourse');
  if (specificCourseTextarea) {
    formData['Educational level']['Which course specifically do you want to take in Barcelona?'] = specificCourseTextarea.value;
  }

  const finalCommentsTextarea = document.getElementById('finalComments');
  if (finalCommentsTextarea) {
    formData['Comments'] = finalCommentsTextarea.value;
  }

  localStorage.setItem('formData', JSON.stringify(formData));
}








/*
window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('formData');

  if (savedData) {
    const formData = JSON.parse(savedData);

    for (const sectionTitle in formData) {
      const section = Array.from(formSections).find(section => section.textContent.trim() === sectionTitle);

      if (section) {
        const formRowDiv = section.nextElementSibling;

        if (formRowDiv && formRowDiv.classList.contains('children')) {
          const inputsInSection = Array.from(formRowDiv.querySelectorAll('input[type="checkbox"], textarea'));

          inputsInSection.forEach(input => {
            const label = formRowDiv.querySelector(`label[for="${input.id}"]`);
            const labelText = label ? label.textContent.trim() : '';
            const inputValue = formData[sectionTitle][labelText];

            if (typeof inputValue !== 'undefined') {
              input.checked = inputValue === 'checked';
            } else {
              input.checked = false;
            }
          });
        }
      }
    }
  }
});*/

const formSaveBtn = document.getElementById('feedbackSaveBtn'); // save the data to the local storage
const formSendBtn = document.getElementById('feedbackSendBtn'); // sends the data to the API

// ============== saves the data to the local storage ==============
formSaveBtn.addEventListener('click', saveFormData);

// ============== sending the data to the API ==============
formSendBtn.addEventListener('click', function () {
  saveFormData();
  const formData = JSON.parse(localStorage.getItem('formData'));

  // Perform data validation and send the data using the sendFormDataToAPI function
  sendFormDataToAPI(formData)
    .then(function () {
      showConfirmationModal();
    })
    .catch(function (error) {
      console.error(error);
      alert('An error occurred while saving the data.');
    });

  // Clear the form data from Local Storage after sending
  localStorage.removeItem('formData');
});



async function sendFormDataToAPI(formData) {
  // data on the different sections, except comments which can be extracted directly
  const contact_data = formData["Contact details"];
  const educ_data = formData["Educational level"];
  const lang_data = formData["Language knowledge"];
  const other_data = formData["Other aspects about studying in Barcelona"]
  
  const jsonData = {
    data: {
      "name": contact_data["name_field"],
      "email": contact_data["email_field"],
      "phone": contact_data["phone_field"],
      
      "educational_level_finished": getCheckedValues(educ_data, "Studies completed in your country"),
      "educational_level_ongoing": getCheckedValues(educ_data, "Ongoing or unfinished studies in your country"),
      "general_educational_interests": getCheckedValues(educ_data, "In general, what are you interested in studying in Barcelona?"),
      "especific_educational_interest": educ_data["Which course specifically do you want to take in Barcelona?"],
      "teaching_language_preference": getCheckedValues(educ_data, "In which language do you prefer your studies to be taught in Barcelona?"),
      
      "knowledge_Spanish_level": getCheckedValues(lang_data, "Spanish"),
      "knowledge_catalan_level": getCheckedValues(lang_data, "Catalan"),
      "knowledge_english_level": getCheckedValues(lang_data, "English"),
      "knowledge_other_languages": getCheckedValues(lang_data, "Other languages?"),
      
      "accommodation_preference": getCheckedValues(other_data, "Accommodation"),
      "type_educational_center": getCheckedValues(other_data, "Type of educational center"),
      
      "comments": formData["Comments"],
    }
  };

  console.log(jsonData)

  // Make the POST request to the API endpoint and handle the response
  try {
    const response = await fetch(`${url_to_strapi.current}/api/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'credentials': 'include'
      },
      body: JSON.stringify(jsonData)
    });

    if (!response.ok) {
      // Handle the error response here (e.g., show an error message)
      throw new Error('Error sending data to API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  };
}

const detectEducationSubobject = new RegExp("stud", "i");
const detectEducationShallow = new RegExp("cours");
const detectLanguageSubobject = new RegExp('Spanish|Catalan|English')
const detectLanguageShallow = new RegExp('langu')

function getCheckedValues(subsectionData, subsectionTitle = null) {
  if (subsectionData) {
    if (subsectionTitle === 'Other languages?') {
      return subsectionData[subsectionTitle]['otherLanguages'] || '';
    } else {
      // Check if the subsection data is from the education section
      if (detectEducationSubobject.test(subsectionTitle)) {
        let selectedLevel = [];

        if (detectEducationShallow.test(subsectionTitle)) {
          selectedLevel = Object.entries(subsectionData[subsectionTitle])
            .filter(([label, value]) => value === 'checked')
            .map(([label]) => label);

          return selectedLevel.join(', ');
        } else {
          const availableArrays = Object.entries(subsectionData[subsectionTitle]);
          selectedLevel = availableArrays
            .map(([label, value]) => value === 'checked' ? label : '')
            .filter(Boolean);

          return selectedLevel.join(', ');
        }
      }

      // Check if the subsection data is from the language section  
      if (detectLanguageSubobject.test(subsectionTitle)) {
        let selectedLevel = [];
        const availableData = subsectionData[subsectionTitle];

        if (detectLanguageShallow.test(subsectionTitle)) {
          selectedLevel = Object.values(availableData)
            .filter(value => value === 'checked');

          return selectedLevel.join(', ');
        } else {
          selectedLevel = Object.keys(availableData)
            .filter(key => availableData[key] === 'checked');

          return selectedLevel.join(', ');
        }
      }
    }
  }
  // For fields other than language or education sections, convert the object to an array and collect the keys.
  if (typeof subsectionData[subsectionTitle] === 'object') {
    const selectedLevel = Object.keys(subsectionData[subsectionTitle])
      .filter(key => subsectionData[subsectionTitle][key] === 'checked');

    return selectedLevel.join(', ');
  }

  return subsectionData[subsectionTitle] || '';
}








function showConfirmationModal() {
  $('#confirmationModal').modal('show');
}

//const savedData = localStorage.getItem('formData');
//const formData = JSON.parse(savedData);