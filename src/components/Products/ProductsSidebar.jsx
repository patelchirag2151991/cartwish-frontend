import React from "react";

import "./ProductsSidebar.css";
import LinkWithIcon from "./../Navbar/LinkWithIcon";
import useData from "../../hooks/useData";

const ProductsSidebar = () => {
  const { data: categories, error } = useData("/category");

  return (
    <aside className="product_sidebar">
      <h2>Category</h2>

      {error && <em className="form_error">{error}</em>}
      {categories &&
        categories.map((category) => {
          return (
            <LinkWithIcon
              key={category._id}
              id={category._id}
              title={category.name}
              link={`/products?category=${category.name}`}
              emoji={`http://localhost:5000/category/${category.image}`}
              sidebar={true}
            />
          );
        })}
    </aside>
  );
};

export default ProductsSidebar;
