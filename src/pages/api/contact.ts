import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import fs from 'fs';

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Parse form data
    const formData = await request.formData();

    // 2. Extract all fields
    const data = {
      company: formData.get('company') as string,
      homepage: formData.get('homepage') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      formCount: formData.get('formCount') as string,
      industry: formData.get('industry') as string,
      timeline: formData.get('timeline') as string,
      currentSolution: formData.get('currentSolution') as string,
      message: formData.get('message') as string,
    };

    // 3. Validate required fields
    if (!data.email || !data.message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email and message are required'
      }), { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), { status: 400 });
    }

    // 4. Handle file upload (if present)
    const file = formData.get('file') as File | null;
    let filePath: string | null = null;
    let attachment: any = null;

    if (file && file.size > 0) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid file type. Only PDF, JPG, PNG allowed'
        }), { status: 400 });
      }

      if (file.size > maxSize) {
        return new Response(JSON.stringify({
          success: false,
          error: 'File too large. Maximum 10MB'
        }), { status: 400 });
      }

      // Save temporarily
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileExt = file.name.split('.').pop();
      filePath = `/tmp/uploads/contact-${timestamp}-${randomStr}.${fileExt}`;

      await fs.promises.mkdir('/tmp/uploads', { recursive: true });
      const buffer = await file.arrayBuffer();
      await fs.promises.writeFile(filePath, Buffer.from(buffer));

      attachment = {
        filename: file.name,
        path: filePath
      };
    }

    // 5. Configure email transporter
    const transporter = nodemailer.createTransport({
      host: import.meta.env.EMAIL_HOST,
      port: parseInt(import.meta.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: import.meta.env.EMAIL_USER,
        pass: import.meta.env.EMAIL_PASS,
      },
    });

    // 6. Compose email
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Company:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.company || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Homepage:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.homepage ? `<a href="${data.homepage}">${data.homepage}</a>` : 'Not provided'}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Name:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.name || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Email:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;"><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Monthly Forms:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${parseInt(data.formCount).toLocaleString('de-DE')}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Industry:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.industry || 'Not selected'}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Timeline:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.timeline || 'Not selected'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Current Solution:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.currentSolution || 'Not selected'}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6; vertical-align: top;">Message:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6; white-space: pre-wrap;">${data.message}</td>
        </tr>
        ${file ? `
        <tr>
          <td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Attachment:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${file.name} (${(file.size / 1024).toFixed(2)} KB)</td>
        </tr>
        ` : ''}
      </table>
    `;

    const mailOptions = {
      from: `"Formalogix Contact Form" <${import.meta.env.EMAIL_USER}>`,
      to: import.meta.env.EMAIL_TO,
      replyTo: data.email,
      subject: `New Contact: ${data.company || data.name || 'Unknown'}`,
      html: emailHtml,
      attachments: attachment ? [attachment] : []
    };

    // 7. Send email
    await transporter.sendMail(mailOptions);

    // 8. Cleanup temp file
    if (filePath) {
      await fs.promises.unlink(filePath).catch(console.error);
    }

    // 9. Return success
    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Email send error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to send email'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
