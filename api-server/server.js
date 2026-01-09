import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow requests from Cloudflare Pages
const corsOptions = {
  origin: [
    'http://localhost:4321',
    'http://localhost:4322',
    'http://localhost:3000',
    'https://formalogix.com',
    'https://www.formalogix.com',
    'https://*.pages.dev', // Cloudflare Pages preview URLs
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  dest: '/tmp/uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG allowed'));
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Formalogix API Server is running' });
});

// Contact form endpoint
app.post('/api/contact', upload.single('file'), async (req, res) => {
  try {
    // Extract form data
    const {
      company,
      homepage,
      name,
      email,
      formCount,
      industry,
      timeline,
      currentSolution,
      message
    } = req.body;

    // Validate required fields
    if (!email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Email and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Handle file upload
    let attachment = null;
    if (req.file) {
      attachment = {
        filename: req.file.originalname,
        path: req.file.path
      };
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose email
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Company:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${company || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Homepage:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${homepage ? `<a href="${homepage}">${homepage}</a>` : 'Not provided'}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Name:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${name || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Email:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Monthly Forms:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${parseInt(formCount).toLocaleString('de-DE')}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Industry:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${industry || 'Not selected'}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Timeline:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${timeline || 'Not selected'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Current Solution:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${currentSolution || 'Not selected'}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6; vertical-align: top;">Message:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6; white-space: pre-wrap;">${message}</td>
        </tr>
        ${req.file ? `
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Attachment:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${req.file.originalname} (${(req.file.size / 1024).toFixed(2)} KB)</td>
        </tr>
        ` : ''}
      </table>
    `;

    const mailOptions = {
      from: `"Formalogix Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `New Contact: ${company || name || 'Unknown'}`,
      html: emailHtml,
      attachments: attachment ? [attachment] : []
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Cleanup temp file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });
    }

    // Send success response
    res.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email send error:', error);

    // Cleanup temp file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to send email'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum 10MB'
      });
    }
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Formalogix API Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Contact API: http://localhost:${PORT}/api/contact\n`);
});
