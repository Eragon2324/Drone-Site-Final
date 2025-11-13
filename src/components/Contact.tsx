import { motion } from 'framer-motion';
import { Mail, MessageCircle } from 'lucide-react';

export default function Contact() {
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
        <p className="text-sm sm:text-base text-brand-text/60 mb-12 tracking-wide">
          Reach out to discuss your next aerial project.
        </p>

        <div className="space-y-6">
          {/* Email */}
          <motion.a
            href="mailto:Thomas@4-webers.com"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(215, 183, 100, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-brand-gold/10 to-brand-gold/20 
                     border border-brand-gold/40 rounded-xl text-brand-text hover:border-brand-gold/60 
                     transition-all duration-300 group"
          >
            <Mail className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform duration-300" />
            <div className="text-left">
              <div className="text-xs text-brand-gold/60 uppercase tracking-wider">Email</div>
              <div className="text-base sm:text-lg font-medium tracking-wide">Thomas@4-webers.com</div>
            </div>
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/32471863514"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(215, 183, 100, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-brand-gold/10 to-brand-gold/20 
                     border border-brand-gold/40 rounded-xl text-brand-text hover:border-brand-gold/60 
                     transition-all duration-300 group"
          >
            <MessageCircle className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform duration-300" />
            <div className="text-left">
              <div className="text-xs text-brand-gold/60 uppercase tracking-wider">WhatsApp</div>
              <div className="text-base sm:text-lg font-medium tracking-wide">+32 471 86 35 14</div>
              <div className="text-xs text-brand-text/50 mt-1">Shoot me a text</div>
            </div>
          </motion.a>
        </div>

        <div className="mt-16 pt-8 border-t border-brand-gold/10">
          <p className="text-xs text-brand-text/40 tracking-wider">
            © 2025 Thomas Weber — Built with Bolt & Vite.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
