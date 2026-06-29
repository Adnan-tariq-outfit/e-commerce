'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, Tag } from 'lucide-react';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table/Table';
import { Button } from '@/components/button/Button';
import { CategoryModal } from '../products/CategoryModal';
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from '@/services/category';
import type { Category } from '@/services/category';

function DeleteCategoryDialog({
  category,
  onConfirm,
  onCancel,
  isLoading,
}: {
  category: Category;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Delete Category</h2>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">{category.name}</span>? This
            action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CategoriesTable() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory(deletingCategory.id).unwrap();
      toast.success(`Category "${deletingCategory.name}" deleted`);
      setDeletingCategory(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {categories.length} total categories
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setIsCategoryModalOpen(true);
          }}
          className="shrink-0"
        >
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                No categories yet.{' '}
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-indigo-500 hover:underline"
                >
                  Add your first category.
                </button>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
                      <Tag size={14} className="text-indigo-500" />
                    </div>
                    <span className="font-medium text-foreground">{cat.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground font-mono">{cat.slug}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-semibold ${
                      cat._count.products > 0 ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    {cat._count.products}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsCategoryModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors text-foreground"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (cat._count.products > 0) {
                          toast.error(
                            `Cannot delete "${cat.name}": it has ${cat._count.products} product(s). Remove or reassign them first.`
                          );
                          return;
                        }
                        setDeletingCategory(cat);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
                        cat._count.products > 0
                          ? 'border-border/50 text-muted-foreground/50 cursor-not-allowed'
                          : 'border-danger/30 hover:bg-danger/10 text-danger'
                      }`}
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        editing={editingCategory}
      />

      {/* Delete Confirmation */}
      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCategory(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
