import { motion } from 'framer-motion';

interface Deliverable {
  type: string;
  format: string;
  useCase: string;
}

interface DeliverablesTableProps {
  heading: string;
  subheading: string;
  outputs: Deliverable[];
}

export default function DeliverablesTable({ heading, subheading, outputs }: DeliverablesTableProps) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h3 className="text-2xl md:text-3xl font-semibold text-[#d4a849] tracking-wide leading-tight drop-shadow-md">
          {heading}
        </h3>
        <p className="text-base md:text-lg text-white leading-relaxed tracking-wide">
          {subheading}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="overflow-x-auto rounded-xl border border-[rgba(201,162,75,0.15)] shadow-lg"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(201,162,75,0.2)] bg-[rgba(201,162,75,0.12)]">
              <th className="px-6 py-4 text-left text-sm md:text-base font-semibold text-[#d4a849] tracking-wide drop-shadow-md">
                Output Type
              </th>
              <th className="px-6 py-4 text-left text-sm md:text-base font-semibold text-[#d4a849] tracking-wide drop-shadow-md">
                Format
              </th>
              <th className="px-6 py-4 text-left text-sm md:text-base font-semibold text-[#d4a849] tracking-wide drop-shadow-md">
                Use Case / Benefit
              </th>
            </tr>
          </thead>
          <tbody>
            {outputs.map((output, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03, ease: 'easeOut' }}
                className={`border-b border-[rgba(201,162,75,0.1)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.1)] ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                <td className="px-6 py-4 text-base text-[#d4a849] font-semibold tracking-wide">
                  {output.type}
                </td>
                <td className="px-6 py-4 text-base text-white/95 font-mono tracking-tight">
                  {output.format}
                </td>
                <td className="px-6 py-4 text-base md:text-lg text-white leading-relaxed tracking-wide">
                  {output.useCase}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
