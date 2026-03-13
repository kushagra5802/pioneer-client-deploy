

import React, { useEffect, useState } from 'react'
import { Input } from 'antd';
import '../styles/SearchFilter.css';
// import { DownOutlined } from '@ant-design/icons';
import SearchLine from '../assets/svg/search-line.svg';
// import FilterContainer from './FilterContainer';

const SearchFilter = (props) => {
  // const {handleSearch}=useContext(userContext)
  // eslint-disable-next-line
  const [isSearch, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const searchIcon = document.querySelector(".search-icon");
      const isSearchIconClicked = searchIcon && searchIcon.contains(event.target);


      if (isSearchIconClicked) {
        setIsSearchOpen((prevState) => !prevState); // toggle search window
      } else {
        const searchWindow = document.querySelector(".filter-container-body");
        const isSearchWindowClicked = searchWindow && searchWindow.contains(event.target);

        if (!isSearchWindowClicked) {
          setIsSearchOpen(false);
        }
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <div>

      <div className=''>
        {/* <h1 className='pl-4 py-5 text-lg font-bold'>{props.searchTitle}</h1> */}

        <div className='search-filter'>
          <div className='search-option'>
            <Input size="small" placeholder="Search"  onChange={(e) => props.handleSearch(e.target.value)} />
            <img src={SearchLine} alt="" />

          </div>
          {/* <div className='filter-option search-icon'>

            <span>Filter By</span><DownOutlined />
            {isSearch && <FilterContainer />}

          </div>
          {/* <div className='share-modal-btn'>
            <Button>Share</Button>
          </div> */}
        </div>

      </div>

    </div>
  )
}

export default SearchFilter

