//import 'bootstrap/dist/css/bootstrap.min.css';

//import '../css/bootstrap.css';
const sendBtn = document.getElementById("sendBtn");
const form = document.getElementById('contact-form');


let mainInterest = ''
const interestInputs = $('input[id^="interest_"]')
interestInputs.on('change', function () {
  mainInterest = $(this).prop('value')
  console.log(mainInterest)
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

  fetch('http://178.128.197.175:3001/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  })
    .then(function (response) {
      if (response.ok) {
        //alert('Email sent successfully!');
        showConfirmationModal();
        form.reset(); // Clear the form
      } else {
        throw new Error('Error occurred while sending email.');
      }
    })
    .catch(function (error) {
      console.error(error);
      alert('An error occurred while sending the email.');
    });
    console.log('It went through');
});

function showConfirmationModal() {
  $('#confirmationModal').modal('show');
}

function showErrorModal() {
  $('#errorModal').modal('show');
}