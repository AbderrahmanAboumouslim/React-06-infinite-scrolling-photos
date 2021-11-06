import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";

const API_KEY = `?client_id=${process.env.REACT_APP_API_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [showPage, setShowPage] = useState(0);
  const [query, setQuery] = useState("");

  const fetchPhotos = async () => {
    setLoading(true);
    let url;

    const urlPage = `&page=${showPage}`;
    const urlQuery = `&query=${query}`;

    if (query) {
      url = `${searchUrl}${API_KEY}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${API_KEY}${urlPage}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      setPhotos((oldPhotos) => {
        if (query && showPage === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPage]);

  useEffect(() => {
    const event = () => {
      if (
        window.scrollY + window.innerHeight >=
        document.body.scrollHeight - 10
      ) {
        setShowPage((oldShowPage) => oldShowPage + 1);
      }
    };
    window.addEventListener("scroll", event);
    return () => window.removeEventListener("scroll", event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const submitSearch = (e) => {
    e.preventDefault();
    setShowPage(1);
  };

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            className="form-input"
            placeholder="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={submitSearch}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) => {
            // console.log(photo);
            return <Photo key={photo.id} {...photo} />;
          })}
        </div>
        {loading && <h2 className="loading">loading...</h2>}
      </section>
    </main>
  );
}

export default App;
