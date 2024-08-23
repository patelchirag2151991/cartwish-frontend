import React, { useEffect, useState } from "react";

import "./ProductsList.css";
import ProductCard from "./ProductCard";
import useData from "../../hooks/useData";
import ProductsCardSkeleton from "./ProductsCardSkeleton";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Common/Pagination";

const ProductsList = () => {
  const [sortBy, setSortBy] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const page = searchParams.get("page");
  const searchQuery = searchParams.get("search");
  // const category = "Laptops";
  const { data, error, isLoading } = useData(
    "/products",
    {
      params: {
        search: searchQuery,
        category: category,
        page: page,
      },
    },
    [searchQuery, category, page]
  );
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8];

  const handlePageChange = (page) => {
    const currentParams = Object.fromEntries([...searchParams]);
    console.log(currentParams);
    setSearchParams({ ...currentParams, page: page });
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const { scrollTop, clientHeight, scrollHeight } =
  //       document.documentElement;

  //     // console.log("Scroll top", scrollTop);
  //     // console.log("Client height", clientHeight);
  //     // console.log("Scroll height", scrollHeight);
  //     if (scrollTop + clientHeight >= scrollHeight - 1) {
  //       console.log("Reached bottom!");
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    if (data && data.products) {
      const products = [...data.products];

      if (sortBy === "price desc") {
        setSortedProducts(products.sort((a, b) => b.price - a.price));
      } else if (sortBy === "price asc") {
        setSortedProducts(products.sort((a, b) => a.price - b.price));
      } else if (sortBy === "rate desc") {
        setSortedProducts(
          products.sort((a, b) => b.reviews.rate - a.reviews.rate)
        );
      } else if (sortBy === "rate asc") {
        setSortedProducts(
          products.sort((a, b) => a.reviews.rate - b.reviews.rate)
        );
      } else {
        setSortedProducts(products);
      }
    }
  }, [sortBy, data]);

  return (
    <section className="product_list_section">
      <header className="align_center products_list_header">
        <h2>Products</h2>
        <select
          name="sort"
          id=""
          className="products_sorting"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Relevance</option>
          <option value="price desc">Price High to Low</option>
          <option value="price asc">Price Low to High</option>
          <option value="rate desc">Rate High to Low</option>
          <option value="rate asc">Rate Low to High</option>
        </select>
      </header>

      <div className="products_list">
        {error && <em className="form_error">{error}</em>}
        {isLoading
          ? skeletons.map((n) => <ProductsCardSkeleton key={n} />)
          : data?.products &&
            sortedProducts.map((product) => {
              return <ProductCard key={product._id} product={product} />;
            })}
      </div>

      {data && (
        <Pagination
          totalPosts={data?.totalProducts}
          postsPerPage={8}
          onClick={handlePageChange}
          currentPage={page}
        />
      )}
    </section>
  );
};

export default ProductsList;
