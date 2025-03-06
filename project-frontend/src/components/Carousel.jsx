import { useState } from 'react'
import { Link } from 'react-router-dom'

const  Carousel= () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const slides = ["/assets/ban2.webp",  "/assets/ban3.webp","/assets/ban4.webp"]

  return (
    
    <div className="relative h-[150px] lg:h-[500px]">
         
      {slides.map((slide, index) => (
        <>
     <Link to="/products">
        <div key={index} className={`${index === activeSlide ? 'block' : 'hidden'}`}>
          <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-[150px] lg:h-[500px]" />
        </div>
        </Link>
        </>
      ))}
      <button onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-opacity-50 text-white p-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
</svg>

      </button>
      <button onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-opacity-50 text-white p-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
</svg>



      </button>
    </div>
   
  )
}
export default Carousel 





/*export const Carousel = () => {
  return (
    <div>
        <div className="container3">
<div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"
      aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
      aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
      aria-label="Slide 3"></button>
  </div>
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src="./assets/phone(a).png" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="./assets/phone(a).png" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="./assets/phone(a).png" className="d-block w-100" alt="..."/>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
    data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
    data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
</div>
    </div>
  )
}

*/
