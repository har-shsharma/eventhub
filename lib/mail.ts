import nodemailer from 'nodemailer';

export const sendApprovalEmail = async (to: string, eventTitle: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'EventHub: Your Event Has Been Approved 🎉',
        text: `Good news! Your event "${eventTitle}" has been approved and is now live.`,
    };

    await transporter.sendMail(mailOptions);
};

export const sendRejectionEmail = async (to: string, eventTitle: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'EventHub: Your Event Was Rejected',
        text: `We're sorry to inform you that your event "${eventTitle}" has been rejected. Please review our event guidelines and consider making changes for re-submission.`,
    };

    await transporter.sendMail(mailOptions);
};

