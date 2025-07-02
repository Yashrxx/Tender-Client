import './Profile.css'; 
import { useEffect, useState } from 'react';
import Select from 'react-select';

const Profile = () => {
  const companyCategories = [
    "Construction & Civil Works",
    "Information Technology (IT)",
    "Electrical Equipment & Works",
    "Healthcare & Medical Equipment",
    "Roads & Bridges",
    "Education & Training",
    "Consultancy Services",
    "Agriculture & Allied Services",
    "Transportation & Logistics",
    "Telecommunications",
    "Security Services",
    "Water Supply & Sanitation",
    "Office Equipment & Stationery",
    "Environmental Services",
    "Machinery & Industrial Supplies"
  ];

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    description: '',
    address: '',
    email: '',
    phone: '',
    logo: null,
    coverImage: null
  });

  const [preview, setPreview] = useState({
    logo: '',
    coverImage: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user?.email) {
        console.error("User email not found in localStorage");
        return setLoading(false);
      }

      const res = await fetch(`https://tender-client.onrender.com/api/companyRoutes/companyProfile?email=${user.email}`, {
        headers: { 'auth-token': token }
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        console.warn("Failed to parse JSON response");
      }

      if (res.ok && data) {
        setFormData({
          name: data.name || '',
          website: data.website || '',
          industry: data.industry || '',
          description: data.description || '',
          address: data.address || '',
          email: data.email || user.email,
          phone: data.phone || '',
          logo: null,
          coverImage: null
        });

        setPreview({
          logo: data.logo || 'https://tender-client.onrender.com/uploads/1751308596115-TAT_Logo.jpeg',
          coverImage: data.coverImage || 'https://tender-client.onrender.com/uploads/1751308596116-wood-blk-bg.jpg'
        });
      } else {
        console.warn("Company profile not found — using fallback");

        setFormData({
          name: '',
          website: '',
          industry: '',
          description: '',
          address: '',
          email: user.email,
          phone: '',
          logo: null,
          coverImage: null
        });

        setPreview({
          logo: 'https://tender-client.onrender.com/uploads/1751308596115-TAT_Logo.jpeg',
          coverImage: 'https://tender-client.onrender.com/uploads/1751308596116-wood-blk-bg.jpg'
        });
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      const user = JSON.parse(localStorage.getItem('user'));

      setFormData({
        name: 'yash',
        website: 'https://yashrx@gmail.com',
        industry: 'Fashion Design',
        description: 'Fashion Designer Studio for men and women of all ages and all body types..',
        address: 'Nattu pilliyar koil Street , Sowcarpet , chennai -01',
        email: user?.email || '',
        phone: '9789800288',
        logo: null,
        coverImage: null
      });

      setPreview({
        logo: 'https://tender-client.onrender.com/uploads/1751308596115-TAT_Logo.jpeg',
        coverImage: 'https://tender-client.onrender.com/uploads/1751308596116-wood-blk-bg.jpg'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    if (name === 'logo') {
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreview((prev) => ({ ...prev, logo: previewURL }));
      setLogoFile(file);
    } else if (name === 'coverImage') {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setPreview((prev) => ({ ...prev, coverImage: previewURL }));
      setCoverFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://tender-client.onrender.com/api/companyRoutes/companyProfile', {
        method: 'POST',
        headers: {
          'auth-token': token
        },
        body: submitData
      });

      const result = await res.json();
      if (res.ok) {
        alert('Profile saved successfully');
        setIsEditing(false);
        fetchProfile();
      } else {
        alert(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit profile');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container">
      <h1>Company Profile</h1>
      <p className="subtext">Manage your company's information and settings.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label>Company Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter company name" disabled={!isEditing} />

        <label>Company Website</label>
        <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Enter website URL" disabled={!isEditing} />

        <label htmlFor="category">Industry</label>
        <Select
          disabled={!isEditing}
          options={companyCategories.map(cat => ({ value: cat, label: cat }))}
          value={formData.industry ? { value: formData.industry, label: formData.industry } : null}
          onChange={(selectedOption) =>
            setFormData({ ...formData, industry: selectedOption.value })
          }
          placeholder="Select industry"
          styles={{
            menuList: (base) => ({
              ...base,
              maxHeight: 150,
              overflowY: 'auto',
            }),
          }}
        />

        <label>Company Description</label>
        <textarea rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" disabled={!isEditing}></textarea>

        <label>Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" disabled={!isEditing} />

        <label>Contact Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" disabled={!isEditing} />

        <label>Contact Phone</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" disabled={!isEditing} />

        <div className="upload-section">
          <label>Logo</label>
          <input type="file" name="logo" accept="image/*" onChange={handleFileChange} disabled={!isEditing} />
          {logoFile && <p className="filename">{logoFile.name}</p>}
          {preview.logo && <img src={preview.logo} alt="Logo Preview" width="100" />}
        </div>

        <div className="upload-section">
          <label>Cover Image</label>
          <input type="file" name="coverImage" accept="image/*" onChange={handleFileChange} disabled={!isEditing} />
          {coverFile && <p className="filename">{coverFile.name}</p>}
          {preview.coverImage && <img src={preview.coverImage} alt="Cover Preview" width="200" />}
        </div>

        {isEditing ? (
          <div className="button-wrapper">
            <button type="submit" className="save-button">Save Changes</button>
          </div>
        ) : (
          <div className="button-wrapper">
            <button type="button" onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;