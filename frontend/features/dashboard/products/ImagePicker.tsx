'use client';

import React, { useRef } from 'react';
import { Plus, X, ImageIcon } from 'lucide-react';

interface ImagePickerProps {
  /** URLs or object URLs already selected */
  previews: string[];
  /** Index of the main (large preview) image */
  mainIndex: number;
  onMainIndexChange: (index: number) => void;
  onAddFiles: (files: FileList) => void;
  onRemove: (index: number) => void;
}

export function ImagePicker({
  previews,
  mainIndex,
  onMainIndexChange,
  onAddFiles,
  onRemove,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      // reset so same file can be re-selected
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Product Images
      </label>

      {/* Large preview */}
      <div className="relative w-full aspect-[4/3] rounded-xl border-2 border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center">
        {previews.length > 0 && previews[mainIndex] ? (
          <img
            src={previews[mainIndex]}
            alt="Main product preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon size={40} strokeWidth={1.2} />
            <span className="text-sm">No image selected</span>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex items-center gap-2 flex-wrap">
        {previews.map((src, i) => (
          <div
            key={i}
            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
              i === mainIndex
                ? 'border-primary shadow-md shadow-primary/30'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onMainIndexChange(i)}
          >
            <img
              src={src}
              alt={`Image ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(i);
              }}
              className="absolute top-0.5 right-0.5 w-4 h-4 bg-danger rounded-full flex items-center justify-center hover:bg-danger/90 transition-colors"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        ))}

        {/* Add more button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all shrink-0 group"
        >
          <Plus size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Click a thumbnail to set as main. Up to 10 images. JPG, PNG, GIF, WEBP — max 5 MB each.
      </p>
    </div>
  );
}
