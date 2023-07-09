function sendEmail(data) {
  fetch('https://studyinbarcelona.net/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      if (response.ok) {
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
}