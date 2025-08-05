import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Heart, ShoppingCart, Star, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  categories: { name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ITEMS_PER_PAGE = 12;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const selectedCategory = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "name";

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, currentPage, searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `, { count: 'exact' })
        .eq('is_active', true);

      if (selectedCategory !== "all") {
        query = query.eq('categories.slug', selectedCategory);
      }

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      // Sorting
      switch (sortBy) {
        case "price_low":
          query = query.order('price', { ascending: true });
          break;
        case "price_high":
          query = query.order('price', { ascending: false });
          break;
        case "name":
          query = query.order('name', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;
      
      setProducts(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", category);
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", sort);
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Products</h1>
          <p className="text-muted-foreground">
            Discover our collection of custom pet rugs
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;