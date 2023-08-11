const url_to_strapi = {
  current: 'http://localhost:1337',
  //current: 'https://cms.studyinbarcelona.net',
}

const sendBtn = document.getElementById("sendBtn");


let mainInterest = ''
const interestInputs = $('input[id^="type_"]')
interestInputs.on('change', function () {
  mainInterest = $(this).prop('value')
})

// Event listener for the LanguageSelector
const languageSelector = document.getElementById('languageSelector');
languageSelector.addEventListener('change', async () => {
    const selectedLanguageId = languageSelector.value;

    // Set the language preference cookie
    setLanguagePreferenceCookie(selectedLanguageId);
    
    // Fetch data based on the selected language
    await fetchData(selectedLanguageId);
    await fetchSiteMenu(selectedLanguageId);
    await fetchFooterData(selectedLanguageId);
    await fetchButtonText(selectedLanguageId);
});

// saves the user's language preference in the cooki
function setLanguagePreferenceCookie(langId) {
  document.cookie = `language=${langId}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/; SameSite=None; Secure`;
}


// read the language stored in the cookie to determine the user's language preference
function getLanguagePreference() {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'language') {
      return value;
    }
  }
  return null; // Return null if the language cookie is not found
}

// gets the language in the cookie on page load and sets English as default if it isn't
window.addEventListener('load', () => {
  const userLanguagePreference = getLanguagePreference();

  // Set the initial selected option of the LanguageSelector based on the user's language preference
  if (userLanguagePreference) {
    languageSelector.value = userLanguagePreference;
    
    fetchData(userLanguagePreference);
    fetchSiteMenu(userLanguagePreference);
    fetchFooterData(userLanguagePreference);
    fetchButtonText(userLanguagePreference);
  } else {
    // If no language preference is found in cookies, set English as the default language
    const defaultLanguage = 'en';
    languageSelector.value = defaultLanguage;
    
    // Fetch & display the data for the default language (English)
    fetchData(defaultLanguage);
    fetchSiteMenu(defaultLanguage);
    fetchFooterData(defaultLanguage);
    fetchButtonText(defaultLanguage);
  }
});



// Function to fetch data from the API based on the selected language
async function fetchData(languageId) {
    try {
        // Make a GET request to the API based on the selected language
        const response = await fetch(`${url_to_strapi.current}/api/partner?locale=${languageId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        
        // Pass the data object to the displayData function
        displayData(data, languageId);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display the data on the webpage for the selected language
function displayData(data) {
    // Get the attributes for the selected language
    const attributes = data.data.attributes;

    // Display the data for the selected language or the default language (English)
    const partnerTitleElement = document.getElementById('partnerTitle');
    const partnerBodyTextElement = document.getElementById('partnerBodyText');
    const formTitleElement = document.getElementById('formTitle');
    const formfieldNameElement = document.getElementById('formfieldName');
    const formFieldEmailElement = document.getElementById('formFieldEmail');
    const formFieldTypeContactElement = document.getElementById('formFieldTypeContact');
    const formFieldProposalElement = document.getElementById('formFieldProposal');
    const formFieldTypeStudentElement = document.getElementById('formFieldTypeStudent');
    const formFieldTypeProfessionalElement = document.getElementById('formFieldTypeProfessional');
    const sendBtnElement = document.getElementById('sendBtn')
    const cancelBtnElement = document.getElementById('cancelBtn')

    partnerTitleElement.textContent = attributes.partner_title;
    partnerBodyTextElement.textContent = attributes.partner_bodytext;
    formTitleElement.textContent = attributes.form_title;
    formfieldNameElement.textContent = attributes.formfield_name;
    formFieldEmailElement.textContent = attributes.formfield_email;
    formFieldTypeContactElement.textContent = attributes.formfield_type;
    formFieldProposalElement.textContent = attributes.formfield_proposal;
    formFieldTypeStudentElement.textContent = attributes.formfield_type_student;
    formFieldTypeProfessionalElement.textContent = attributes.formfield_type_professional;
    sendBtnElement.textContent = attributes.sendBtn;
    cancelBtnElement.textContent = attributes.cancelBtn;
}


// ============= button text =====================
// Function to fetch button text data from the API based on the selected language
async function fetchButtonText(languageId) {
  try {
    // Make a GET request to the API based on the selected language and include the 'contact_button' data
    const response = await fetch(`${url_to_strapi.current}/api/global-settings?locale=${languageId}&populate=contact_button`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    
    // Extract the button text data for the selected language
    const globalSettings = data.data[0].attributes;

    // Display the button texts with the fetched data
    displayButtonText(globalSettings, languageId);
  } catch (error) {
    console.error('Error fetching button text data:', error);
  }
}

// Function to update the button texts with the fetched data
function displayButtonText(globalSettings, languageId) {
  // Select all button elements with IDs starting with "contactButton"
  const buttonElements = document.querySelectorAll('a[id^="contactButton"]');

  // Update the content of buttons with the fetched data
  buttonElements.forEach((button, index) => {
    const buttonTextForLanguage = globalSettings.contact_button?.[0]?.buttonText;
    const defaultButtonText = globalSettings.contact_button.find((btn) => btn.locale === 'en')?.buttonText;

    button.innerHTML = `<i class="icon-user-edit"></i> ${buttonTextForLanguage || defaultButtonText || ''}`;
  });
}


// ============= Menu text =====================

async function fetchSiteMenu(languageId) {
  try {
    // Make a GET request to the API to fetch the site menu data based on the selected language
    const response = await fetch(`${url_to_strapi.current}/api/site-menus/1?populate=localizations`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();

    // Pass the site menu data to the displaySiteMenu function
    displaySiteMenu(data, languageId);
  } catch (error) {
    console.error('Error fetching site menu data:', error);
  }
}

function displaySiteMenu(menuData, languageId) {
  const primaryMenu = document.getElementById('primary-menu');

  // Get the localized menu data for the selected language
  const localizedMenuData = menuData.data.attributes.localizations.data.find(
    (loc) => loc.attributes.locale === languageId
  )?.attributes;

  // If the selected language is not available, fallback to the default language (English)
  const menuAttributes = localizedMenuData || menuData.data.attributes;

  // Get the menu items
  const homeMenuItem = primaryMenu.querySelector('#homeMenuItem a div');
  const servicesMenuItem = primaryMenu.querySelector('#serviceMenuItem a div');
  const partnersMenuItem = primaryMenu.querySelector('#partnerMenuItem a div');
  const aboutMenuItem = primaryMenu.querySelector('#aboutMenuItem a div');

  // Update the text content of menu items with the fetched data
  homeMenuItem.textContent = menuAttributes.home;
  servicesMenuItem.textContent = menuAttributes.services;
  partnersMenuItem.textContent = menuAttributes.partners;
  aboutMenuItem.textContent = menuAttributes.about;
}

// ============= page footer =====================
// Function to fetch footer data from the API based on the selected language
async function fetchFooterData(languageId) {
  try {
    // Make a GET request to the API based on the selected language
    const response = await fetch(`${url_to_strapi.current}/api/global-settings?locale=${languageId}&populate=footer`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    
    // Extract the footer data for the selected language
    const footerData = data.data[0].attributes.footer;

    // Display the footer content
    displayFooterContent(footerData);
  } catch (error) {
    console.error('Error fetching footer data:', error);
  }
}

function displayFooterContent(footerData) {
  const missionElement = document.getElementById('footerMission');
  const addressElement = document.getElementById('footerHeadquartersAddress');
  const contactName1Element = document.getElementById('contactName1');
  const contactNameValueElement = document.getElementById('contactValue1');
  const contactName2Element = document.getElementById('contactName2');
  const contactValue2Element = document.getElementById('contactValue2');

  // Update the content of HTML elements with the fetched data
  missionElement.textContent = footerData.mission;
  addressElement.innerHTML = footerData.headquarters_address;
  contactName1Element.textContent = footerData.contact_1_name;
  contactNameValueElement.textContent = footerData.contact_1_value;
  contactName2Element.textContent = footerData.contact_2_name;
  contactValue2Element.textContent = footerData.contact_2_value;
}

// ================ save data from the form to the API ==========

// Add event listener to the send button
document.getElementById('sendBtn').addEventListener('click', async () => {
  try {
    await sendFormDataToAPI();
    showConfirmationModal()
    // Optionally, you can reset the form after sending the data
    document.getElementById('contact-form').reset();
  } catch (error) {
    alert('Error sending form data. Please try again later.');
  }
});


// Collect data from the form and send it to the API
let form = document.getElementById('contact-form')

async function sendFormDataToAPI() {
  const formData = new FormData(form);
  
  const jsonData = {
    data: {
      "proposal": formData.get("contact-form-comments"),
      "email": formData.get("contact-form-email"),
      "name": formData.get("contact-form-name"),
      "type": document.querySelector('input[type="radio"][id^="type_"]:checked').value
    }
  };
  console.log(jsonData)

  // Make the POST request to the API endpoint and handle the response
  try {
    const response = await fetch(`${url_to_strapi.current}/api/potential-partners`, {
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
  }
}



function showConfirmationModal() {
  $('#confirmationModal').modal('show');
}

function showErrorModal() {
  $('#errorModal').modal('show');
}