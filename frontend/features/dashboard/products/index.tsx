'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table/Table';
import { Badge } from '@/components/badge/Badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/pagination/Pagination';
import { Button } from '@/components/button/Button';
import { ProductModal } from './ProductModal';
import { useGetProductsQuery, useDeleteProductMutation } from '@/services/product';
import type { Product } from '@/services/product';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001';

function DeleteConfirmDialog({
  product,
  onConfirm,
  onCancel,
  onClose,
  isLoading,
  errorMessage,
}: {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={errorMessage ? onClose : onCancel} />
      <div className="relative bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        {errorMessage ? (
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Cannot Delete Product</h2>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <button
              onClick={onClose}
              className="mt-2 w-full px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Delete Product</h2>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">{product.name}</span>? This
                action cannot be undone and will also remove all product images.
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
          </>
        )}
      </div>
    </div>
  );
}

export function ProductsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetProductsQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const products = data?.data ?? [];
  const meta = data?.meta;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id).unwrap();
      toast.success(`"${deletingProduct.name}" deleted successfully`);
      setDeletingProduct(null);
      setDeleteError(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setDeleteError(error?.data?.message ?? 'Failed to delete product. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeletingProduct(null);
    setDeleteError(null);
  };

  const renderTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return <span className="text-muted-foreground text-xs">-</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => {
          const lower = tag.toLowerCase();
          let variant: 'green' | 'purple' | 'gray' = 'gray';
          if (lower === 'bestseller' || lower === 'sale') variant = 'green';
          else if (lower === 'new' || lower === 'featured') variant = 'purple';
          return (
            <Badge key={tag} variant={variant}>
              {tag}
            </Badge>
          );
        })}
      </div>
    );
  };

  const renderPagination = () => {
    if (!meta || meta.totalPages <= 1) return null;
    const pages: (number | 'ellipsis')[] = [];
    const total = meta.totalPages;
    const cur = meta.page;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cur > 3) pages.push('ellipsis');
      for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) {
        pages.push(i);
      }
      if (cur < total - 2) pages.push('ellipsis');
      pages.push(total);
    }

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-medium">
            {(cur - 1) * meta.limit + 1}–
            {Math.min(cur * meta.limit, meta.total)}
          </span>{' '}
          of <span className="font-medium">{meta.total}</span> products
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={cur === 1 ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
              />
            </PaginationItem>
            {pages.map((p, i) =>
              p === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === cur}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(total, p + 1))}
                className={cur === total ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {meta ? `${meta.total} total products` : 'Loading...'}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsProductModalOpen(true);
          }}
          className="shrink-0"
        >
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search size={16} />
          </button>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-ring/20 shadow-sm transition-all duration-200"
          />
        </div>
      </form>

      {/* Table */}
      <div className={isFetching ? 'opacity-70 transition-opacity' : ''}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No products found.{' '}
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsProductModalOpen(true);
                    }}
                    className="text-indigo-500 hover:underline"
                  >
                    Add your first product.
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                        {product.images.length > 0 ? (
                          <img
                            src={`${API_URL}/${product.images[0]}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">📦</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID #{product.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="purple">{product.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-foreground">
                      Rs. {parseFloat(product.price).toFixed(2)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        Rs. {parseFloat(product.originalPrice).toFixed(2)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stockQty > 10
                          ? 'text-green-500 font-medium'
                          : product.stockQty > 0
                          ? 'text-orange-500 font-medium'
                          : 'text-red-500 font-medium'
                      }
                    >
                      {product.stockQty}
                    </span>
                  </TableCell>
                  <TableCell>{renderTags(product.tags)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors text-foreground"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingProduct(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-red-200 rounded-md hover:bg-red-50 transition-colors text-red-500"
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
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        editing={editingProduct}
      />

      {/* Delete Confirmation */}
      {deletingProduct && (
        <DeleteConfirmDialog
          product={deletingProduct}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          onClose={handleDeleteCancel}
          isLoading={isDeleting}
          errorMessage={deleteError}
        />
      )}
    </div>
  );
}
