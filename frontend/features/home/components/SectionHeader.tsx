import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  eyebrow: string;
  viewAllLink?: string;
  align?: 'left' | 'center';
}

export const SectionHeader = ({ title, eyebrow, viewAllLink, align = 'left' }: SectionHeaderProps) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12 ${align === 'center' ? 'items-center text-center justify-center' : 'items-start sm:items-end justify-between'}`}>
      <div className={`flex flex-col ${align === 'center' ? 'items-center' : ''}`}>
        <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
          {eyebrow}
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {title}
        </h2>
      </div>
      
      {viewAllLink && (
        <Link 
          href={viewAllLink}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted hover:text-foreground transition-colors shadow-sm whitespace-nowrap"
        >
          View all &rarr;
        </Link>
      )}
    </div>
  );
};
