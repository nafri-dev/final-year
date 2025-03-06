


import  Carousel  from "../components/Carousel";
import Categories from "../components/Categories";

import Footer from "../components/Footer";
import Header from "../components/Header";

import LatestTees from "../components/LatestTees";
import Pants from "../components/Pants";
import Sarees from "../components/Sarees";



const Home = () => {
  return (
    <div>
      <Header />
     
      <Carousel />
      <LatestTees />
      <Sarees/>
    
    
      <Categories />
     <Pants />
      
      <Footer />
    </div>
  );
};

export default Home;
