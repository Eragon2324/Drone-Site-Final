import { motion } from 'framer-motion';

interface UseCase {
  title: string;
  description: string;
}

interface UseCaseCardsProps {
  heading: string;
  subheading: string;
  cases: UseCase[];
}

export default function UseCaseCards({ heading, subheading, cases }: UseCaseCardsProps) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <h3 className="text-2xl md:text-3xl font-semibold text-[#d4a849] tracking-wide leading-tight drop-shadow-md">
          {heading}
        </h3>
        <p className="text-base md:text-lg text-white leading-relaxed tracking-wide">
          {subheading}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((useCase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(201,162,75,0.18)' }}
            className="p-6 rounded-xl border border-[rgba(201,162,75,0.15)] bg-[rgba(255,255,255,0.08)]
                     hover:border-[rgba(201,162,75,0.25)] transition-all duration-200"
          >
            <h4 className="text-lg md:text-xl font-semibold text-white mb-3 tracking-wide leading-tight">
              {useCase.title}
            </h4>
            <p className="text-base md:text-lg text-white leading-relaxed tracking-wide">
              {useCase.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
