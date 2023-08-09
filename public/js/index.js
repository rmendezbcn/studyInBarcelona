const url_to_strapi = {
  current: 'http://localhost:1337',
  //current: 'https://api.studyinbarcelona.net',
}

$(window).on('load', function() {
  $('#wellcomeModal').modal('show');
});
function closeWellcome() {
  $('#wellcomeModal').modal('hide')
}


// ========= controlling the content of the page ===========

// Event listener for the LanguageSelector
languageSelector.addEventListener('change', async () => {
  const selectedLanguageId = languageSelector.value;

  // Set the language preference cookie
  setLanguagePreferenceCookie(selectedLanguageId);

  // Fetch & displays the data based on the selected language
  await fetchData(selectedLanguageId);
  await fetchServicesData(selectedLanguageId)
  // Fetch the footer data based on the selected language
  await fetchFooterData(selectedLanguageId);
  await fetchButtonText(selectedLanguageId);
  await fetchSiteMenu(selectedLanguageId);
  
});

// saves the user's language preference in the cooki
function setLanguagePreferenceCookie(langId) {
  document.cookie = `language=${langId}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
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
    
    // Fetch & display the data based on the user's language preference
    fetchData(userLanguagePreference);
    fetchServicesData(userLanguagePreference);
    // Fetch the footer data based on the user's language preference
    fetchFooterData(userLanguagePreference);
    fetchButtonText(userLanguagePreference);
    fetchSiteMenu(userLanguagePreference);
  } else {
    // If no language preference is found in cookies, set English as the default language
    const defaultLanguage = 'en';
    languageSelector.value = defaultLanguage;
    
    // Fetch & display the data for the default language (English)
    fetchData(defaultLanguage);
    fetchServicesData(defaultLanguage);
    // Fetch the footer data for the default language (English)
    fetchFooterData(defaultLanguage);
    fetchButtonText(defaultLanguage);
    fetchSiteMenu(defaultLanguage);
  }
});




// ============= page content =====================
// Function to fetch data from the API based on the selected language
async function fetchData(languageId) {
  try {
    // Make a GET request to the API based on the selected language
    const response = await fetch(`${url_to_strapi.current}/api/index?locale=${languageId}&populate=*`);
    //const response = await fetch(url_to_strapi.current + '/api/index?populate=*');
    const data = await response.json();
    //console.log(data)
    
    displayData(data, languageId);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Display the data on the webpage for the selected language
function displayData(data, selectedLanguage) {
  // Define the HTML-element variables
  const sliderSection = document.getElementById('slider'); 
  const sloganElement = document.getElementById('slogan');
  const mainButtonElement = document.getElementById('mainButton');
  const titleValueProposal1Element = document.getElementById('titleValueProposal1');
  const bodyValueProposal1Element = document.getElementById('bodyValueProposal1');
  const titleValueProposal2Element = document.getElementById('titleValueProposal2');
  const bodyValueProposal2Element = document.getElementById('bodyValueProposal2');
  const imageValueProposal1Element = document.getElementById('imageValueProposal1');
  const imageValueProposal2Element = document.getElementById('imageValueProposal2');
  const servicesTitleElement = document.getElementById('servicesTitle');
  const servicesNoteElement = document.getElementById('servicesNotes');

  // Check if the data object is truthy (not null or undefined)
  if (data.data) {
    // Get the localized attributes for the selected language
    const localizedAttributes = data.data.attributes.localizations.data.find(
      (loc) => loc.attributes.locale === selectedLanguage
    )?.attributes;
    
    // If the selected language is not available, fallback to the default language (English)
    const attributes = data.data.attributes;

    // If the selected language is not available, fallback to the default language (English) attributes
    const selectedAttributes = localizedAttributes || attributes;
    
    sloganElement.textContent = selectedAttributes.slogan;
    mainButtonElement.textContent = selectedAttributes.main_button;
    titleValueProposal1Element.textContent = selectedAttributes.title_value_proposal_1;
    bodyValueProposal1Element.textContent = selectedAttributes.body_value_proposal_1;
    titleValueProposal2Element.textContent = selectedAttributes.title_value_proposal_2;
    bodyValueProposal2Element.textContent = selectedAttributes.body_value_proposal_2;
    servicesTitleElement.textContent = selectedAttributes.services_title;
    servicesNoteElement.textContent = selectedAttributes.service_note;

    // Concatenate the localhost in the image URLs
    const mainImageUrl = url_to_strapi.current + attributes.main_image.data.attributes.formats.large.url;
    const imageValueProposal1Url = url_to_strapi.current + attributes.image_value_proposal_1.data.attributes.formats.medium.url;
    const imageValueProposal2Url = url_to_strapi.current + attributes.image_value_proposal_2.data.attributes.formats.medium.url;

    imageValueProposal1Element.src = imageValueProposal1Url;
    imageValueProposal2Element.src = imageValueProposal2Url;

    // Update the background image of the slider section
    sliderSection.style.background = `url(${mainImageUrl}) center center no-repeat`;
    sliderSection.style.backgroundSize = 'cover';
  } else {
    // Handle the case when the data object is not available (selected language not found)
    // Fallback to the default language (English) data
    console.error('Data not available or not in the expected format');
    /*const attributes = data.data.attributes;

    sloganElement.textContent = attributes.slogan;
    mainButtonElement.textContent = attributes.main_button;
    titleValueProposal1Element.textContent = attributes.title_value_proposal_1;
    bodyValueProposal1Element.textContent = attributes.body_value_proposal_1;
    titleValueProposal2Element.textContent = attributes.title_value_proposal_2;
    bodyValueProposal2Element.textContent = attributes.body_value_proposal_2;
    servicesTitleElement.textContent = attributes.services_title;
    servicesNoteElement.textContent = attributes.service_note;

    // Concatenate the localhost in the image URLs
    const mainImageUrl = `http://localhost:1337${attributes.main_image.data.attributes.formats.large.url}`;
    const imageValueProposal1Url = `http://localhost:1337${attributes.image_value_proposal_1.data.attributes.formats.medium.url}`;
    const imageValueProposal2Url = `http://localhost:1337${attributes.image_value_proposal_2.data.attributes.formats.medium.url}`;

    imageValueProposal1Element.src = imageValueProposal1Url;
    imageValueProposal2Element.src = imageValueProposal2Url;

    // Update the background image of the slider section
    sliderSection.style.background = `url(${mainImageUrl}) center center no-repeat`;
    sliderSection.style.backgroundSize = 'cover';*/
  }
}


  
// ============= services =====================
// Function to fetch services data from the API based on the selected language
async function fetchServicesData(languageId) {
  try {
    // Fetch all services data
    const response = await fetch(`${url_to_strapi.current}/api/services`);
    const data = await response.json();

    // Fetch localizations for all services
    const localizationResponses = await Promise.all(
      data.data.map((service) => fetch(`${url_to_strapi.current}/api/services/${service.id}?populate=localizations`))
    );

    const localizedServicesData = await Promise.all(localizationResponses.map((res) => res.json()));

    // Combine the localized services data
    const combinedServicesData = localizedServicesData.map((localizedService) => {
      const localizedAttributes = localizedService.data.attributes.localizations.data.find(
        (loc) => loc.attributes.locale === languageId
      )?.attributes;

      // If the selected language is not available, fallback to the default language (English)
      const attributes = localizedAttributes || localizedService.data.attributes;

      return {
        id: localizedService.data.id,
        attributes: {
          name: attributes.name || localizedService.data.attributes.name,
          description: attributes.description || localizedService.data.attributes.description,
          icon: localizedService.data.attributes.icon,
        },
      };
    });
    
    // Pass the combined services data to the displayServices function
    displayServices(combinedServicesData);
  } catch (error) {
    console.error('Error fetching services data:', error);
  }
}


function displayServices(servicesData) {
  const servicesListElement = document.getElementById('servicesList');

  // Clear the existing content before populating with new data
  servicesListElement.innerHTML = '';

  // Loop through the services data and create list items to display them on the webpage
  servicesData.forEach((service) => {
    const li = document.createElement('li');
    li.classList.add('col-md-6', 'px-3', 'pb-3');

    // Populate the list item with service data
    li.innerHTML = `
      <i class="${service.attributes.icon} services-icon"></i>
      <strong class="fs-4">${service.attributes.name}</strong>
      <p class="fs-5 pb-4"><strong>${service.attributes.description}</strong></p>
    `;

    servicesListElement.appendChild(li);
  });
}


// ============= page footer =====================
// Function to fetch footer data from the API based on the selected language
async function fetchFooterData(languageId) {
  try {
    // Make a GET request to the API based on the selected language
    const response = await fetch(`${url_to_strapi.current}/api/global-settings?locale=${languageId}&populate=footer`);
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


// ============= button text =====================
// Function to fetch button text data from the API based on the selected language
async function fetchButtonText(languageId) {
  try {
    // Make a GET request to the API based on the selected language and include the 'contact_button' data
    const response = await fetch(`${url_to_strapi.current}/api/global-settings?locale=${languageId}&populate=contact_button`);
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
    const response = await fetch(`${url_to_strapi.current}/api/site-menus/1?populate=localizations`);
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

// =================== modal ====================
const languageButtons = document.querySelectorAll('.lang-tag');

// Event listener for language buttons
languageButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const selectedLanguage = button.id;

    if (selectedLanguage === 'english' && defaultModalContent !== null) {
      displayModalContent(defaultModalContent);
    } else {
      const response = await fetch(`${url_to_strapi.current}/api/modals?locale=${selectedLanguage}`);
      const data = await response.json();

      if (data.data) {
        const attributes = data.data[0].attributes;
        displayModalContent(attributes);
      }
    }
  });
});

// Function to update modal content
function displayModalContent(attributes) {
  const modalTitleElement = document.getElementById('modalTitle');
  const bodyPhrase1Element = document.getElementById('body_phrase_1');
  const bodyPhrase2Element = document.getElementById('body_phrase_2');
  const confirmationBtn = document.getElementById('modalConfirmationBtn');

  modalTitleElement.textContent = attributes.title;
  bodyPhrase1Element.innerHTML = `<strong>${attributes.body_phrase_1}</strong>`;
  bodyPhrase2Element.textContent = attributes.body_phrase_2;
  confirmationBtn.textContent = attributes.button_text;
}

// Fetch and store the default modal content in English when the window loads
let defaultModalContent = null;

window.addEventListener('load', async () => {
  const response = await fetch(`${url_to_strapi.current}/api/modals?locale=en`);
  const data = await response.json();

  if (data.data && data.data.length > 0) {
    defaultModalContent = data.data[0].attributes;
    displayModalContent(defaultModalContent);
  }
});

// Event listener for language buttons
languageButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const selectedLanguage = button.id;

    if (selectedLanguage === 'english' && defaultModalContent !== null) {
      displayModalContent(defaultModalContent);
    } else {
      const response = await fetch(`${url_to_strapi.current}/api/modals?locale=${selectedLanguage}`);
      const data = await response.json();

      if (data.data) {
        const attributes = data.data[0].attributes;
        displayModalContent(attributes);
      }
    }
  });
});



// Function to close the wellcome modal
function closeWellcome() {
  $('#wellcomeModal').modal('hide'); // Hide the modal using Bootstrap method
  $('body').removeClass('modal-open'); // Remove modal-open class from body
  $('.modal-backdrop').remove(); // Remove the modal backdrop
}

// Event listener for confirmation button
const confirmationBtn = document.getElementById('modalConfirmationBtn');
confirmationBtn.addEventListener('click', () => {
  closeWellcome();
});

