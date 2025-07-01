import './Search.css'

const Search = () => {
  return (
    <div className="company-page">
    <h1>Find Companies</h1>

    <input className="search-bar" type="text" placeholder="Search by company name, industry, or products/services" />

    <h3>Browse by Industry</h3>
    <div className="industry-tags">
      <span>Technology</span>
      <span>Healthcare</span>
      <span>Finance</span>
      <span>Manufacturing</span>
      <span>Retail</span>
      <span>Energy</span>
      <span>Transportation</span>
      <span>Agriculture</span>
      <span>Education</span>
      <span>Government</span>
    </div>

    <h3>Featured Companies</h3>
    <div className="company-grid">
      <img src="company1.png" alt="Company 1" />
      <img src="company2.png" alt="Company 2" />
      <img src="company3.png" alt="Company 3" />
      <img src="company4.png" alt="Company 4" />
      <img src="company5.png" alt="Company 5" />
      <img src="company6.png" alt="Company 6" />
    </div>

    <div className="pagination">
      <button>&lt;</button>
      <button className="active">1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button>5</button>
      <button>&gt;</button>
    </div>
  </div>
  )
}

export default Search
