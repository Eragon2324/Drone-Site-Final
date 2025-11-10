import Intro from './components/Intro';
import ServiceSlider from './components/ServiceSlider';
import Contact from './components/Contact';
import { useCardExpansion } from './hooks/useCardExpansion';

export default function App() {
  const { expandedId } = useCardExpansion();

  return (
    <main className="min-h-screen bg-brand-bg">
      <Intro />
      <ServiceSlider />
      {!expandedId && <Contact />}
    </main>
  );
}
