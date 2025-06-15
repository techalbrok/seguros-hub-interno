
import { useProductQueries } from './products/useProductQueries';
import { useProductSubscriptions } from './products/useProductSubscriptions';
import { useProductMutations } from './products/useProductMutations';
import { useDemoMode } from './useDemoMode';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/types';

export const useProducts = () => {
  const { isDemo, demoData, setDemoData } = useDemoMode();
  const { toast } = useToast();

  const { products, isLoading, error } = useProductQueries();
  useProductSubscriptions();

  const {
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProductMutations();
  
  if (isDemo) {
    const createProduct = (data: any) => {
       const newProduct: Product = {
        ...data,
        id: `demo-product-${uuidv4()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        documents: [],
      };
      setDemoData({ ...demoData, products: [...demoData.products, newProduct] });
    };

    const updateProduct = (data: any) => {
       setDemoData({
        ...demoData,
        products: demoData.products.map(p =>
          p.id === data.id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
        ),
      });
    };
    
    const deleteProduct = (id: string) => {
      setDemoData({
        ...demoData,
        products: demoData.products.filter(p => p.id !== id),
      });
    };

    return {
      products: demoData.products,
      isLoading: false,
      error: null,
      createProduct,
      updateProduct,
      deleteProduct,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    };
  }


  return {
    products,
    isLoading,
    error,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
};
