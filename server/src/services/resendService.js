const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LeadForge <onboarding@resend.dev>', // Use verified domain in production
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendEmail,
};
