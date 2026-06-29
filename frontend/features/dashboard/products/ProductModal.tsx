'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { ImagePicker } from './ImagePicker';
import { CategoryModal } from './CategoryModal';
import { Button } from '@/components/button/Button';
import { useGetCategoriesQuery } from '@/services/category';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/services/product';
import type { Product } from '@/services/product';
import * as yup from 'yup';

const productSchema = yup.object().shape({
  name: yup.string().trim().required('Product name is required').min(3, 'Name must be at least 3 characters'),
  categoryId: yup.string().required('Category is required'),
  price: yup
    .number()
    .typeError('Price must be a valid number')
    .positive('Price must be greater than zero')
    .required('Price is required'),
  originalPrice: yup
    .number()
    .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
    .nullable()
    .typeError('Original price must be a valid number')
    .positive('Original price must be greater than zero'),
  stockQty: yup
    .number()
    .typeError('Stock quantity must be a valid number')
    .min(0, 'Stock cannot be negative')
    .integer('Stock must be a whole number')
    .required('Stock quantity is required'),
  description: yup.string().trim().required('Description is required').min(10, 'Description must be at least 10 characters'),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001';

const AVAILABLE_TAGS = ['New', 'Bestseller', 'Featured', 'Limited Edition', 'Sale'];

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editing?: Product | null;
}

export function ProductModal({ isOpen, onClose, editing }: ProductModalProps) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isLoading = isCreating || isUpdating;

  // Form state
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stockQty, setStockQty] = useState('0');
  const [tags, setTags] = useState<string[]>([]);

  // Image state
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [mainIndex, setMainIndex] = useState(0);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Category modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setName(editing.name);
      setCategoryId(editing.categoryId);
      setDescription(editing.description);
      setPrice(editing.price);
      setOriginalPrice(editing.originalPrice ?? '');
      setStockQty(String(editing.stockQty));
      setTags(editing.tags);
      setExistingImages(editing.images);
      setPreviews(editing.images.map((img) => `${API_URL}/${img}`));
      setRemovedImages([]);
      setNewFiles([]);
      setMainIndex(0);
    } else {
      resetForm();
    }
  }, [isOpen, editing]);

  // Clean up object URLs on unmount or when previews change
  const prevObjectUrls = useRef<string[]>([]);
  useEffect(() => {
    return () => {
      prevObjectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const resetForm = () => {
    setName('');
    setCategoryId('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setStockQty('0');
    setTags([]);
    setNewFiles([]);
    setPreviews([]);
    setExistingImages([]);
    setRemovedImages([]);
    setMainIndex(0);
    setErrors({});
  };

  const handleAddFiles = (files: FileList) => {
    const filesArray = Array.from(files);
    const objectUrls = filesArray.map((f) => URL.createObjectURL(f));
    prevObjectUrls.current = [...prevObjectUrls.current, ...objectUrls];
    setNewFiles((prev) => [...prev, ...filesArray]);
    setPreviews((prev) => [...prev, ...objectUrls]);
  };

  const handleRemove = (index: number) => {
    const isExisting = index < existingImages.length;
    if (isExisting) {
      const removed = existingImages[index];
      // Extract just the filename for the removeImages payload
      const filename = removed.split('/').pop()!;
      setRemovedImages((prev) => [...prev, filename]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newFileIndex = index - existingImages.length;
      const url = previews[index];
      URL.revokeObjectURL(url);
      setNewFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (mainIndex >= previews.length - 1) setMainIndex(Math.max(0, previews.length - 2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await productSchema.validate(
        { name, categoryId, price, originalPrice, stockQty, description },
        { abortEarly: false }
      );
      setErrors({});
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryId', categoryId);
    formData.append('description', description);
    formData.append('price', price);
    if (originalPrice) formData.append('originalPrice', originalPrice);
    formData.append('stockQty', stockQty);
    tags.forEach((tag) => formData.append('tags[]', tag));
    newFiles.forEach((file) => formData.append('images', file));

    if (editing && removedImages.length > 0) {
      removedImages.forEach((img) => formData.append('removeImages[]', img));
    }

    try {
      if (editing) {
        await updateProduct({ id: editing.id, formData }).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await createProduct({ formData }).unwrap();
        toast.success('Product created successfully!');
      }
      onClose();
      resetForm();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? 'Failed to save product');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto py-8">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-5xl mx-4 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {editing ? 'Edit Product' : 'Add Product'}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {editing ? 'Update product details' : 'Create a new product listing'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side: Images */}
              <div>
                <ImagePicker
                  previews={previews}
                  mainIndex={mainIndex}
                  onMainIndexChange={setMainIndex}
                  onAddFiles={handleAddFiles}
                  onRemove={handleRemove}
                />
              </div>

              {/* Right side: Fields */}
              <div className="space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Wireless Pro Earbuds"
                className={`w-full px-3 py-2.5 border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.name 
                    ? 'border-danger focus:ring-danger/30 focus:border-danger' 
                    : 'border-border focus:ring-ring/30 focus:border-ring'
                }`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
            </div>

            {/* Category + Add Category */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <div className="flex gap-2">
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: '' }));
                  }}
                  className={`flex-1 px-3 py-2.5 border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.categoryId 
                      ? 'border-danger focus:ring-danger/30 focus:border-danger' 
                      : 'border-border focus:ring-ring/30 focus:border-ring'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border border-dashed border-primary/40 text-primary rounded-lg hover:bg-primary/10 transition-colors shrink-0"
                >
                  <Plus size={16} />
                  New
                </button>
              </div>
              {errors.categoryId && <p className="mt-1.5 text-xs text-danger">{errors.categoryId}</p>}
            </div>

            {/* Price + Original Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                  }}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2.5 border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.price 
                      ? 'border-danger focus:ring-danger/30 focus:border-danger' 
                      : 'border-border focus:ring-ring/30 focus:border-ring'
                  }`}
                />
                {errors.price && <p className="mt-1.5 text-xs text-danger">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Original Price (Rs.) <span className="text-muted-foreground/70 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => {
                    setOriginalPrice(e.target.value);
                    if (errors.originalPrice) setErrors((prev) => ({ ...prev, originalPrice: '' }));
                  }}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2.5 border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.originalPrice 
                      ? 'border-danger focus:ring-danger/30 focus:border-danger' 
                      : 'border-border focus:ring-ring/30 focus:border-ring'
                  }`}
                />
                {errors.originalPrice && <p className="mt-1.5 text-xs text-danger">{errors.originalPrice}</p>}
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={stockQty}
                onChange={(e) => {
                  setStockQty(e.target.value);
                  if (errors.stockQty) setErrors((prev) => ({ ...prev, stockQty: '' }));
                }}
                placeholder="0"
                min="0"
                className={`w-full px-3 py-2.5 border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.stockQty 
                    ? 'border-danger focus:ring-danger/30 focus:border-danger' 
                    : 'border-border focus:ring-ring/30 focus:border-ring'
                }`}
              />
              {errors.stockQty && <p className="mt-1.5 text-xs text-danger">{errors.stockQty}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                placeholder="Product description..."
                rows={3}
                className={`w-full px-3 py-2.5 border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description 
                    ? 'border-danger focus:ring-danger/30 focus:border-danger' 
                    : 'border-border focus:ring-ring/30 focus:border-ring'
                }`}
              />
              {errors.description && <p className="mt-1.5 text-xs text-danger">{errors.description}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setTags(tags.filter((t) => t !== tag));
                        } else {
                          setTags([...tags, tag]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border-primary/30 text-primary'
                          : 'bg-background border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 mt-8 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex-1"
              >
                {editing ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Inline Category Modal */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />
    </>
  );
}
