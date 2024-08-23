import React from "react";
import HeroSection from "./HeroSection";
import iphone from "../../assets/iphone-14-pro.webp";
import mac from "../../assets/mac-system-cut.jfif";
import FeaturedProducts from "./FeaturedProducts";

const HomePage = () => {
  return (
    <div>
      {/*Hero section */}
      <HeroSection
        title="Buy iPhone 14 Pro"
        subtitle="Experience the power of the latest iPhone 14 with our most Pro camera ever."
        link="/products/66b769d0f617e3f10c98c0fc"
        image={iphone}
      />
      {/* Feature section */}
      <FeaturedProducts />
      {/* Hero section */}
      <HeroSection
        title="Build the ultimate setup"
        subtitle="You can add Studio Display and color-matched Magic accessories to your bag after you configure your Mac mini."
        link="/products/66b769d0f617e3f10c98c104"
        image={mac}
      />
    </div>
  );
};

export default HomePage;
