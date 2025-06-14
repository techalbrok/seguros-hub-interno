
import { useProductQueries } from './products/useProductQueries';
import { useProductSubscriptions } from './products/useProductSubscriptions';
import { useProductMutations } from './products/useProductMutations';

export const useProducts = () => {
  const { products, isLoading, error } = useProductQueries();
  useProductSubscriptions();

  const {
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProductMutations();

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
