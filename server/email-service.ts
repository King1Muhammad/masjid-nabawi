import nodemailer from 'nodemailer';
import { Enrollment } from '@shared/schema';

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
      <h2>New Enrollment Application</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <hr />
      <h3>Student Information:</h3>
      <p><strong>Course:</strong> ${enrollment.courseId}</p>
      <p><strong>Student Name:</strong> ${enrollment.studentName}</p>
      <p><strong>Guardian/Parent Name:</strong> ${enrollment.guardianName}</p>
      <p><strong>Age:</strong> ${enrollment.age}</p>
      <p><strong>Email:</strong> ${enrollment.email}</p>
      <p><strong>Phone:</strong> ${enrollment.phone}</p>
      <p><strong>Address:</strong> ${enrollment.address}</p>
      <hr />
      <p>Please login to the admin panel for more details and to approve or reject this application.</p>
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