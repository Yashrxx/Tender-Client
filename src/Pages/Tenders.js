import { Fragment, useContext, useEffect, useState, useRef } from 'react';
import './Tenders.css';
import { UserContext } from '../context/userContext';

const Tenders = ({ mode }) => {
  const { user } = useContext(UserContext);
  const [allTenders, setAllTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    status: 'All',
    date: 'All',
  });
  const rowRefs = useRef([]);

  // Fetch tenders
  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://tender-client.onrender.com/api/tenderRoutes/newTender`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });

        let data;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          console.error('Unexpected response:', await res.text());
          data = [];
        }

        setAllTenders(data || []);
        setFilteredTenders(data || []);
      } catch (err) {
        console.error('Error fetching tenders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [user]);

  // Filtering tenders
  useEffect(() => {
    let results = [...allTenders];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      results = results.filter(t =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.company?.name?.toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'All') results = results.filter(t => t.category === filters.category);
    if (filters.location !== 'All') results = results.filter(t => t.location === filters.location);
    if (filters.status !== 'All') results = results.filter(t => t.status === filters.status);
    if (filters.date === 'Upcoming') results = results.filter(t => new Date(t.deadline) > new Date());
    if (filters.date === 'Past') results = results.filter(t => new Date(t.deadline) < new Date());

    setFilteredTenders(results);
  }, [allTenders, searchQuery, filters]);

  // Unique filter options
  const uniqueCategories = ['All', ...new Set(allTenders.map(t => t.category))];
  const uniqueLocations = ['All', ...new Set(allTenders.map(t => t.location))];
  const uniqueStatuses = ['All', ...new Set(allTenders.map(t => t.status))];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : 'N/A';
  };

  const handleRowClick = (index) => {
    setExpandedRow(prev => (prev === index ? null : index));
    setTimeout(() => {
      rowRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const toggleDescription = (index) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className={`tender-page ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
      <aside className={`filter-panel ${mode === 'dark' ? 'dark-panel' : ''}`}>
        <input
          type="text"
          className="search-input"
          placeholder="Search tenders"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <h3>Filters</h3>

        <select value={filters.category} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}>
          {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select value={filters.location} onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}>
          {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>

        <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
          {uniqueStatuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
        </select>

        <select value={filters.date} onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}>
          <option value="All">All</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Past">Past</option>
        </select>
      </aside>

      <main className={`tender-table-section ${mode === 'dark' ? 'dark-main' : ''}`}>
        <h1>Tenders</h1>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="table-container">
            <table className={`tender-table ${mode === 'dark' ? 'dark-table' : ''}`}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenders.map((tender, index) => (
                  <Fragment key={tender._id}>
                    <tr onClick={() => handleRowClick(index)} ref={el => rowRefs.current[index] = el} className="cursor-pointer">
                      <td>{tender.title}</td>
                      <td className="text-blue">{tender.category}</td>
                      <td className="text-blue">{tender.location}</td>
                      <td>
                        <span className="status-badge">{tender.status}</span>
                      </td>
                      <td>{formatDate(tender.deadline)}</td>
                    </tr>

                    {expandedRow === index && (
                      <tr>
                        <td colSpan="5">
                          <div className={`dropdown-details ${mode === 'dark' ? 'dark-dropdown' : ''}`}>
                            <p>
                              <strong>Description:</strong>{' '}
                              {expandedDescriptions[index]
                                ? tender.description
                                : `${tender.description.slice(0, 200)}...`}
                            </p>

                            {tender.company ? (
                              <>
                                <p><strong>Company:</strong> {tender.company.name}</p>
                                <p><strong>Phone:</strong> {tender.company.phone}</p>
                              </>
                            ) : (
                              <>
                                <p><strong>Company:</strong> Not provided</p>
                                <p><strong>Phone:</strong> Not available</p>
                              </>
                            )}

                            <p><strong>Budget:</strong> ₹{tender.budget}</p>
                          </div>

                          {tender.description.length > 200 && (
                            <div className="view-more-container">
                              <button
                                className="view-more-btn"
                                onClick={() => toggleDescription(index)}
                              >
                                {expandedDescriptions[index] ? 'View Less ↑' : 'View More →'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tenders;