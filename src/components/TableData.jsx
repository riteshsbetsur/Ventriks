import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
// import { GrFavorite } from "react-icons/gr";

const TableData = () => {
  const [info, setInfo] = useState([]);
  const [search, setSearch] = useState("");
  const [fav, setFav] = useState([]);
  const [country, setCountry] = useState("");
  const [presentPage, setPresentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const data = async () => {
      const fetchData = await axios("http://universities.hipolabs.com/search");
      // console.log(fetchData.data);
      setInfo(fetchData.data);
    };
    data();
  }, []);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites"));
    if (fav) {
      setFav(favs);
    }
  }, []);
  console.log(info);
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(fav));
  }, [fav]);

  const indexOfLastRow = presentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = info.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPageClick = () => {
    setPresentPage(presentPage + 1);
  };

  const handlePrevPageClick = () => {
    setPresentPage(presentPage - 1);
  };
  const filteredRows = currentRows.filter(row => {
    const nameMatches = row.name.toLowerCase().includes(search);
    const countryMatches =
      country === "" || row.country.toLowerCase() === country.toLowerCase();
    return nameMatches && countryMatches;
  });

  const handleFavoriteClick = name => {
    const isFavorite = fav.includes(name);
    if (isFavorite) {
      setFav(fav.filter(favorite => favorite !== name));
    } else {
      setFav([...fav, name]);
    }
  };

  const handleDeleteClick = name => {
    setFav(fav.filter(favorite => favorite !== name));
  };
  return (
    <section id="UIBlock">
      <article>
        <div id="searchBarBlock">
          <div>
            <label htmlFor="search">Search : </label>
            <input
              type="text"
              name="search"
              value={search}
              className="SearchFilter"
              autoFocus
              onChange={e => setSearch(e.target.value)}
              placeholder="Search university here"
            />
          </div>
          <div>
            <label htmlFor="country">Country : </label>
            <select
              name="country"
              id="countryId"
              value={country}
              onChange={e => setCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              <option value="United Kingdom"> United Kingdom</option>
              <option value="United States">United States</option>
              <option value="India">India</option>
              <option value="china">China</option>
              <option value="france">France</option>
            </select>
          </div>
        </div>
        <div>
          <table id="universityDetails">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>SL.NO.</th>
                <th>NAME</th>
                <th>COUNTRY</th>
                <th>WEBSITE</th>
                <th style={{ textAlign: "center" }}>FAVORITES</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((val, ind) => {
                return (
                  <tr>
                    <td style={{ textAlign: "center" }}>{ind + 1}</td>
                    <td>{val.name}</td>
                    <td>{val.country}</td>
                    <td>{val.web_pages}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        id="star_button"
                        style={{}}
                        className={fav.includes(val.name) ? "active" : ""}
                        onClick={() => handleFavoriteClick(val.name)}
                      >
                        &#10084;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="prev-btn"
            onClick={handlePrevPageClick}
            disabled={presentPage === 1}
          >
            <BsChevronLeft />
          </button>
          <button
            className="next-btn"
            onClick={handleNextPageClick}
            disabled={indexOfLastRow >= info.length}
          >
            <BsChevronRight />
          </button>
        </div>

        <ul id="fav_ul">
          {fav.length > 0 && <h1 id="FavTitle">Favourite</h1>}

          {fav.map((val, ind) => {
            return (
              <li id="fav_li" key={ind}>
                {val}
                <li>
                  <MdDelete
                    id="delete_ico"
                    onClick={() => handleDeleteClick(val)}
                  />
                </li>
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
};

export default TableData;
