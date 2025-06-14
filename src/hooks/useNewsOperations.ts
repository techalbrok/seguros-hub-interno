
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateNewsData } from '@/hooks/useNews';

export const useNewsOperations = () => {
  const { toast } = useToast();

  const createNewsRelations = async (newsId: string, newsData: CreateNewsData) => {
    const promises = [];

    if (newsData.company_ids?.length) {
      promises.push(
        supabase
          .from('news_companies')
          .insert(newsData.company_ids.map(company_id => ({
            news_id: newsId,
            company_id
          })))
      );
    }

    if (newsData.category_ids?.length) {
      promises.push(
        supabase
          .from('news_categories')
          .insert(newsData.category_ids.map(category_id => ({
            news_id: newsId,
            category_id
          })))
      );
    }

    if (newsData.product_ids?.length) {
      promises.push(
        supabase
          .from('news_products')
          .insert(newsData.product_ids.map(product_id => ({
            news_id: newsId,
            product_id
          })))
      );
    }

    await Promise.all(promises);
  };

  const updateNewsRelations = async (newsId: string, newsData: Partial<CreateNewsData>) => {
    const promises = [];

    if (newsData.company_ids !== undefined) {
      promises.push(supabase.from('news_companies').delete().eq('news_id', newsId));
      if (newsData.company_ids.length > 0) {
        promises.push(
          supabase
            .from('news_companies')
            .insert(newsData.company_ids.map(company_id => ({
              news_id: newsId,
              company_id
            })))
        );
      }
    }

    if (newsData.category_ids !== undefined) {
      promises.push(supabase.from('news_categories').delete().eq('news_id', newsId));
      if (newsData.category_ids.length > 0) {
        promises.push(
          supabase
            .from('news_categories')
            .insert(newsData.category_ids.map(category_id => ({
              news_id: newsId,
              category_id
            })))
        );
      }
    }

    if (newsData.product_ids !== undefined) {
      promises.push(supabase.from('news_products').delete().eq('news_id', newsId));
      if (newsData.product_ids.length > 0) {
        promises.push(
          supabase
            .from('news_products')
            .insert(newsData.product_ids.map(product_id => ({
              news_id: newsId,
              product_id
            })))
        );
      }
    }

    await Promise.all(promises);
  };

  return {
    createNewsRelations,
    updateNewsRelations
  };
};
