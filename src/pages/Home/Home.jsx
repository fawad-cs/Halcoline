import PageShell from '../../components/layout/PageShell';
import Footer from '../../components/layout/Footer';
import Hero from '../../sections/Home/Hero';
import DescentStory from '../../sections/Home/DescentStory';
import FeaturedDives from '../../sections/Home/FeaturedDives';
import SpecimenShowcase from '../../sections/Home/SpecimenShowcase';
import FinalCTA from '../../sections/Home/FinalCTA';

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <DescentStory />
      <FeaturedDives />
      <SpecimenShowcase />
      <FinalCTA />
      <Footer />
    </PageShell>
  );
}