import { useLocation } from 'react-router-dom';
import './CompanyDetails.css';

const CompanyDetails = () => {
  const { state } = useLocation();
  const company = state?.company;

  if (!company) return <div>No company data found.</div>;

  return (
    <div className="company-details">
      <img
        src={company.coverImageUrl
          ? `https://tender-client.onrender.com/${company.coverImageUrl}`
          : 'https://via.placeholder.com/600x200?text=Cover'}
        alt="Cover"
        className="cover-image"
      />
      <img
        src={company.logoUrl
          ? `https://tender-client.onrender.com/${company.logoUrl}`
          : 'https://via.placeholder.com/100?text=Logo'}
        alt="Logo"
        className="logo"
      />
      <h1>{company.name}</h1>
      <p><strong>Email:</strong> {company.email}</p>
      <p><strong>Location:</strong> {company.location}</p>
      <p><strong>Industry:</strong> {company.industry || company.category}</p>
      <p><strong>Description:</strong> {company.description}</p>
    </div>
  );
};

export default CompanyDetails;