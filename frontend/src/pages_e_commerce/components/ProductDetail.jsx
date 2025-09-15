import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import { Star } from "lucide-react";
import defaultImage from "../../../src/assets/avt.jpg";
import Cookies from "js-cookie";
import ProductReview from "../components/ProductReview";
import ChatBox from "../components/ChatBox";
const ProductDetail = () => {
    const { id } = useParams();
    console.log("ProductDetail ID from URL:", id);
    
    const [showChat, setShowChat] = useState(false);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null); // ✅ Di chuyển lên đây
    const [storeData, setStoreData] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const navigate = useNavigate();
    const handleSelectAttribute = (attrName, attributeValue) => {
        // Lưu giá trị được chọn vào state
        setSelectedAttributes((prev) => {
            // Tạo một bản sao của đối tượng prev
            const updatedAttributes = [...prev];
            
            // Kiểm tra xem thuộc tính đã tồn tại trong mảng chưa
            const existingIndex = updatedAttributes.findIndex(attr => attr.name === attrName);
            
            // Nếu đã tồn tại thì cập nhật, nếu chưa thì thêm mới
            if (existingIndex !== -1) {
                updatedAttributes[existingIndex] = {
                    name: attrName,
                    values: {
                        attributeName: attributeValue.attributeName,
                        attributeImage: attributeValue.attributeImage,
                        priceAttribute: attributeValue.priceAttribute || 0
                    }
                };
            } else {
                updatedAttributes.push({
                    name: attrName,
                    values: {
                        attributeName: attributeValue.attributeName,
                        attributeImage: attributeValue.attributeImage,
                        priceAttribute: attributeValue.priceAttribute || 0
                    }
                });
            }
            
            return updatedAttributes;
        });
        
        // Cập nhật giá sản phẩm dựa trên các thuộc tính đã chọn
        // updateProductPrice();
    };
    // const updateProductPrice = () => {
    //     // Giá cơ bản của sản phẩm
    //     let basePrice = product.unitPrice;
        
    //     // Tính tổng phụ phí từ các thuộc tính đã chọn
    //     let attributesPrice = 0;
    //     Object.values(selectedAttributes).forEach(attr => {
    //         attributesPrice += attr.priceAttribute || 0;
    //     });
        
    //     // Cập nhật giá sản phẩm
    //     setUnitPrice(basePrice + attributesPrice);
    // };
    const getAvailableStock = () => {
        if (!attributes || attributes.length === 0) return 0;

        const firstGroup = attributes[0];
        const totalInFirstGroup = firstGroup.values.reduce(
            (sum, val) => sum + val.stockQuantity,
            0
        );

        // Kiểm tra các nhóm khác có tổng trùng khớp không
        const allMatch = attributes.every((attr) => {
            const total = attr.values.reduce(
                (sum, val) => sum + val.stockQuantity,
                0
            );
            return total === totalInFirstGroup;
        });

        return allMatch ? totalInFirstGroup : 0;
    };
    const handleAddToCart = async () => {
        try {
            let userId = Cookies.get("customerId"); 
            if (!userId) {
                alert("Vui lòng đăng nhập!");
                return;
            }
            axios.get(
                `https://dhkshop.onrender.com/cart/user/${userId}`
            )
            .then((res) => {
                console.log("🟢 Đang dùng cartId:", res.data._id);
                let attributesPrice = 0;
                selectedAttributes.forEach(item => attributesPrice += item.values.priceAttribute)
                const cartItem = {
                    userId,
                    cartId: res.data._id,
                    productId: product._id,
                    name: product.name,
                    unitPrice: product.salePrice + attributesPrice || product.price + attributesPrice,
                    quantity,
                    attributes: selectedAttributes,
                    image: selectedImage,
                    store: product.store
                };
    
            console.log("📤 Gửi dữ liệu cartItem:", cartItem);
    
            axios.post("https://dhkshop.onrender.com/cart/add", cartItem)
            .then((response) => {
                console.log("📩 Server phản hồi:", response.data);
    
                window.dispatchEvent(new Event("updateCart"));
                alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
            });
            })
            .catch((error) => {
                console.log("🚀 Cart chưa tồn tại, tạo mới...");
                axios.post("https://dhkshop.onrender.com/cart/create", { userId })
            });
        } catch (error) {
            console.error("⛔ Lỗi khi thêm vào giỏ hàng:", error.response?.data || error);
        }
    };
    

    useEffect(() => {
        if (product?.store?._id) {
            axios
                .get(
                    `https://dhkshop.onrender.com/product/store/${product.store._id}/rating`
                )
                .then((response) => {
                    setStoreData(response.data);
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy đánh giá cửa hàng:", error);
                });
        }
    }, [product]);

    useEffect(() => {
        axios
            .get(`https://dhkshop.onrender.com/product/${id}`)
            .then((response) => {
                setProduct(response.data);
                if (response.data.images && response.data.images.length > 0) {
                    setSelectedImage(response.data.images[0]); // ✅ Đặt ảnh đầu tiên khi có dữ liệu
                }
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
            });
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const {
        name,
        price,
        salePrice,
        description,
        images,
        soldQuantity,
        rating,
        attributes,
        store,
    } = product;

    return (
        <main className="flex flex-col justify-center items-center">
            <Header />
            <section className="max-w-full w-[800px] mt-[50px]">
                <div className="max-md:mr-2 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col">
                        {/* Image Gallery Section */}
                        <article className="w-[45%] max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
                                {selectedImage && (
                                    <img
                                        src={
                                            `https://dhkptsocial.onrender.com/files/download/${selectedImage}` ||
                                            defaultImage
                                        }
                                        alt="Product main"
                                        className="object-contain w-full rounded-2xl border-2 border-solid border-zinc-300 aspect-[1] max-md:max-w-full"
                                    />
                                )}
                                <div className="flex gap-1.5 self-start mt-6">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(image)
                                            }
                                            className={`rounded-md ${
                                                selectedImage === image
                                                    ? "border-2 border-blue-500"
                                                    : "border-2 border-solid border-zinc-300"
                                            }`}
                                        >
                                            <img
                                                src={`https://dhkptsocial.onrender.com/files/download/${image}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="object-contain shrink-0 rounded-md max-w-full aspect-[1] w-[65px]"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </article>

                        {/* Product Info Section */}
                        <article className="ml-5 w-[55%] max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col items-start mt-1.5 w-full max-md:mt-10 max-md:max-w-full">
                                <h1 className="self-stretch text-2xl font-medium tracking-tighter text-start text-black max-md:mr-2.5 max-md:max-w-full">
                                    {name}
                                </h1>

                                <div className="flex gap-3 justify-between mt-4 max-w-full text-base font-medium tracking-tighter text-center w-[320px]">
                                    <div className="flex items-center gap-2">
                                        <span className="text-black">
                                            {rating.toFixed(1)}
                                        </span>
                                        <div className="flex gap-0.5 text-yellow-500">
                                            {/* Sao đầy */}
                                            {[...Array(Math.floor(rating))].map(
                                                (_, index) => (
                                                    <Star
                                                        key={`full-${index}`}
                                                        size={16}
                                                        fill="currentColor"
                                                        stroke="none"
                                                    />
                                                )
                                            )}

                                            {/* Sao lấp một phần */}
                                            {rating % 1 > 0 && (
                                                <div className="relative w-4 h-4">
                                                    {/* Sao rỗng nền */}
                                                    <Star
                                                        size={14}
                                                        stroke="currentColor"
                                                        fill="none"
                                                        className="absolute"
                                                        style={{
                                                            transform:
                                                                "translateY(1px)",
                                                        }}
                                                    />
                                                    {/* Sao lấp một phần */}
                                                    <Star
                                                        size={14}
                                                        fill="currentColor"
                                                        stroke="none"
                                                        className="absolute"
                                                        style={{
                                                            clipPath: `polygon(0 0, ${
                                                                (rating % 1) *
                                                                100
                                                            }% 0, ${
                                                                (rating % 1) *
                                                                100
                                                            }% 100%, 0% 100%)`,
                                                            transform:
                                                                "translateY(1px)",
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Sao rỗng */}
                                            {[
                                                ...Array(5 - Math.ceil(rating)),
                                            ].map((_, index) => (
                                                <Star
                                                    key={`empty-${index}`}
                                                    size={16}
                                                    stroke="currentColor"
                                                    fill="none"
                                                />
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="grow text-neutral-500">
                                                <span className="text-black">
                                                    10{" "}
                                                </span>
                                                <span className="font-normal">
                                                    Đánh giá
                                                </span>
                                            </p>
                                            <p className="text-black basis-auto">
                                                {soldQuantity}{" "}
                                                <span className="font-normal text-[#6D6D6D]">
                                                    Đã bán
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-3 text-xl tracking-tighter text-center text-black font-semibold">
                                    {salePrice ? (
                                        <>
                                            <span className="text-red-500 font-bold mr-2">
                                                ₫{salePrice}
                                            </span>
                                            <span className="text-gray-500 line-through">
                                                ₫{price}
                                            </span>
                                        </>
                                    ) : (
                                        <span>₫{price}</span>
                                    )}
                                </p>

                                <span className="px-2.5 pt-1 pb-1.5 mt-4 text-base tracking-tighter text-center text-black bg-green-300 rounded-[99px] font-semibold">
                                    Còn hàng
                                </span>

                                <p className="self-stretch px-0.5 mt-3 text-base tracking-tighter text-black max-md:max-w-full">
                                    {description}
                                </p>

                                {/* Attribute Selector */}
                                {attributes?.length > 0 && (
                                    <div className="flex flex-col gap-3 mt-6 max-w-full">
                                        {attributes.map((attr, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-5 items-center"
                                            >
                                                <label className="tracking-tighter font-semibold">
                                                    {attr.name}:
                                                </label>
                                                {attr.values?.length > 0 ? (
                                                    <div className="flex gap-2">
                                                        {attr.values.map((value, vIndex) => (
                                                            <button
                                                            key={vIndex}
                                                            className={`px-2 py-1 border border-gray-300 rounded-md text-sm ${
                                                                selectedAttributes.some(
                                                                    selectedAttr => 
                                                                        selectedAttr.name === attr.name && 
                                                                        selectedAttr.values.attributeName === value.attributeName
                                                                )
                                                                    ? "bg-indigo-500 text-white"
                                                                    : "bg-white text-black"
                                                            }`}
                                                            onClick={() =>
                                                                handleSelectAttribute(
                                                                    attr.name,
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            {value.attributeName} 
                                                            {value.priceAttribute > 0 && ` (+${value.priceAttribute})`}
                                                        </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        Không có dữ liệu
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Quantity and Add to Cart */}
                                <div className="flex gap-5 justify-start mt-7 max-w-full text-center w-[463px] max-md:mt-10">
                                    {/* Nút giảm số lượng */}
                                    <div className="flex gap-1 justify-center items-center my-auto text-lg tracking-tighter text-black whitespace-nowrap">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1)
                                                )
                                            }
                                            aria-label="Decrease quantity"
                                        >
                                            <img
                                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7c617f4a36c66b139e83f8f20bc5b1fc7b7989efa44a0b53b59f89b750b0cf4?placeholderIfAbsent=true"
                                                alt="Decrease"
                                                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[35px]"
                                            />
                                        </button>

                                        <span className="self-stretch my-auto w-[50px]">
                                            {quantity}
                                        </span>

                                        {/* Nút tăng số lượng */}
                                        <button
                                            onClick={() =>
                                                setQuantity(Math.min(getAvailableStock(), quantity + 1))
                                            }
                                            aria-label="Increase quantity"
                                        >
                                            <img
                                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8f3c0834f0f9da822a63b7176ff817ffe5e81b4f5af43baee9331e48a8e55af3?placeholderIfAbsent=true"
                                                alt="Increase"
                                                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[35px]"
                                            />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-600 flex items-center">
                                        {getAvailableStock()} sản phẩm có
                                        sẵn
                                    </span>   
                                    {/* Nút thêm vào giỏ hàng */}
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex overflow-hidden gap-1 px-2 py-1 text-base font-medium text-white bg-rose-500 rounded-[99px] max-md:px-3"
                                    >
                                        <img
                                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5ef7fed0dd296b799a7a26c2effd030907ed037cbea48dcb508843da1b07d301?placeholderIfAbsent=true"
                                            alt="Cart"
                                            className="object-contain shrink-0 w-5 aspect-square"
                                        />
                                        <span className="my-auto">
                                            Thêm vào giỏ
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
                <ProductReview productId={product._id} />
                {store && (
                    <section className="overflow-hidden px-4 py-6 mt-5 w-full rounded border border-zinc-300">
                        <div className="flex gap-5 max-md:flex-col">
                            <div className="w-[41%] max-md:ml-0 max-md:w-full">
                                <div className="flex grow gap-3 text-center">
                                    <img
                                        src={
                                            `https://dhkptsocial.onrender.com/files/download/${store.logo}` ||
                                            "https://via.placeholder.com/55"
                                        }
                                        alt="Shop profile"
                                        className="object-contain shrink-0 my-auto aspect-square rounded-full border border-solid border-zinc-300 w-[55px] h-[55px]"
                                    />
                                    <div className="flex flex-col grow shrink-0 self-start basis-0 w-fit">
                                        <h2 className="text-xl text-black font-semibold text-start ">
                                            {store.name || "Shop"}
                                        </h2>
                                        <div className="flex gap-3 mt-2 text-xs font-semibold">
                                            <button className="px-3 py-1 text-white bg-purple-800 rounded">
                                                💬 Chat ngay
                                            </button>
                                            <button className="px-3 py-1 text-black bg-white border border-black rounded" onClick={() => navigate(`/e-commerce/seller/view-store/${store._id}`)}>
                                                🏪 Xem shop
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex ml-5 w-[59%] max-md:ml-0 max-md:w-full items-center justify-end">
                                <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-black">
                                    <p>
                                        ⭐ Đánh giá:{" "}
                                        {storeData?.storeRating || "Chưa có"}
                                    </p>
                                    <p>
                                        📦 Sản phẩm:{" "}
                                        {storeData?.totalProductCount || "N/A"}
                                    </p>
                                    <p>
                                        📅 Tham gia:{" "}
                                        {store.publishDate
                                            ? new Date(
                                                  store.publishDate
                                              ).getFullYear()
                                            : "N/A"}
                                    </p>
                                    <p>
                                        👥 Người theo dõi:{" "}
                                        {store.follower?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </section>
            {showChat && (
                <ChatBox
                    storeId={store._id}
                    storeName={store.name}
                    onClose={() => setShowChat(false)}
                />
            )}
        </main>
    );
};

export default ProductDetail;
