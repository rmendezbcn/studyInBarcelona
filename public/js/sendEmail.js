function sendEmail(data) {
  return new Promise((resolve, reject) => {
    fetch('https://studyinbarcelona.net/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (response.ok) {
          resolve(); // Resolve the promise for success
        } else {
          reject(new Error('Error occurred while sending email.')); // Reject the promise for failure
        }
      })
      .catch(function (error) {
        reject(error); // Reject the promise for any other error
      });
  });
}
