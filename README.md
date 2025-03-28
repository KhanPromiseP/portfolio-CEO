# PortfolioPro - Professional Portfolio Template

![PortfolioPro Screenshot](assets/images/screenshot.jpg)

PortfolioPro is a premium, responsive portfolio template designed for creative professionals, developers, and designers. It features a modern design with light/dark theme support, smooth animations, and all the sections you need to showcase your work effectively.

## ✨ Key Features

- **One-Click Email System** - (No backend needed)
- **Branded Email Templates** - (Matches your portfolio)
- **Fully Responsive** - Works perfectly on all devices
- **Modern Design** - Clean, professional layout with animations
- **SEO Optimized** - Ready for search engines
- **Fast Loading** - Optimized for performance
- **Easy Customization** - Change colors, content, and more
- **Professional Contact Form** - (With validation) Ready to connect with your visitors
- **Portfolio Filtering** - Organize your work by category
- **Google Analytics** - Integrated for tracking
- **Animation** - professional animation-on-scroll

## Installation

## 📦 What's Included

portfolio-template/
├── LICENSE           # MIT License file
├── index.html        # Main portfolio page
├── thank-you.html    # Custom thank-you page
├── assets/           # All styles, scripts, and images
└── README.md         # This file

## 🧪Set Up & Test Your System
1. Download the template files
2. Upload to your web server
3. Customize the content in the HTML files (File each section with your real information, update logo, and other images)
4. Replace placeholder images with your own
5. Update the contact form handler if needed 

## Customization (🚀 Complete Setup Guide)

### Changing Colors

Edit the CSS variables in `assets/css/main.css` to match your brand colors:

:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --accent-color: #e74c3c;
    --light-color: #ecf0f1;
    --dark-color: #2c3e50;
}

###  Updating Content

Edit the HTML files in the sections folder to update your personal information, portfolio items, services, etc.

### Adding Google Analytics

Replace GA_MEASUREMENT_ID in index.html with your actual Google Analytics tracking ID.

## 📮 Email System Setup

**1. Configure FormSubmit (5 minutes)**
1-Go to FormSubmit.co

2-Sign up with the email you used in:
<!-- In index.html -->
<form action="https://formsubmit.co/your-email@example.com" ...>

3-Verify your email (Check inbox for confirmation link)

**2. Set Up Branded Emails**

**A. Default Template (Quick Start)**
In FormSubmit dashboard → Templates

Paste the code below (customize to your need):

<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', sans-serif; }
        .brand-header { 
            background: #3498db; /* Match your portfolio color */
            padding: 20px; 
            text-align: center; 
        }
    </style>
</head>
<body>
    <div class="brand-header">
        <img src="https://yourdomain.com/logo.png" width="150" alt="Your Logo">
        <h1 style="color: white;">New Portfolio Message</h1>
    </div>
    
    <p><strong>From:</strong> {{name}} ({{email}})</p>
    <p>{{message}}</p>
    
    <a href="mailto:{{email}}?subject=Re: {{subject}}" 
       style="background: #3498db; color: white; padding: 10px 20px; display: inline-block;">
       Reply to {{name}}
    </a>
    
    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #777;">
        <p>Sent via <a href="https://yourdomain.com">yourdomain.com</a></p>
    </div>
</body>
</html>


**B. Advanced SMTP (Optional)**
For emails from you@yourdomain.com:

1-FormSubmit → Settings → SMTP

2-Enter your domain's email credentials

3-Test with a form submission


## 🧪 Testing Your email System

**1. Local Test**
1-Open index.html in browser

2-Submit test form → Should redirect to thank-you.html

3-Check your email inbox

**2. Live Server Test**
1-Upload all files to your prefered hosting (Netlify/Vercel)

2-Submit form → Verify:

✔ Redirect works

✔ Email received with branding

✔ Reply button pre-fills recipient

## 💌 Professional Email Replies

**Email Signature Setup**
**1. Create a Custom Email Signature (Most Important)**
For Gmail/Outlook/Apple Mail:

**Use the code below and Add to your email client:**

- Gmail: Settings → See all settings → Signature → Paste HTML

- Outlook: File → Options → Mail → Signatures → New → Paste HTML

- Apple Mail: Mail → Preferences → Signatures → Paste HTML

<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.5;">
  <p style="margin: 0 0 8px 0;">
    <strong style="color: #3498db;">{{Your Name}}</strong><br>
    <small style="color: #666;">{{Your Title}} | Portfolio: <a href="https://yourdomain.com" style="color: #3498db; text-decoration: none;">yourdomain.com</a></small>
  </p>
  <div style="margin: 10px 0;">
    <a href="https://twitter.com/you" style="margin-right: 8px;"><img src="https://yourdomain.com/icons/twitter.png" width="20" alt="Twitter"></a>
    <a href="https://linkedin.com/in/you" style="margin-right: 8px;"><img src="https://yourdomain.com/icons/linkedin.png" width="20" alt="LinkedIn"></a>
    <a href="https://github.com/you"><img src="https://yourdomain.com/icons/github.png" width="20" alt="GitHub"></a>
  </div>
  <p style="font-size: 12px; color: #999; margin: 5px 0 0 0; border-top: 1px solid #eee; padding-top: 8px;">
    Sent from my professional portfolio system
  </p>
</div>

** 2. Configure FormSubmit for Branded Replies**
- When you click "Reply" from FormSubmit's email:

- Your signature will automatically attach

- The original message will show your branded template

**Pro Tip:** Upload (only those you what them to appear in your reply messages) your signature images to:
https://yourdomain.com/signature/

. twitter.png

. linkedin.png

. github.png


**Tip:** Ensure your icons are Hosted at:
https://yourdomain.com/icons/twitter.png

## 🚨 Troubleshooting
**Common Issue &	Solution**
Emails not received	--> Check FormSubmit spam folder
Thank-you page not loading	--> Verify _next URL in index.html
Broken logo in emails -->	Use absolute URL (https://...)

### Support

For any questions or issues, please contact  
#### khanpromise30@gmail.com


### 📜 License
**MIT License - Included in your download.**
File Location: /LICENSE (root folder)


MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted...
[Full license text will be auto-generated in the actual file]