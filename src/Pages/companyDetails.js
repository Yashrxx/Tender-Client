import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './companyDetails.css';

const CompanyDetails = ({ mode }) => {
    const { state } = useLocation();
    const [company, setCompany] = useState(state?.company || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {

            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const userEmail = localStorage.getItem('email');

                const res = await fetch(`https://tender-client.onrender.com/api/companyRoutes/companyProfile?email=${userEmail}`, {
                    method: 'GET', // GET is default, optional
                    headers: {
                        'auth-token': token,
                    },
                });
                const data = await res.json();
                setCompany(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching company:', err);
            }
        };
        fetchCompany();
    }, []);

    if (!company) 
        return <div className="loading-spinner"></div>
    

    return (
        <div className="company-details">
            <img
                src={company.coverImage || 'https://dummyimage.com/600x200/cccccc/000000.png&text=Cover'}
                alt="Cover"
                className="cover-image"
            />
            <img
                src={company.logo || 'https://dummyimage.com/100x100/cccccc/000000.png&text=Logo'}
                alt="Logo"
                className="logo"
            />
            <h1 className="company-title">{company.name}</h1>

            <div className="company-details-table">
                <table>
                    <tbody>
                        <tr>
                            <th>Email:</th>
                            <td>{company.email}</td>
                        </tr>
                        <tr>
                            <th>Phone:</th>
                            <td>{company.phone}</td>
                        </tr>
                        <tr>
                            <th>Website:</th>
                            <td><a href={company.website} target="_blank" rel="noreferrer">{company.website}</a></td>
                        </tr>
                        <tr>
                            <th>Location:</th>
                            <td>{company.address || company.location}</td>
                        </tr>
                        <tr>
                            <th>Industry:</th>
                            <td>{company.industry || company.category}</td>
                        </tr>
                        <tr>
                            <th>Description:</th>
                            <td>{company.description}</td>
                        </tr>
                        <tr>
                            <th>Created At:</th>
                            <td>{new Date(company.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default CompanyDetails;
