import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  is_featured: boolean;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Hot Products</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-64 bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Hot Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our most popular custom pet rugs, loved by thousands of pet parents
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative overflow-hidden">
                <img
                  src={product.images[0] || "/api/placeholder/300/300"}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {product.sale_price && (
                  <Badge className="absolute top-3 left-3 bg-destructive">
                    Sale
                  </Badge>
                )}

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="transform translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Quick View
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                </div>

                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.short_description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {product.sale_price ? (
                      <>
                        <span className="font-bold text-lg text-primary">
                          {formatPrice(product.sale_price)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-lg">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/products')}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;