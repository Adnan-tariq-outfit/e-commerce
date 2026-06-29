'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/services/category';
import type { Category } from '@/services/category';
import { Button } from '@/components/button/Button';
import * as yup from 'yup';

const categorySchema = yup.object().shape({
  name: yup.string().trim().required('Category name is required').min(2, 'Name must be at least 2 characters'),
});

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editing?: Category | null;
}

export function CategoryModal({ isOpen, onClose, editing }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [errors, setErrors] = useState<{ name?: string }>({});

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (editing) {
      setName(editing.name);
    } else {
      setName('');
    }
    setErrors({});
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await categorySchema.validate({ name }, { abortEarly: false });
      setErrors({});
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: { name?: string } = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path as keyof typeof validationErrors] = error.message;
        });
        setErrors(validationErrors);
        return;
      }
    }

    try {
      if (editing) {
        await updateCategory({ id: editing.id, name: name.trim() }).unwrap();
        toast.success(`Category "${name}" updated successfully`);
      } else {
        await createCategory({ name: name.trim() }).unwrap();
        toast.success(`Category "${name}" created successfully`);
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? 'Failed to save category');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">
            {editing ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({});
              }}
              placeholder="e.g. Electronics"
              className={`w-full px-3 py-2.5 border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.name 
                  ? 'border-danger focus:ring-danger/30 focus:border-danger' 
                  : 'border-border focus:ring-ring/30 focus:border-ring'
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-danger">{errors.name}</p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
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
              disabled={!name.trim()}
              className="flex-1"
            >
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
