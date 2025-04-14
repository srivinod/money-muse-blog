import { Helmet } from 'react-helmet-async';

interface MetaDataProps {
  title: string;
  description: string;
  keywords?: string;
}

const MetaData = ({ title, description, keywords }: MetaDataProps) => {
  return (
    <Helmet>
      <title>{title} | finance90</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={`${title} | finance90`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${title} | finance90`} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default MetaData; 