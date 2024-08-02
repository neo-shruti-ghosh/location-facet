import { useEffect, useState } from 'react';
import './HomePage.css';
import { Country, getCountries } from '../utils/apiService';
import CircularProgress from '@mui/material/CircularProgress';
import MinimizeIcon from '@mui/icons-material/Minimize';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import UnfoldLessDoubleIcon from '@mui/icons-material/UnfoldLessDouble';

function HomePage() {
  const [data, setData] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [clearAllChecked, setClearAllChecked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const getData = async () => {
    const response = await getCountries();
    if (response) {
      const sortedData = response.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
      setData(sortedData);
      setFilteredData(sortedData);
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = data.filter((country) => {
      const countryName = country.name ? country.name.toLowerCase() : '';
      const countryCapital = country.capital ? country.capital.toLowerCase() : '';
      return (
        countryName.includes(text.toLowerCase()) ||
        countryCapital.includes(text.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };


  const handleIndexClick = (letter: string) => {
    const index = filteredData.findIndex((country) => country.name.startsWith(letter));
    if (index !== -1) {
      const element = document.getElementById(`country-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSelectAll = () => {
    const allSelected = new Set(data.map((country) => country.name));
    setSelectedCountries(allSelected);
    setClearAllChecked(false)
    setSelectAllChecked(!selectAllChecked);
  };

  const handleClearAll = () => {
    setSelectedCountries(new Set());
    setSelectAllChecked(false);
    setClearAllChecked(!clearAllChecked);
  };

  const handleCheckboxChange = (countryName: string) => {
    setSelectedCountries((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(countryName)) {
        newSelected.delete(countryName);
      } else {
        newSelected.add(countryName);
      }
      setSelectAllChecked(newSelected.size === data.length);
      return newSelected;
    });
  };

  const handleApply = () => {
    console.log("Selected Locations:", Array.from(selectedCountries));
  };

  useEffect(() => {
    getData();
  }, []);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="HomePage">
      <div className={`container ${collapsed ? 'rotate90' : ''}`}>
        <div className="headerContainer">
          <span className="headerText">Locations</span>
          <div className="buttonsContainer">
            {!collapsed ? <>
              <div className="btn" onClick={() => setExpanded(!expanded)}>
                {expanded ? <MinimizeIcon /> : <WebAssetIcon />}
              </div>
              <div className="btn rotate180" onClick={() => {
                setExpanded(false);
                setCollapsed(true);
              }}>
                <KeyboardTabIcon />
              </div> </> :
              <div className="btn rotate90" onClick={() => {
                setExpanded(true);
                setCollapsed(false);
              }}>
                <UnfoldLessDoubleIcon />
              </div>
            }
          </div>
        </div>
        {expanded && (
          <div className="dataContainer">
            <div className="searchBar">
              <div className="btn">
                <SearchIcon />
              </div>
              <input
                className="inputSearchBar"
                value={searchText}
                type="text"
                placeholder="Filter Locations"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="optionsContainer">
              <FormControlLabel
                control={<Checkbox size="small" checked={selectAllChecked} onChange={handleSelectAll} />}
                label={<span className="label">Select All</span>}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={clearAllChecked} checkedIcon={<IndeterminateCheckBoxIcon />} onChange={handleClearAll} />}
                label={<span className="label">Clear All</span>}
              />
            </div>
            <div className="listContainer">
              <div className="countryList">
                {loading && <CircularProgress />}
                {filteredData.map((country, index) => (
                  <FormControlLabel
                    className="listItem"
                    key={index}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedCountries.has(country.name)}
                        onChange={() => handleCheckboxChange(country.name)}
                      />
                    }
                    label={
                      <div className="labelContainer">
                        <img src={country.flag} className="flag" alt={`${country.name} flag`} />
                        <span title={`${country.name} - ${country.capital}`} className="country-name" id={`country-${index}`}>
                          {country.name} - {country.capital}
                        </span>
                      </div>
                    }
                  />
                ))}
              </div>
              <div className="indexList">
                {alphabet.map((letter) => (
                  <div key={letter} className="indexItem" onClick={() => handleIndexClick(letter)}>
                    {letter}
                  </div>
                ))}
              </div>
            </div>
            <Button variant="contained" onClick={handleApply}>
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
