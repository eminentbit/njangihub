import { sender } from "./mailtrap.config.js";
import { transporter } from "./mailtrap.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  NJANGI_CREATION_NOTIFICATION_TEMPLATE,
  NJANGI_APPROVAL_TEMPLATE,
  WELCOME_TEMPLATE,
  INVITE_TEMPLATE,
  NJANGI_REJECTION_TEMPLATE,
  GROUP_MEMBER_ADDITION_TEMPLATE,
  PASSWORD_CHANGED_TEMPLATE,
  SIGNIN_ATTEMPT_TEMPLATE,
  ADMIN_PAYMENT_NOTIFICATION_TEMPLATE,
  NJANGI_PAYMENT_REMINDER_TEMPLATE,
  CONTACT_CONFIRMATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import NjangiGroup from "../models/njangi.group.model.js";
import User from "../models/user.model.js";
import NjangiNotification from "../models/notification.model.js";

const replacePlaceholders = (template, data) => {
  return Object.entries(data).reduce((html, [key, value]) => {
    return html.replaceAll(`{${key}}`, value);
  }, template);
};

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const recipient = [email];

    const response = transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: replacePlaceholders(VERIFICATION_EMAIL_TEMPLATE, {
        verificationCode: verificationToken,
      }),
      category: "Email Verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error("Error sending email");
  }
};

export const sendNjangiCreatedPendingEmail = async (
  email,
  userName,
  groupName,
  creationDate,
  memberCount,
  contributionAmount,
  viewURL
) => {
  const recipients = [email];

  try {
    const response = transporter.sendMail({
      from: sender,
      to: recipients,
      subject: "Njangi Creation Pending",
      html: replacePlaceholders(NJANGI_CREATION_NOTIFICATION_TEMPLATE, {
        userName,
        groupName,
        creationDate,
        memberCount,
        contributionAmount,
        viewURL,
      }),
      category: "Njangi Creation Pending Approval",
    });
    console.log("Njangi Pending Approval Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error("Error sending email");
  }
};

// export const sendInviteEmailBeforeNjangiCreation = async (
//   email,
//   senderName,
//   personalMessage,
//   groupName,
//   inviteURL
// ) => {
//   const recipient = [email];

//   try {
//     const response = transporter.sendMail({
//       from: sender,
//       to: recipient,
//       subject: `Join ${groupName} Njangi Group`,
//       html: replacePlaceholders(INVITE_TEMPLATE, {
//         senderName,
//         groupName,
//         personalMessage,
//         inviteURL,
//       }),
//       category: "Pre-Creation Njangi Invitation",
//     });
//     console.log(
//       "Pre-Creation Njangi Invitation Email sent successfully",
//       response
//     );
//   } catch (error) {
//     console.error(`Error sending email: ${error}`);
//     throw new Error("Error sending email");
//   }
// };

export const sendNjangiCreatedApprovalEmail = async (
  email,
  userName,
  groupName,
  creationDate,
  memberCount,
  contributionAmount,
  dashboardURL
) => {
  const recipient = [email];

  try {
    const response = transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Njangi Creation Approved",
      html: replacePlaceholders(NJANGI_APPROVAL_TEMPLATE, {
        userName,
        groupName,
        creationDate,
        memberCount,
        contributionAmount,
        dashboardURL,
      }),
      category: "Njangi Creation Notification",
    });
    console.log("Njangi Approval Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error("Error sending email");
  }
};

export const sendWelcomeEmail = async (email, username, dashboardURL) => {
  const recipient = [email];

  try {
    const response = transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Welcome to NjangiHub- NAAS(Njangi As A Service)",
      html: replacePlaceholders(WELCOME_TEMPLATE, {
        userName: username,
        dashboardURL,
      }),
    });
    console.log("Welcome Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email: ${error}`);
    throw new Error("Error sending email");
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const response = transporter.sendMail({
      from: sender,
      to: email,
      subject: "Reset your password",
      html: replacePlaceholders(PASSWORD_RESET_REQUEST_TEMPLATE, {
        resetURL: resetToken,
      }),
      category: "Password Reset",
    });
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset email: ${error}`);
    throw new Error("Error sending password reset email");
  }
};

export const sentResetSuccessEmail = async (email) => {
  const recipient = [email];

  try {
    const response = transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email: ${error}`);
    throw new Error("Error sending password reset success email");
  }
};

export const sendNjangiInvitationEmail = async (
  email,
  senderName,
  personalMessage,
  groupName,
  inviteURL
) => {
  const recipient = [email];

  try {
    const response = transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Njangi Creation Approved",
      html: replacePlaceholders(INVITE_TEMPLATE, {
        senderName,
        groupName,
        personalMessage,
        inviteURL,
      }),
      category: "Njangi Invitation",
    });
    console.log("Njangi Invitation Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error("Error sending email");
  }
};

export const sendNjangiAleadyAddMemberEmail = async (
  email,
  userName,
  creatorName,
  contributionAmount,
  paymentFrequency,
  groupName,
  registrationUrl
) => {
  const recipient = [email];

  try {
    const response = transporter.sendMail({
      from: sender,
      to: recipient,
      subject: `You have been added to ${groupName} on NjangiHub`,
      html: replacePlaceholders(GROUP_MEMBER_ADDITION_TEMPLATE, {
        creatorName,
        userName,
        contributionAmount,
        paymentFrequency,
        groupName,
        registrationUrl,
      }),
      category: "Njangi Group Member Invitation",
    });
    console.log("Njangi member invitation email sent successfully", response);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error("Error sending email");
  }
};

export const sendNjangiRejectionEmail = async (
  email,
  userName,
  rejectionReason,
  editURL,
  groupName
) => {
  const recipient = [email];

  try {
    const response = transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Njangi Creation Not Approved",
      html: replacePlaceholders(NJANGI_REJECTION_TEMPLATE, {
        userName,
        groupName,
        rejectionReason,
        editURL,
      }),
      category: "Njangi Invitation Not Approved",
    });
    console.log("Njangi Rejection Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error("Error sending email");
  }
};

export const sendPasswordChangedEmail = async (
  email,
  lastName,
  firstName,
  link
) => {
  const recipient = [email];

  try {
    const response = transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Password Changed Successfully",
      html: replacePlaceholders(PASSWORD_CHANGED_TEMPLATE, {
        lastName,
        firstName,
        resetPasswordLink: link,
      }),
      category: "Password Change Notification",
    });
    console.log("Password change notification sent successfully", response);
  } catch (error) {
    console.error(`Error sending password change notification: ${error}`);
    throw new Error("Error sending password change notification");
  }
};

export const sendSigninAttemptEmail = async (
  email,
  device,
  browser,
  lastName,
  firstName,
  city,
  region,
  country,
  ip
) => {
  const recipient = [email];

  console.log(ip);

  try {
    const response = transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "New Sign-in Detected",
      html: replacePlaceholders(SIGNIN_ATTEMPT_TEMPLATE, {
        userName: `${lastName} ${firstName}`,
        location: `City: ${city} Region: ${region} Country: ${country}`,
        dateTime: new Date().toLocaleDateString(),
        device,
        browser,
        ipAddress: ip,
      }),
      category: "Security Alert",
    });
    console.log("Sign-in attempt notification sent successfully", response);
  } catch (error) {
    console.error(`Error sending signin attempt notification: ${error}`);
    throw new Error("Error sending signin attempt notification");
  }
};

/**
 *
 * @param {string} email - The email of the recipient to receive the reminder
 * @param {number} amountDue - The amount of money the recipient is owing
 * @param {Date} dueDate - The due date for the payment
 * @param {string} groupName - The name of the group
 * @param {string} lastName - The last name of the recipient
 * @param {string} firstName - The first name of the recipient
 * @param {string} paymentLink - The link to facilitate the payment
 */

export const sendDueReminder = async (
  email,
  amountDue,
  dueDate,
  groupName,
  lastName,
  firstName,
  paymentLink
) => {
  const recipient = [email];

  try {
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Njangi Payment Reminder",
      html: replacePlaceholders(NJANGI_PAYMENT_REMINDER_TEMPLATE, {
        userName: `${lastName} ${firstName}`,
        amountDue,
        dueDate,
        groupName,
        paymentLink,
      }),
      category: "Njangi Reminder",
    });

    console.log("Njangi due reminder sent successfully", response);
  } catch (error) {
    console.error(`Error sending Njangi due reminder: ${error}`);
    throw new Error("Error sending Njangi due reminder");
  }
};

/**
 *
 * @param {string} memberId - Represents the ID of the member who made the payment
 * @param {number} amount - The amount the member made
 * @param {string} groupId - The group in which this payment was made
 */

export const notifyAdminOfPayment = async (memberId, amount, groupId) => {
  try {
    const member = await User.findById(memberId).select(
      "firstName lastName email"
    );
    const group = await NjangiGroup.findById(groupId);

    if (!member || !group) {
      throw new Error("Member or group not found");
    }

    const fullName = `${member.firstName} ${member.lastName}`;
    const amountPaid = `${amount} FCFA`;
    const groupName = group.name;

    const admin = await User.findById(group.adminId);
    const recipients = [admin.email];

    await NjangiNotification.create({
      sender: admin.id,
      content: `${member.lastName} ${member.firstName} made a payment of ${amount} FCFA`,
      type: "payment",
      recipients: group.groupMembers,
    });

    const emailContent = replacePlaceholders(
      ADMIN_PAYMENT_NOTIFICATION_TEMPLATE,
      {
        memberName: fullName,
        amountPaid,
        groupName,
      }
    );

    transporter.sendMail({
      from: sender,
      to: recipients,
      subject: `Payment Received - ${groupName}`,
      html: emailContent,
      category: "Njangi Admin Notification",
    });
  } catch (error) {
    console.error("Failed to notify admin of payment:", error);
    throw new Error("Admin notification failed");
  }
};

export const sendContact = async (fullName, message, email) => {
  const recipients = [email];

  const mailOptions = {
    from: sender,
    to: recipients,
    subject: "NAAS Contact Confirmation",
    html: CONTACT_CONFIRMATION_EMAIL_TEMPLATE({ fullName, message }),
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
