import React, { useContext, useEffect, useState } from "react";

import "./Navbar.css";
import LinkWithIcon from "./LinkWithIcon";
import rocket from "../../assets/rocket.png";
import star from "../../assets/glowing-star.png";
import idButton from "../../assets/id-button.png";
import memo from "../../assets/memo.png";
import order from "../../assets/package.png";
import lock from "../../assets/locked.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import cartContext from "../../contexts/CartContext";
import { getSuggestionsAPI } from "../../services/productServices";

const Navbar = () => {
  const user = useContext(UserContext);
  const { cart } = useContext(cartContext);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/products?search=${search.trim()}`);
    }
    setSuggestions([]);
  };
  const handleKeyDown = (e) => {
    // console.log(e.key);
    if (selectedItem < suggestions.length) {
      if (e.key === "ArrowDown") {
        setSelectedItem((current) =>
          current === suggestions.length - 1 ? 0 : current + 1
        );
      } else if (e.key === "ArrowUp") {
        setSelectedItem((current) =>
          current === 0 ? suggestions.length - 1 : current - 1
        );
      } else if (e.key === "Enter" && selectedItem > -1) {
        const suggestion = setSuggestions[selectedItem];
        navigate(`/products?search=${suggestion.title}`);
        setSearch("");
        setSuggestions([]);
      }
    } else {
      setSelectedItem(-1);
    }
  };

  useEffect(() => {
    const delaySuggestion = setTimeout(() => {
      if (search.trim() !== "") {
        getSuggestionsAPI(search)
          .then((res) => setSuggestions(res.data))
          .catch((err) => console.log(err));
      } else {
        setSuggestions([]);
      }
    }, 1000);

    return () => clearTimeout(delaySuggestion);
  }, [search]);
  console.log(suggestions);

  return (
    <nav className="align_center navbar">
      <div className="align_center">
        <h1 className="navbar_heading">CartWish</h1>
        <form
          action=""
          className="align_center navbar_form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="navbar_search"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" className="search_button">
            Search
          </button>

          {suggestions.length > 0 && (
            <ul className="search_result">
              {suggestions.map((suggestion, index) => {
                return (
                  <li
                    className={
                      selectedItem === index
                        ? "search_suggestion_link active"
                        : "search_suggestion_link"
                    }
                    key={suggestion.__id}
                  >
                    <Link
                      to={`/products?search=${suggestion.title}`}
                      onClick={() => {
                        setSearch("");
                        setSuggestions([]);
                      }}
                    >
                      {suggestion.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </form>
      </div>
      <div className="align_center navbar_links">
        <LinkWithIcon title="Home" link="/" emoji={rocket} />
        <LinkWithIcon title="Products" link="/products" emoji={star} />
        {!user && (
          <>
            <LinkWithIcon title="Login" link="/login" emoji={idButton} />
            <LinkWithIcon title="Signup" link="/signup" emoji={memo} />
          </>
        )}
        {user && (
          <>
            <LinkWithIcon title="My orders" link="/myorders" emoji={order} />
            <LinkWithIcon title="Logout" link="/logout" emoji={lock} />

            <NavLink to="/cart" className="align_center">
              Cart <p className="align_center cart_counts">{cart.length}</p>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
