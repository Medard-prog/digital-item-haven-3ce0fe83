import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search, Loader2, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProductsManager = () => {
  const { dispatch } = useStore();
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [languageOptions, setLanguageOptions] = useState([
    { value: 'english', label: 'English', isActive: true },
    { value: 'spanish', label: 'Spanish', isActive: false },
    { value: 'french', label: 'French', isActive: false },
    { value: 'german', label: 'German', isActive: false },
    { value: 'japanese', label: 'Japanese', isActive: false },
    { value: 'chinese', label: 'Chinese', isActive: false }
  ]);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*, product_features(*)');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Products fetched:', data?.length || 0);
      
      const productsWithFeatures = (data || []).map(product => ({
        ...product,
        features: product.product_features?.map((f: any) => f.feature) || []
      }));
      
      setProducts(productsWithFeatures);
      
      productsWithFeatures.forEach(product => {
        dispatch({
          type: 'ADD_PRODUCT',
          payload: product
        });
      });
      
    } catch (error: any) {
      console.error('Error in fetchProducts:', error);
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredProducts = products.filter(product => 
    product.title?.toLowerCase().includes(search.toLowerCase()) ||
    product.description?.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleAddNewProduct = () => {
    setCurrentProduct({
      id: crypto.randomUUID(),
      title: '',
      description: '',
      price: 0,
      image_url: '',
      featured: false,
      features: []
    });
    setIsDialogOpen(true);
  };
  
  const handleEditProduct = (product: any) => {
    setCurrentProduct({
      ...product,
      features: product.features || []
    });
    setIsDialogOpen(true);
  };
  
  const handleManageLanguages = (product: any) => {
    setCurrentProduct(product);
    
    const fetchLanguageVariants = async () => {
      try {
        const { data, error } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', product.id);
        
        if (error) throw error;
        
        const resetOptions = languageOptions.map(option => ({
          ...option,
          isActive: false
        }));
        
        if (data && data.length > 0) {
          data.forEach((variant: any) => {
            const index = resetOptions.findIndex(opt => opt.value === variant.name);
            if (index !== -1) {
              resetOptions[index].isActive = true;
            }
          });
        }
        
        setLanguageOptions(resetOptions);
        setIsLanguageDialogOpen(true);
      } catch (error: any) {
        toast({
          title: "Error fetching language variants",
          description: error.message,
          variant: "destructive"
        });
      }
    };
    
    fetchLanguageVariants();
  };
  
  const handleDeleteProduct = (product: any) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const saveLanguageOptions = async () => {
    if (!currentProduct) return;
    
    try {
      await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', currentProduct.id);
      
      const selectedLanguages = languageOptions.filter(opt => opt.isActive);
      
      for (const lang of selectedLanguages) {
        await supabase
          .from('product_variants')
          .insert({
            product_id: currentProduct.id,
            name: lang.value,
            price: currentProduct.price
          });
      }
      
      toast({
        title: "Languages updated",
        description: `Language options for ${currentProduct.title} have been updated.`,
      });
      
      setIsLanguageDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error updating languages",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const confirmDelete = async () => {
    if (currentProduct) {
      setIsLoading(true);
      try {
        await supabase
          .from('product_features')
          .delete()
          .eq('product_id', currentProduct.id);
        
        await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', currentProduct.id);
        
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', currentProduct.id);
        
        if (error) throw error;
        
        setProducts(prevProducts => prevProducts.filter(p => p.id !== currentProduct.id));
        
        dispatch({
          type: 'DELETE_PRODUCT',
          payload: currentProduct.id
        });
        
        toast({
          title: "Product Deleted",
          description: `${currentProduct.title} has been deleted.`,
        });
        
      } catch (error: any) {
        toast({
          title: "Error deleting product",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
      }
    }
  };
  
  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentProduct) {
      setIsLoading(true);
      try {
        const isNewProduct = !products.find(p => p.id === currentProduct.id);
        
        let productId = currentProduct.id;
        
        if (isNewProduct) {
          const { data, error } = await supabase
            .from('products')
            .insert({
              title: currentProduct.title,
              description: currentProduct.description,
              price: currentProduct.price,
              image_url: currentProduct.image_url,
              featured: currentProduct.featured
            })
            .select()
            .single();
          
          if (error) throw error;
          productId = data.id;
          
          dispatch({
            type: 'ADD_PRODUCT',
            payload: {
              ...data,
              features: currentProduct.features
            }
          });
        } else {
          const { error } = await supabase
            .from('products')
            .update({
              title: currentProduct.title,
              description: currentProduct.description,
              price: currentProduct.price,
              image_url: currentProduct.image_url,
              featured: currentProduct.featured
            })
            .eq('id', currentProduct.id);
          
          if (error) throw error;
          
          dispatch({
            type: 'UPDATE_PRODUCT',
            payload: {
              ...currentProduct
            }
          });
          
          await supabase
            .from('product_features')
            .delete()
            .eq('product_id', productId);
        }
        
        if (currentProduct.features && currentProduct.features.length > 0) {
          for (let i = 0; i < currentProduct.features.length; i++) {
            const feature = currentProduct.features[i];
            if (feature && feature.trim() !== '') {
              await supabase
                .from('product_features')
                .insert({
                  product_id: productId,
                  feature: feature,
                  order_number: i
                });
            }
          }
        }
        
        await fetchProducts();
        
        toast({
          title: isNewProduct ? "Product Added" : "Product Updated",
          description: `${currentProduct.title} has been ${isNewProduct ? 'added' : 'updated'}.`,
        });
        
      } catch (error: any) {
        toast({
          title: "Error saving product",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setIsDialogOpen(false);
      }
    }
  };
  
  const handleInputChange = (field: string, value: any) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        [field]: value
      });
    }
  };
  
  const handleFeatureChange = (index: number, value: string) => {
    if (currentProduct) {
      const newFeatures = [...currentProduct.features];
      newFeatures[index] = value;
      setCurrentProduct({
        ...currentProduct,
        features: newFeatures
      });
    }
  };
  
  const addFeature = () => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        features: [...currentProduct.features, '']
      });
    }
  };
  
  const removeFeature = (index: number) => {
    if (currentProduct) {
      const newFeatures = [...currentProduct.features];
      newFeatures.splice(index, 1);
      setCurrentProduct({
        ...currentProduct,
        features: newFeatures
      });
    }
  };
  
  const toggleLanguageOption = (index: number) => {
    const newOptions = [...languageOptions];
    newOptions[index].isActive = !newOptions[index].isActive;
    setLanguageOptions(newOptions);
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-12 h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Loading Products</h2>
            <p className="text-muted-foreground">Please wait while we fetch the product data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Products Manager</h1>
            <p className="text-muted-foreground">Manage your digital trading resources</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={handleAddNewProduct} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add New Product
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      <p className="text-muted-foreground mt-2">Loading products...</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                        <TableCell>
                          {product.featured ? (
                            <Badge className="bg-primary hover:bg-primary/80">Featured</Badge>
                          ) : (
                            <Badge variant="outline">Standard</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleManageLanguages(product)}>
                              <Languages className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteProduct(product)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredProducts.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleDialogSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {currentProduct && products.find(p => p.id === currentProduct.id) 
                    ? 'Edit Product' 
                    : 'Add New Product'
                  }
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for your digital product
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input 
                    id="title" 
                    value={currentProduct?.title || ''} 
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea 
                    id="description" 
                    value={currentProduct?.description || ''} 
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                  <Input 
                    id="price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={currentProduct?.price || ''} 
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">Image URL</label>
                  <Input 
                    id="image" 
                    value={currentProduct?.image_url || ''} 
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={currentProduct?.featured || false} 
                    onCheckedChange={(checked) => handleInputChange('featured', !!checked)}
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured Product
                  </label>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Features</label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                      Add Feature
                    </Button>
                  </div>
                  
                  {currentProduct?.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input 
                        value={feature} 
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="text-destructive"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {(!currentProduct?.features || currentProduct.features.length === 0) && (
                  <p className="text-sm text-muted-foreground">No features added yet.</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Language Options</DialogTitle>
            <DialogDescription>
              Select available languages for {currentProduct?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              {languageOptions.map((option, index) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`lang-${option.value}`} 
                    checked={option.isActive}
                    onCheckedChange={() => toggleLanguageOption(index)}
                  />
                  <label htmlFor={`lang-${option.value}`} className="flex items-center gap-2 cursor-pointer">
                    <img 
                      src={`/flags/${option.value === 'english' ? 'gb' : option.value.substring(0, 2)}.svg`} 
                      alt={option.label} 
                      className="w-5 h-5"
                    />
                    <span>{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsLanguageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveLanguageOptions} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Languages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentProduct?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </AdminLayout>
  );
};

export default ProductsManager;
