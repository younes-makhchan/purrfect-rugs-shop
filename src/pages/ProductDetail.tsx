import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Star, Truck, Shield, RefreshCw, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  stock_quantity: number;
  sku: string;
  categories: { name: string; slug: string };
}

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
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

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product?.name} added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    // TODO: Implement PayPal integration
    toast({
      title: "Redirecting to PayPal",
      description: "Please wait while we redirect you to PayPal...",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 w-20 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded"></div>
              <div className="h-6 bg-muted animate-pulse rounded w-3/4"></div>
              <div className="h-10 bg-muted animate-pulse rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = product.sale_price || product.price;
  const savings = product.sale_price ? product.price - product.sale_price : 0;
  const savingsPercent = product.sale_price ? Math.round((savings / product.price) * 100) : 0;

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <span className="text-muted-foreground">Home</span>
          <span className="mx-2">/</span>
          <span className="text-muted-foreground">Products</span>
          <span className="mx-2">/</span>
          <span className="text-muted-foreground">{product.categories.name}</span>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images[selectedImage] || "/api/placeholder/600/600"}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              {product.sale_price && (
                <Badge className="absolute top-4 left-4 bg-destructive">
                  -{savingsPercent}% OFF
                </Badge>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      selectedImage === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image || "/api/placeholder/80/80"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.short_description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-muted-foreground">(4.9) • 127 reviews</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(currentPrice)}
                </span>
                {product.sale_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-success font-medium">
                  You save {formatPrice(savings)} ({savingsPercent}%)
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-success' : 'bg-destructive'}`} />
              <span className={product.stock_quantity > 0 ? 'text-success' : 'text-destructive'}>
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
              >
                Buy Now with PayPal
              </Button>

              <Button variant="ghost" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share this product
              </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <Truck className="w-5 h-5 text-primary" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="w-5 h-5 text-primary" />
                <span>Quality Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <RefreshCw className="w-5 h-5 text-primary" />
                <span>Easy Returns</span>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span>{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{product.categories.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span>Premium Polyester</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Care:</span>
                    <span>Machine Washable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16">
          <Separator className="mb-8" />
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Description</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;