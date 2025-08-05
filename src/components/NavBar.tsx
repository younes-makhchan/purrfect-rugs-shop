import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Menu, Heart } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NavBar = () => {
  const [cartCount] = useState(0);
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Custom Rugs", href: "/products?category=custom-pet-rugs" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PR</span>
          </div>
          <span className="font-bold text-xl">PetRugs</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Heart className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {cartCount}
              </Badge>
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={() => navigate('/auth')}>
            <User className="h-5 w-5" />
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;