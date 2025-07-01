import './Application.css';
import { useState } from 'react';
import Select from 'react-select';

const Applications = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: '',
    category: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://tender-client.onrender.com/api/tenderRoutes/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Tender submitted successfully");
        setFormData({
          title: '',
          description: '',
          deadline: '',
          budget: '',
          category: '',
          location: ''
        });
      } else {
        alert("Failed to submit: " + result.error);
      }
    } catch (error) {
      console.error("Error parsing response", error);
      alert("Something went wrong while submitting the tender.");
    }
  };

  const indianStates = [
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" },
    { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
    { value: "Delhi", label: "Delhi" },
    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
    { value: "Ladakh", label: "Ladakh" },
    { value: "Lakshadweep", label: "Lakshadweep" },
    { value: "Puducherry", label: "Puducherry" }
  ];

  const tenderCategories = [
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

  return (
    <div className="tender-container">
      <h1>Create New Tender</h1>
      <form className="tender-form" onSubmit={handleSubmit}>

        <label htmlFor="title">Tender Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., IT Equipment Upgrade"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide a detailed description of the tender requirements"
          required
        />

        <label htmlFor="deadline">Deadline</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />

        <label htmlFor="budget">Budget</label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Enter Budget"
          required
        />

        <label htmlFor="category">Category</label>
        <Select
          options={tenderCategories.map(cat => ({ value: cat, label: cat }))}
          value={formData.category ? { value: formData.category, label: formData.category } : null}
          onChange={(selectedOption) =>
            setFormData({ ...formData, category: selectedOption.value })
          }
          placeholder="Select Category"
          styles={{
            menuList: (base) => ({
              ...base,
              maxHeight: 150,
              overflowY: 'auto',
            }),
          }}
        />

        <label htmlFor="location">Location</label>
        <Select
          id="location"
          name="location"
          options={indianStates}
          value={formData.location ? indianStates.find(state => state.value === formData.location) : null}
          onChange={(selectedOption) =>
            setFormData({ ...formData, location: selectedOption.value })
          }
          placeholder="Select State"
          styles={{
            menuList: (base) => ({
              ...base,
              maxHeight: 150,
              overflowY: 'auto',
            }),
          }}
        />

        <button type="submit">Publish Tender</button>
      </form>
    </div>
  );
};

export default Applications;