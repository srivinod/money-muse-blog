import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  imageUrl: string;
  slug: string;
  featured?: boolean;
}

const BlogPostCard = ({
  title,
  excerpt,
  category,
  date,
  author,
  imageUrl,
  slug,
  featured = false,
}: BlogPostCardProps) => {
  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-md card-hover ${featured ? 'md:col-span-2' : ''}`}>
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className={`w-full object-cover ${featured ? 'h-64' : 'h-48'}`}
        />
        <Link 
          to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
          className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full"
        >
          {category}
        </Link>
      </div>
      <div className="p-6">
        <Link to={`/blog/${slug}`}>
          <h3 className={`font-bold text-gray-900 hover:text-primary transition-colors ${featured ? 'text-2xl' : 'text-xl'} mb-2`}>
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>{author}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
