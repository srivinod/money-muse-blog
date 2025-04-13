
interface PageHeaderProps {
  title: string;
  description?: string;
  center?: boolean;
}

const PageHeader = ({ title, description, center = true }: PageHeaderProps) => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container-custom">
        <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {description && <p className="text-xl text-gray-600">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
