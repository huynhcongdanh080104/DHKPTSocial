import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import defaultImage from "../../assets/avt.jpg";

const ProductCard = ({ id, imageId, name, price, salesCount, rating }) => {
  const navigate = useNavigate();
  const fullStars = Math.floor(rating); // Số sao đầy
  const decimalPart = rating % 1; // Phần thập phân của rating
  const emptyStars = 5 - fullStars - (decimalPart > 0 ? 1 : 0); // Số sao trống

  const imageUrl = imageId ? `https://dhkptsocial.onrender.com/files/download/${imageId}` : defaultImage;

  const handleCardClick = () => {
    if (!id) {
        console.error("Product ID is undefined!");
        return;
    }
    navigate(`/product/${id}`);
};

  return (
    <article onClick={handleCardClick} className="cursor-pointer overflow-hidden grow shrink self-stretch py-px my-auto rounded-xl border border-solid border-zinc-300 min-w-[240px]">
      <img src={imageUrl} alt={name} className="object-contain w-full aspect-[1]" />
      <div className="flex overflow-hidden flex-col items-start pt-5 pb-3 pr-2 pl-4 bg-zinc-100">
        <h3 className="text-xl font-semibold tracking-tighter text-center">{name}</h3>

        {/* Hiển thị số sao */}
        <div className="flex gap-0.5 text-yellow-500">
          {/* Sao đầy */}
          {[...Array(fullStars)].map((_, index) => (
            <Star key={`full-${index}`} size={20} fill="currentColor" stroke="none" />
          ))}

          {/* Sao một phần */}
          {decimalPart > 0 && (
            <div className="relative w-5 h-5">
              {/* Sao rỗng nền */}
              <Star size={18} stroke="currentColor" fill="none" className="absolute top-0 left-0"
              style={{
                transform: "translateY(1px)"
              }} />

              {/* Sao vàng bị cắt bằng clip-path */}
              <Star
                size={18}
                fill="currentColor"
                stroke="none"
                className="absolute top-0 left-0"
                style={{
                  clipPath: `polygon(0 0, ${decimalPart * 100}% 0, ${decimalPart * 100}% 100%, 0% 100%)`,
                  transform: "translateY(1px)"
                }}
              />
            </div>
          )}

          {/* Sao rỗng */}
          {[...Array(emptyStars)].map((_, index) => (
            <Star key={`empty-${index}`} size={20} stroke="currentColor" fill="none" />
          ))}
        </div>

        <p className="text-xl tracking-tighter max-md:mt-10">{price}</p>
        <p className="self-end mt-5 text-base tracking-tighter max-md:mt-10">{salesCount}</p>
      </div>
    </article>
  );
};
export default ProductCard;
