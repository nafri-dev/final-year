"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Carousel = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const slides = [
    {
      image: "/assets/ban2.webp",
      title: "Summer Collection",
      subtitle: "Discover the latest trends for the season",
      cta: "Shop Now",
      link: "/products",
    },
    {
      image: "/assets/ban3.webp",
      title: "New Arrivals",
      subtitle: "Be the first to wear our newest styles",
      cta: "Explore",
      link: "/products",
    },
    {
      image: "/assets/ban4.webp",
      title: "Special Offers",
      subtitle: "Limited time discounts on selected items",
      cta: "View Deals",
      link: "/products",
    },
  ]

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setActiveSlide((prev) => (prev + 1) % slides.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [isTransitioning, slides.length])

  const prevSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [isTransitioning, slides.length])

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <div className="relative overflow-hidden">
      {/* Slides */}
      <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[550px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-lg">
                  <h2
                    className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 opacity-0 animate-fadeIn"
                    style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                  >
                    {slide.title}
                  </h2>
                  <p
                    className="text-white/90 text-sm md:text-lg mb-4 md:mb-6 opacity-0 animate-fadeIn"
                    style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
                  >
                    {slide.subtitle}
                  </p>
                  <Link
                    to={slide.link}
                    className="inline-block bg-white text-black px-6 py-2 md:py-3 rounded-full font-medium hover:bg-yellow-400 transition-colors opacity-0 animate-fadeIn"
                    style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === activeSlide ? "bg-white w-4 md:w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel

