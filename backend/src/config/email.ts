import nodemailer from 'nodemailer';
import { config } from './env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmail.user,
    pass: config.gmail.appPassword,
  },
});

export default transporter;
