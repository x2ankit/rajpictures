
## Contact form (EmailJS)

The public contact form in `src/components/Contact.tsx` can send emails using EmailJS.

Set these Vite environment variables (locally in a `.env.local`, and in Vercel project env vars):

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Email template variables used:

- `user_name`
- `user_phone`
- `user_email`
- `message`


