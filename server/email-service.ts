import nodemailer from 'nodemailer';
import { Enrollment, Message } from '@shared/schema';

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jamiamasjidnabviqureshihashmi@gmail.com',
    pass: process.env.EMAIL_PASSWORD // We will need to ask for this password securely
  }
});

export const sendEnrollmentNotification = async (enrollment: Enrollment): Promise<boolean> => {
  try {
    // Format the enrollment data for email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0C6E4E; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0C6E4E; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Enrollment Application</h1>
          <h2 style="margin: 5px 0 0 0;">Jamia Masjid Nabvi Qureshi Hashmi</h2>
        </div>
        
        <div style="padding: 20px;">
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <h3>Student Information:</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Course:</td>
              <td>${enrollment.courseId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Student Name:</td>
              <td>${enrollment.studentName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Guardian/Parent Name:</td>
              <td>${enrollment.guardianName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Age:</td>
              <td>${enrollment.age}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td>${enrollment.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td>${enrollment.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Address:</td>
              <td>${enrollment.address}</td>
            </tr>
          </table>
          <hr />
          <p>Please login to the admin panel for more details and to approve or reject this application.</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
            <p>Jamia Masjid Nabvi Qureshi Hashmi<br>
            Opposite D-13 Block, FGEHF G-11/4, Islamabad, Pakistan</p>
          </div>
        </div>
      </div>
    `;

    // Define email options
    const mailOptions = {
      from: 'jamiamasjidnabviqureshihashmi@gmail.com',
      to: 'jamiamasjidnabviqureshihashmi@gmail.com', // Send to masjid email
      subject: `New Student Enrollment: ${enrollment.studentName}`,
      html: emailContent
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Enrollment notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending enrollment notification email:', error);
    return false;
  }
};

export const sendContactMessageNotification = async (message: Message): Promise<boolean> => {
  try {
    // Format the message data for email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0C6E4E; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0C6E4E; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Contact Message</h1>
          <h2 style="margin: 5px 0 0 0;">Jamia Masjid Nabvi Qureshi Hashmi</h2>
        </div>
        
        <div style="padding: 20px;">
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <h3>Sender Information:</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Name:</td>
              <td>${message.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td>${message.email}</td>
            </tr>
            ${message.phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td>${message.phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
              <td>${message.subject}</td>
            </tr>
          </table>
          
          <div style="background-color: #f5f5f5; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #0C6E4E; margin-top: 0;">Message:</h4>
            <p style="white-space: pre-line;">${message.message}</p>
          </div>
          
          <p>Please respond to this message at your earliest convenience.</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
            <p>Jamia Masjid Nabvi Qureshi Hashmi<br>
            Opposite D-13 Block, FGEHF G-11/4, Islamabad, Pakistan</p>
          </div>
        </div>
      </div>
    `;

    // Define email options
    const mailOptions = {
      from: 'jamiamasjidnabviqureshihashmi@gmail.com',
      to: 'jamiamasjidnabviqureshihashmi@gmail.com', // Send to masjid email
      subject: `New Contact Message: ${message.subject}`,
      html: emailContent
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Contact message notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending contact message notification email:', error);
    return false;
  }
};