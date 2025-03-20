const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_SENDER_USERNAME,
    pass: process.env.EMAIL_SENDER_PASSWORD
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SENDER_USERNAME,
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

const emailTemplates = {
  welcomeEmail: (firstName) => ({
    subject: 'Welcome to Farm Investment Platform',
    html: `
      <h1>Welcome ${firstName}!</h1>
      <p>Thank you for joining our platform. We're excited to have you on board.</p>
    `
  }),

  loanRequestNotification: (farmName, amount) => ({
    subject: 'New Loan Request',
    html: `
      <h1>New Loan Request</h1>
      <p>A new loan request has been created for ${farmName} with amount $${amount}.</p>
    `
  }),

  investmentConfirmation: (farmName, amount) => ({
    subject: 'Investment Confirmation',
    html: `
      <h1>Investment Confirmed</h1>
      <p>Your investment of $${amount} in ${farmName} has been confirmed.</p>
    `
  }),

  repaymentReminder: (amount, dueDate) => ({
    subject: 'Loan Repayment Reminder',
    html: `
      <h1>Repayment Reminder</h1>
      <p>Your loan payment of $${amount} is due on ${new Date(dueDate).toLocaleDateString()}.</p>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
}; 