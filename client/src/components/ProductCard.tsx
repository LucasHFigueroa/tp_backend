import { useState } from 'react';
import '../styles/components/ProductCard.css'

interface ProductProps {
  name: string;
  price: number;
  image: string;
  video?: string;
  tags: string[];
  isAvailable: boolean;
  onAddToCart?: () => void;
}

const ProductCard = ({ name, price, image, video, tags, isAvailable, onAddToCart }: ProductProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Manejo para móviles (click) y escritorio (hover)
  const handleInteractionStart = () => setIsHovered(true);
  const handleInteractionEnd = () => setIsHovered(false);

  return (
    <div 
      className={`card-container ${!isAvailable ? 'unavailable' : ''}`}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart} // Soporte táctil
      onTouchEnd={handleInteractionEnd}
    >
      <div className="media-frame">
        {/* Etiquetas flotantes (ej: Happy Hour) */}
        <div className="tags-container">
          {tags.map((tag, index) => (
            <span key={index} className="tag-badge">{tag}</span>
          ))}
        </div>

        {/* Lógica: Si hay hover Y video, muestra video. Si no, imagen */}
        {isHovered && video ? (
          <video 
            src={video} 
            autoPlay 
            muted 
            loop 
            className="product-media fade-in" 
          />
        ) : (
          <img 
            src={image || "https://via.placeholder.com/300?text=Sin+Imagen"} 
            alt={name} 
            className="product-media fade-in" 
          />
        )}
      </div>

      <div className="card-info">
        <div className="header-row">
          <h3>{name}</h3>
          <span className="price">${price}</span>
        </div>
        
        {!isAvailable && <p className="no-stock-text">No disponible por el momento</p>}

        {isAvailable && (
          <button className="add-btn" onClick={onAddToCart}>
            + Agregar
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;