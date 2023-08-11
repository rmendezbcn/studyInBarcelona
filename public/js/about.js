const url_to_strapi = {
  current: 'http://localhost:1337',
  //current: 'https://cms.studyinbarcelona.net',
}


// Event listener for the LanguageSelector
languageSelector.addEventListener('change', async () => {
  const selectedLanguageId = languageSelector.value;

  // Set the language preference cookie
  setLanguagePreferenceCookie(selectedLanguageId);

  // Fetch data based on the selected language
  await fetchData(selectedLanguageId);
  await fetchSiteMenu(selectedLanguageId)
  await fetchFooterData(selectedLanguageId)
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
    fetchSiteMenu(userLanguagePreference)
    fetchFooterData(userLanguagePreference)
    fetchButtonText(userLanguagePreference);

  } else {
    // If no language preference is found in cookies, set English as the default language
    const defaultLanguage = 'en';
    languageSelector.value = defaultLanguage;
    
    // Fetch & display the data for the default language (English)
    fetchData(defaultLanguage);
    fetchSiteMenu(defaultLanguage)
    fetchFooterData(defaultLanguage)
    fetchButtonText(defaultLanguage);
  }
});



// Function to fetch data from the API based on the selected language
async function fetchData(languageId) {
  try {
    // Make a GET request to the API based on the selected language
    const response = await fetch(`${url_to_strapi.current}/api/about?_locale=${languageId}&populate=*`, {
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
function displayData(data, selectedLanguage) {
  // Get the localized attributes for the selected language
  const localizedAttributes = data.data.attributes.localizations.data.find(
    (loc) => loc.attributes.locale === selectedLanguage
  )?.attributes;

  // If the selected language is not available, fallback to the default language (English)
  const attributes = localizedAttributes || data.data.attributes;

  // Display the data for the selected language or the default language (English)
  const titleElement = document.getElementById('aboutTitle');
  const dataElement = document.getElementById('aboutData');
  const descriptionElement = document.getElementById('aboutDescription');

  titleElement.textContent = attributes.about_title;
  dataElement.textContent = attributes.about_data;
  descriptionElement.textContent = attributes.about_description;

  // Use the URL of the small image (if available) for both images
  const imageUrl = attributes.about_image_1?.data?.formats?.small?.url;
  if (imageUrl) {
    imageElement1.src = imageUrl;
  }

  const imageUrl2 = attributes.about_image_2?.data?.formats?.small?.url;
  if (imageUrl2) {
    imageElement2.src = imageUrl2;
  }
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