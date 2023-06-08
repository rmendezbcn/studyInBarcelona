import nodemailer from 'nodemailer';


// Create a transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '83ef828ec590bf',
    pass: '6cf5282fe50907',
  },
});

// Define the email sending function
export async function sendEmail(data) {
  try {
    // Construct the email message
    const message = {
      from: 'sender@example.com',
      to: 'travelwithmarc@gmail.com',
      subject: 'New Message from the landing page',
      text: `
        Hola Marc,
        Mi nombre es Name: ${data.name}, tengo ${data.age} años y mi nacionalidad es ${data.citizenship}. 
        Estoy interesad@ en venir a Barcelona a estudiar.
        
        Mi email es ${data.email} y necesito tus servicios!
        Comentarios ${data.comments}.

        Gracias de antemano por la atención,
        ${data.name}
      `,
    };

    // Send the email
    const info = await transporter.sendMail(message);

    console.log('Email sent:', info.messageId);
    return info.messageId;
  } catch (error) {
    console.error('Error occurred while sending email:', error);
    throw error;
  }
}