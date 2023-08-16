const url_to_strapi = {
  //current: 'http://localhost:1337',
  current: 'https://cms.studyinbarcelona.net',
}


// Event listener for the LanguageSelector
const languageSelector = document.getElementById('languageSelector');

languageSelector.addEventListener('change', async () => {
    const selectedLanguageId = languageSelector.value;
    
    // Set the language preference cookie
    setLanguagePreferenceCookie(selectedLanguageId);

    // Fetch data based on the selected language
    await fetchSiteMenu(selectedLanguageId);
    await fetchFooterData(selectedLanguageId);
    await fetchFormLabels(selectedLanguageId);
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
    
    fetchSiteMenu(userLanguagePreference);
    fetchFooterData(userLanguagePreference);
    fetchFormLabels(userLanguagePreference);
  } else {
    // If no language preference is found in cookies, set English as the default language
    const defaultLanguage = 'en';
    languageSelector.value = defaultLanguage;
    
    // Fetch & display the data for the default language (English)
    fetchSiteMenu(defaultLanguage);
    fetchFooterData(defaultLanguage);
    fetchFormLabels(defaultLanguage);
  }
});

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


// ============ labels ==============
// Function to update the labels and input placeholders with translations
function updateLabelsAndInputs(translations, selectedLanguage) {
  const langcode_translation = {
    "en":["Spanish", "Catalan", "English"], 
    "es":["Lengua castellana", "Lengua catalana", "Lengua inglesa"], 
    "ca-ES":["Castellà", "Català", "Anglès"]
  }

  // Helper function to update an individual element's content based on its ID
  function updateElementContent(elementId, translationKey) {
    const element = document.getElementById(elementId);
    if (translations[translationKey]) {
      element.textContent = translations[translationKey];
    }
  }

  // Helper function to update input labels based on their "for" attribute
  function updateInputLabel(inputId, translationKey) {
    const labelElement = document.querySelector(`label[for="${inputId}"]`);
    if (labelElement && translations[translationKey]) {
      labelElement.textContent = translations[translationKey];
    }
  }

  // ============= language =================
  // Helper function to update input labels based of language level in their "for" attribute
    function updateLangInputLabel(languageName, lang_Level, translationKey) {
      const inputId = `${languageName.toLowerCase()}_${lang_Level}`;
      const labelElement = document.querySelector(`label[for="${inputId}"]`);
      if (labelElement && translations[translationKey]) {
        labelElement.textContent = translations[translationKey];
      }
    }

  const languageOptions = langcode_translation[selectedLanguage];
  const languageContainerElement = document.getElementById('languageContainer');
  languageContainerElement.innerHTML = ''; // Clear previous content

  // Language knoledge levelslabels
  const langLevels = ['lang_level_1','lang_level_2','lang_level_4','lang_level_7',
    'lang_level_9', 'lang_level_3','lang_level_5','lang_level_6',
    'lang_level_8'];
  
  // Loop through languageOptions and create the blocks of HTML markup for each language
  languageOptions.forEach((languageName, index) => {
    const languageBlock = document.createElement('div');
    languageBlock.classList.add('pl-4');
    languageBlock.innerHTML = `
      <h3 id="section_subtitle_lang_${index + 1}" class="mt-4 mb-3">${languageName}</h3>
      <div id="lang_level_group_${index + 1}" class="form-row children"></div>`;
    languageContainerElement.appendChild(languageBlock);

    // Creating the check inputs with the labels of the levels of knowledge of the different languages
    langLevels.forEach((lang_Level) => {
      const inputList = document.createElement('div');
      inputList.classList.add('form-check', 'col-3', 'px-2');
      inputList.innerHTML = `
        <input id="${languageName.toLowerCase()}_${lang_Level}" type="checkbox" class="form-check-input">
        <label for="${languageName.toLowerCase()}_${lang_Level}" class="form-check-label"></label>`
      const lang_Level_group = document.getElementById(`lang_level_group_${index + 1}`);
      lang_Level_group.appendChild(inputList);

      // Call the updateInputLabel function to set the label text for each checkbox
      updateLangInputLabel(languageName, lang_Level, lang_Level);
    });
  });



  // ========== Educational sections & levels labels ==========
  const educationSectionSubtitle = ['finished', 'ongoing'];
  const educLevels = ['education_level_1','education_level_2','education_level_3','education_level_4','education_level_5','education_level_6'];

  // Helper function to update input labels based of eduaction level in their "for" attribute
  function updateEducInputLabel(sectionName, educ_Level, translationKey) {
    const inputId = `${sectionName}_${educ_Level}`;
    const labelElement = document.querySelector(`label[for="${inputId}"]`);
    if (labelElement && translations[translationKey]) {
      labelElement.textContent = translations[translationKey];
    }
  }

  const educationContainerElement = document.getElementById('educationContainer');
  educationContainerElement.innerHTML = ''; // Clear previous content
  
  // Creating the check inputs with the labels of the levels of education in the different languages
  educationSectionSubtitle.forEach((sectionSubtitle, index) => {
    const educationBlock = document.createElement('div');
    educationBlock.innerHTML = `
      <h3 id="section_subtitle_${sectionSubtitle}_education" class="mt-4 mb-3"></h3>
      <div id=educ_level_group_${index} class="form-row children"></div>`;
    educationContainerElement.appendChild(educationBlock);
    
    educLevels.forEach((educLevel) => {
      const inputList = document.createElement('div');
      inputList.classList.add('form-check', 'col-4', 'px-2');
      inputList.innerHTML = `
      <input id="${sectionSubtitle}_${educLevel}" type="checkbox" class="form-check-input">
      <label for="${sectionSubtitle}_${educLevel}" class="form-check-label"></label>`;
      const educ_level_group = document.getElementById(`educ_level_group_${index}`)
      educ_level_group.appendChild(inputList);
      updateEducInputLabel(sectionSubtitle, educLevel, educLevel);
    });
  });

  

  // Update general labels and placeholders
  updateElementContent('wellcome', 'wellcome');
  updateElementContent('wellcome_message', 'wellcome_message');
  updateElementContent('form_privacy_note', 'form_privacy_note');

  // Update contact data
  updateElementContent('section_title_personal_data', 'section_title_personal_data');
  updateInputLabel('name_field', 'name_field');
  updateInputLabel('email_field', 'email_field');
  updateInputLabel('phone_field', 'phone_field');

  // Update language section
  updateElementContent('section_title_language', 'section_title_languages');
  updateElementContent('section_subtitle_language_others', 'section_subtitle_language_others');

  // Update educational level section
  updateElementContent('section_title_educational_level', 'section_title_educational_level');
  updateElementContent('section_subtitle_finished_education', 'section_subtitle_finished_education');
  updateElementContent('section_subtitle_ongoing_education', 'section_subtitle_ongoing_education');

  // general interest option fields
  function updateInputLabel2(inputId, value) {
    const labelElement = document.querySelector(`label[for="${inputId}"]`);
    if (labelElement && value) {
      labelElement.textContent = value;
    }
  }
  updateInputLabel2('seekingSpanish', languageOptions[0])
  updateInputLabel2('seekingCatalan', languageOptions[1])
  updateInputLabel('education_level_1', 'education_level_1')
  updateInputLabel('education_level_2', 'education_level_2')
  updateInputLabel('education_level_3', 'education_level_3')
  updateInputLabel('education_level_5', 'education_level_5')
  updateInputLabel('education_level_6', 'education_level_6')

  // Update general education interest section
  updateElementContent('section_subtitle_general_education_interest', 'section_subtitle_general_education_interest');
  // Specific course section
  updateElementContent('section_subtitle_specific_course', 'section_subtitle_specific_course');
  // Teaching language section
  updateElementContent('section_title_teaching_language', 'section_title_teaching_language');
  // Teaching options
  updateInputLabel2('languageSpanish', languageOptions[0])
  updateInputLabel2('languageCatalan', languageOptions[1])
  updateInputLabel2('languageEnglish', languageOptions[2])
  
  // Update others section
  updateElementContent('section_title_others', 'section_title_others');
  updateElementContent('section_subtitle_others_1', 'section_subtitle_others_1');
  updateElementContent('section_subtitle_others_2', 'section_subtitle_others_2');
  updateInputLabel('others_2_field_1', 'others_2_field_1');
  updateInputLabel('others_2_field_2', 'others_2_field_2');
  updateInputLabel('others_1_field_1', 'others_1_field_1');
  updateInputLabel('others_1_field_2', 'others_1_field_2');
  updateInputLabel('others_1_field_3', 'others_1_field_3');

  // Update comments section title
  updateElementContent('section_title_comments', 'section_title_comments');

} // end of updateLabelAndInputs function
  




// Function to fetch form labels for a specific locale
async function fetchFormLabels(locale) {
  try {
    const response = await fetch(`${url_to_strapi.current}/api/feedback-form?locale=${locale}`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();

    if (data.data && data.data.attributes) {
      const translations = data.data.attributes;
      
      // Call the function to update the labels and input placeholders
      updateLabelsAndInputs(translations, locale);
    }
  } catch (error) {
    console.error(error);
  }
}
    
