
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductsManager = () => {
  const { state, dispatch } = useStore();
  const products = state.products;
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleAddNewProduct = () => {
    setCurrentProduct({
      id: crypto.randomUUID(),
      title: '',
      description: '',
      price: 0,
      image: '',
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
  
  const handleDeleteProduct = (product: any) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (currentProduct) {
      dispatch({
        type: 'DELETE_PRODUCT',
        payload: currentProduct.id
      });
      
      toast({
        title: "Product Deleted",
        description: `${currentProduct.title} has been deleted.`,
      });
      
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentProduct) {
      // If product already exists, update it, otherwise add new
      const existingProduct = products.find(p => p.id === currentProduct.id);
      
      if (existingProduct) {
        dispatch({
          type: 'UPDATE_PRODUCT',
          payload: currentProduct
        });
        
        toast({
          title: "Product Updated",
          description: `${currentProduct.title} has been updated.`,
        });
      } else {
        dispatch({
          type: 'ADD_PRODUCT',
          payload: currentProduct
        });
        
        toast({
          title: "Product Added",
          description: `${currentProduct.title} has been added.`,
        });
      }
      
      setIsDialogOpen(false);
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
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products Manager</h1>
          <p className="text-muted-foreground">Manage your digital trading resources</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={handleAddNewProduct}>
          <Plus className="mr-2 h-4 w-4" />
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
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
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
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteProduct(product)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Product Form Dialog */}
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
                  value={currentProduct?.image || ''} 
                  onChange={(e) => handleInputChange('image', e.target.value)}
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
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
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
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManager;
