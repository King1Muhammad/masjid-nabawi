import nodemailer from 'nodemailer';
import { Donation, Enrollment, Message } from '@shared/schema';

// Configure email transport
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Email configuration is missing. Please check your .env file.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Function to send form submission notifications
export const sendFormNotification = async (formType: string, data: any) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error('Email transporter not configured');
    }

    console.log(`Attempting to send ${formType} notification...`);
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0C6E4E; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0C6E4E; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New ${formType} Submission</h1>
          <h2 style="margin: 5px 0 0 0;">Jamia Masjid Nabvi Qureshi Hashmi</h2>
        </div>
        
        <div style="padding: 20px;">
          <h3 style="color: #0C6E4E;">Submission Details:</h3>
          <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto;">
${JSON.stringify(data, null, 2)}
          </pre>
          
          <p style="margin-top: 30px;">This is an automated notification for a new ${formType} submission.</p>
        </div>
      </div>
    `;
    
    const mailOptions = {
      from: `"Masjid-e-Nabawi Islamabad" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New ${formType} Submission Received`,
      html: htmlContent,
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error(`Failed to send ${formType} notification:`, error);
    throw error; // Re-throw the error to be handled by the route handler
  }
};

// Specific form notification functions
export const sendEnrollmentNotification = async (enrollment: Enrollment) => {
  try {
    return await sendFormNotification('Madrasa Enrollment', enrollment);
  } catch (error) {
    console.error('Enrollment notification failed:', error);
    throw error;
  }
};

export const sendContactMessageNotification = async (message: Message) => {
  try {
    return await sendFormNotification('Contact Form', message);
  } catch (error) {
    console.error('Contact message notification failed:', error);
    throw error;
  }
};

export const sendDonationNotification = async (donation: Donation) => {
  try {
    return await sendFormNotification('Donation', donation);
  } catch (error) {
    console.error('Donation notification failed:', error);
    throw error;
  }
};