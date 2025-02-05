import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: 'Booking Confirmation - TurfBook',
    html: `
      <h1>Booking Confirmed!</h1>
      <p>Your booking has been confirmed for:</p>
      <ul>
        <li>Turf: ${bookingDetails.turfName}</li>
        <li>Date: ${bookingDetails.date}</li>
        <li>Time: ${bookingDetails.timeSlot}</li>
        <li>Price: ₹${bookingDetails.price}</li>
      </ul>
      <p>Thank you for choosing TurfBook!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendBookingReminder = async (userEmail, bookingDetails) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: 'Upcoming Booking Reminder - TurfBook',
    html: `
      <h1>Booking Reminder</h1>
      <p>This is a reminder for your upcoming booking:</p>
      <ul>
        <li>Turf: ${bookingDetails.turfName}</li>
        <li>Date: ${bookingDetails.date}</li>
        <li>Time: ${bookingDetails.timeSlot}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending reminder:', error);
    throw error;
  }
};