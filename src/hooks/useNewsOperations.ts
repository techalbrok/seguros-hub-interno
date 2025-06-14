
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateNewsData } from '@/hooks/useNews';

export const useNewsOperations = () => {
  const { toast } = useToast();

  const createNewsRelations = async (newsId: string, newsData: CreateNewsData) => {
    console.log('Creating news relations for:', newsId, newsData);
    const promises = [];

    if (newsData.company_ids?.length) {
      console.log('Creating company relations:', newsData.company_ids);
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
      console.log('Creating category relations:', newsData.category_ids);
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
      console.log('Creating product relations:', newsData.product_ids);
      promises.push(
        supabase
          .from('news_products')
          .insert(newsData.product_ids.map(product_id => ({
            news_id: newsId,
            product_id
          })))
      );
    }

    try {
      await Promise.all(promises);
      console.log('All relations created successfully');
    } catch (error) {
      console.error('Error creating relations:', error);
      throw error;
    }
  };

  const updateNewsRelations = async (newsId: string, newsData: Partial<CreateNewsData>) => {
    console.log('Updating news relations for:', newsId, newsData);
    const promises = [];

    if (newsData.company_ids !== undefined) {
      console.log('Updating company relations:', newsData.company_ids);
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
      console.log('Updating category relations:', newsData.category_ids);
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
      console.log('Updating product relations:', newsData.product_ids);
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

    try {
      await Promise.all(promises);
      console.log('All relations updated successfully');
    } catch (error) {
      console.error('Error updating relations:', error);
      throw error;
    }
  };

  return {
    createNewsRelations,
    updateNewsRelations
  };
};
