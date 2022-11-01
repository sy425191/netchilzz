import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Card from "../../components/card/Card";
import { searchContext } from "../../App";
import SearchCard from "../../components/card/SearchCard";

const Search = () => {
  const search = useContext(searchContext);
  const [searchSort, setSearchSort] = useState(""); // Search sort
  const [searchFilter, setSearchFilter] = useState("all"); // Search filter
  const [searchResults, setSearchResults] = useState([]); // Search results

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const res = await axios.post(
          "/media/search",
          {
            query: search.searchQuery,
            sort: searchSort,
            filter: searchFilter,
          },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );

        setSearchResults(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSearchResults();
  }, [search.searchQuery, searchSort, searchFilter]);

  return (
    <Layout>
      {/* sort by and filter */}
      <div className="d-flex justify-content-between my-1 d-none d-md-flex">
        <select
          className="form-select"
          aria-label="Default select example"
          style={{ width: "180px" }}
          onChange={(e) => setSearchSort(e.target.value)}
        >
          <option selected style={{ display: "none" }}>
            Sort by
          </option>
          <option value="NEWEST">Newest</option>
          <option value="OLDEST">Oldest</option>
          <option value="MOST_STREMED">Most Streamed</option>
          <option value="MOST_UPVOTE">Most Upvotes</option>
        </select>
        <select
          className="form-select"
          aria-label="Default select example"
          style={{ width: "180px" }}
          onChange={(e) => setSearchFilter(e.target.value)}
        >
          <option value="all" selected>
            All
          </option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      <div className="container mt-3">
        {
          // search results
          searchResults.map((media) => (
            <SearchCard key={media._id} item={media} />
          ))
        }
      </div>
      {
        // if no search results
        searchResults.length === 0 && (
          <div className="d-flex justify-content-center align-items-center" style={{height:"70vh"}}>
            <h2
              style={{
                color: "white",
                background: "rgba(0,0,0,0.5)",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              No results found
            </h2>
          </div>
        )
      }
    </Layout>
  );
};

export default Search;
