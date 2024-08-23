import React, { useEffect } from "react";
import "./FeaturedProducts.css";
import ProductCard from "../Products/ProductCard";
import useData from "./../../hooks/useData";
import ProductsCardSkeleton from "../Products/ProductsCardSkeleton";
import { getUser } from "../../services/userServices";

const FeaturedProducts = () => {
  const { data, error, isLoading } = useData("/products/featured");
  console.log(data);

  const skeletons = [1, 2, 3];
  return (
    <section className="featured_products">
      <h2>Featured Products</h2>

      <div className="align_center featured_products_list">
        {error && <em className="form_error">{error}</em>}
        {isLoading
          ? skeletons.map((n) => <ProductsCardSkeleton key={n} />)
          : data &&
            data.map((product) => {
              return <ProductCard key={product._id} product={product} />;
            })}
      </div>
    </section>
  );
};

export default FeaturedProducts;
