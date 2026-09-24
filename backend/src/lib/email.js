import nodemailer from "nodemailer";
import { ENV } from "./env.js";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: { user: ENV.SMTP_USER, pass: ENV.SMTP_PASS },
  });

  return transporter;
}

// best-effort email sender; no-op (logged) when SMTP isn't configured
export async function sendEmail({ to, subject, html, text }) {
  try {
    const tx = getTransporter();
    if (!tx) {
      console.log(`[email skipped — SMTP not configured] to=${to} subject="${subject}"`);
      return false;
    }

    await tx.sendMail({
      from: ENV.EMAIL_FROM || ENV.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.log("Failed to send email:", error.message);
    return false;
  }
}

export const emailTemplates = {
  achievementUnlocked: (name, achievementName) => ({
    subject: `🏆 Achievement Unlocked: ${achievementName}`,
    html: `<p>Hi ${name},</p><p>You just unlocked the <strong>${achievementName}</strong> achievement on Talent IQ. Keep it up!</p>`,
    text: `Hi ${name}, you unlocked the ${achievementName} achievement on Talent IQ.`,
  }),
  interviewCreated: (name, problem) => ({
    subject: `Your interview session is ready`,
    html: `<p>Hi ${name},</p><p>Your interview session for <strong>${problem}</strong> has been created. Join when you're ready.</p>`,
    text: `Hi ${name}, your interview session for ${problem} has been created.`,
  }),
  interviewerRequestReceived: (name) => ({
    subject: `Interviewer access request received`,
    html: `<p>Hi ${name},</p><p>Thanks for requesting interviewer access on Talent IQ. An admin will review your request and approve you shortly. You can keep using Talent IQ as a student in the meantime.</p>`,
    text: `Hi ${name}, your interviewer access request was received. An admin will review and approve it shortly.`,
  }),
  interviewerApproved: (name) => ({
    subject: `You're approved as an Interviewer on Talent IQ`,
    html: `<p>Hi ${name},</p><p>Good news — an admin approved your request and you now have interviewer access on Talent IQ. You can host live sessions and evaluate candidates.</p>`,
    text: `Hi ${name}, an admin approved your interviewer access request. You can now host live sessions and evaluate candidates.`,
  }),
};
