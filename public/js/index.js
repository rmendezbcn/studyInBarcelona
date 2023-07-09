const sendBtn = document.getElementById("sendBtn");
const form = document.getElementById('contact-form');


let mainInterest = ''
const interestInputs = $('input[id^="interest_"]')
interestInputs.on('change', function () {
  mainInterest = $(this).prop('value')
  //console.log(mainInterest)
})

sendBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission
  const name = document.getElementById('contact-form-name').value;
  const email = document.getElementById('contact-form-email').value;
  const age = document.getElementById('contact-form-age').value;
  const citizenship = document.getElementById('contact-form-citizenship').value;
  const comments = document.getElementById('contact-form-comments').value;
  
  // Perform form validation
  if (name.trim() === '' || email.trim() === '' || age.trim() === '' || citizenship.trim() === '' || mainInterest.trim() === '') {
    //alert('Please fill in all required fields.'); // Display an error message
    showErrorModal()
    return; // Exit the function if any required field is empty
  }

  let studentData = {
    name,
    email,
    citizenship,
    age,
    mainInterest,
    comments
  }
  console.log("this is the index.js ", studentData)
  
  sendEmail(studentData);
});


function showConfirmationModal() {
  $('#confirmationModal').modal('show');
}

function showErrorModal() {
  $('#errorModal').modal('show');
}

$(window).on('load', function() {
  $('#wellcomeModal').modal('show');
});
function closeWellcome() {
  $('#wellcomeModal').modal('hide')
}

