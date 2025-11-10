import { FEATURE_FORMS } from '../config/flags';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  const validate = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all fields.');
      return false;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorMsg('');
    if (!FEATURE_FORMS) return;
    if (!validate()) return;
    if (honeypot.trim()) {
      // Silently succeed if bot
      setStatus('success');
      setName(''); setEmail(''); setMessage('');
      return;
    }
    const elapsedMs = Date.now() - startedAt;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          ts: Date.now(),
          elapsedMs
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to send. Please try again.');
      }
      setStatus('success');
      setName(''); setEmail(''); setMessage('');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-[50vh] bg-gradient-to-b from-transparent via-[rgba(14,14,14,0.8)] to-[rgba(215,183,100,0.08)]
                        flex flex-col items-center justify-center px-6 py-20 mt-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent">
        <motion.div
          className="h-full w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
          animate={{ opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(215,183,100,0.1),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[720px] text-center relative z-10"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text mb-3 tracking-tight">
          Let's <span className="text-brand-gold">collaborate</span>.
        </h2>
        <p className="text-sm sm:text-base text-brand-text/60 mb-10 tracking-wide">
          Reach out to discuss your next aerial project.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          {/* Honeypot */}
          <input
            type="text"
            name="company"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!FEATURE_FORMS || isSubmitting}
              className="w-full px-5 py-4 bg-transparent border border-brand-gold/20 rounded-xl
                       text-brand-text placeholder:text-brand-text/30 focus:outline-none
                       focus:border-brand-gold focus:shadow-glow transition-all duration-300
                       disabled:opacity-40 disabled:cursor-not-allowed"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!FEATURE_FORMS || isSubmitting}
              className="w-full px-5 py-4 bg-transparent border border-brand-gold/20 rounded-xl
                       text-brand-text placeholder:text-brand-text/30 focus:outline-none
                       focus:border-brand-gold focus:shadow-glow transition-all duration-300
                       disabled:opacity-40 disabled:cursor-not-allowed"
              required
            />
            <textarea
              placeholder="Message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!FEATURE_FORMS || isSubmitting}
              className="w-full px-5 py-4 bg-transparent border border-brand-gold/20 rounded-xl
                       text-brand-text placeholder:text-brand-text/30 focus:outline-none
                       focus:border-brand-gold focus:shadow-glow transition-all duration-300
                       disabled:opacity-40 disabled:cursor-not-allowed resize-none"
              required
            />
            <motion.button
              type="submit"
              disabled={!FEATURE_FORMS || isSubmitting}
              whileHover={FEATURE_FORMS && !isSubmitting ? { scale: 1.02, boxShadow: '0 0 30px rgba(215, 183, 100, 0.3)' } : {}}
              whileTap={FEATURE_FORMS && !isSubmitting ? { scale: 0.98 } : {}}
              className="w-full py-4 bg-gradient-to-r from-brand-gold/10 to-brand-gold/20 border border-brand-gold/40 rounded-xl
                       text-brand-gold font-semibold tracking-wide hover:border-brand-gold/60 transition-all duration-300
                       disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden group text-center"
            >
              <span className="relative z-10">{FEATURE_FORMS ? (isSubmitting ? 'Sending…' : 'Send Message') : 'Coming Soon'}</span>
              {FEATURE_FORMS && !isSubmitting && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
            </motion.button>
            {!FEATURE_FORMS && (
              <p className="text-xs text-brand-gold/50 mt-3 tracking-wide">
                Contact form will be available soon.
              </p>
            )}
            {status === 'success' && (
              <p className="text-sm text-green-400/90 tracking-wide">
                Thanks! Your message was sent.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400/90 tracking-wide">
                {errorMsg}
              </p>
            )}
          </div>
        </form>

        <div className="mt-16 pt-8 border-t border-brand-gold/10">
          <p className="text-xs text-brand-text/40 tracking-wider">
            © 2025 Thomas Weber — Built with Bolt & Vite.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
