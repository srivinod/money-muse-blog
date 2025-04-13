
import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
}

const CategoryCard = ({ title, description, icon, slug }: CategoryCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-primary/10 rounded-full mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          to={`/category/${slug}`}
          className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors"
        >
          Explore Articles
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;
