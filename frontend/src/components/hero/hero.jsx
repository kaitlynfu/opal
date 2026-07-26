import './hero.css'
import { useState, useEffect } from 'react'
import { assets } from '../../assets/assets.js'
import { Link } from 'react-router-dom'

const Hero = () => {
    const [currentImage, setCurrenttImage] = useState(0)

    const heroImages = [
        assets.hero_img,
        assets.hero_img1,
        assets.hero_img2,
        assets.hero_img3
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrenttImage((prev) => (prev + 1) % heroImages.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [heroImages.length])

    return (
        <div className='hero' style={{backgroundImage: `url(${heroImages[currentImage]})`}}>
            <div className='hero-overlay'></div>
            <div className='hero-content'>
                <p className='hero-subtitle'>Summer Collection 2026</p>
                <h2>Hurry! 50% Off</h2>
                <h1>New Arrivals</h1>
                <p className='hero-desc'>
                    Discover soft neutrals, effortless silhouettes, and everyday pieces made for your wardrobe.
                </p>
                <Link to='/collection'>
                    <button className='hero-btn'>Shop Now</button>
                </Link>
            </div>

            <div className='hero-dots'>
                {heroImages.map((_, index) => (
                    <button key={index} className={currentImage === index ? 'active-dot' : ''} onClick={() => setCurrenttImage(index)}></button>
                ))}
            </div>
        </div>
    )
}

export default Hero