import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const features = [
    "Top Quality Materials",
    "Professionally Printed",
    "Fully Customizable",
    "Fast Shipping",
    "Machine Washable"
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Heart className="w-4 h-4 mr-2 text-primary" />
                Perfect Gifts for Pet Lovers
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Custom Pet Rugs
                <span className="block text-primary">Made with Love</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Transform your favorite pet photos into beautiful, high-quality rugs. 
                Perfect for any room and an amazing gift that celebrates your furry family members.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/products')}
                className="text-lg px-8"
              >
                Shop Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/products?category=custom-pet-rugs')}
                className="text-lg px-8"
              >
                Create Custom Rug
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground"> from 2,500+ happy customers</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/api/placeholder/600/600"
                alt="Custom pet rug example"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-lg border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$69.99</div>
                <div className="text-sm text-muted-foreground">Starting at</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;