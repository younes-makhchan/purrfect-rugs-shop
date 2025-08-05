import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default Index;
