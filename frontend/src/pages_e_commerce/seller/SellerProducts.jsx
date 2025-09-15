// SellerProducts.jsx
import React, { useEffect, useRef, useState } from 'react'
import SellerHomeNav from '../components/SellerHomeNav'
import { FaSearch, FaPlus, FaMinus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaFilter, FaSortAmountDown, FaBox, FaShippingFast, FaStar, FaImage, FaCheck, FaTimes } from 'react-icons/fa'
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'js-cookie';
import io from "socket.io-client";
import ProductUpdater from '../../design_patterns/TemplateMethodPattern/ProductUpdater';
import ProductUploader from '../../design_patterns/TemplateMethodPattern/ProductUploader';

const socket = io("https://dhkshop.onrender.com");
const SellerProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isAddAttr, setIsAddAttr] = useState(false);
  const [isAddValue, setIsAddValue] = useState(false);

  const [products, setProduct] = useState([]);
  const [categories, setCategory] = useState(['all']);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const [listCategory, setListCategory] = useState([{name: 'all'}]);
  
  const [nameProduct, setNameProduct] = useState("");
  const [description, setDescription] = useState("");
  const [categoryAdd, setCategoryAdd] = useState([]);
  const [stockQuantity, setStockQuantity] = useState(10);
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [isSale, setIsSale] = useState(false);
  const [images, setImages] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState("");

  const [listMedia, setListMedia] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const imgRef = useRef(null);

  const [nameValue, setNameValue] = useState("");
  const [stockValue, setStockValue] = useState(1);
  const [valuePrice, setValuePrice] = useState("");
  const [imageValue, setImageValue] = useState("");
  const [nameAttribute, setNameAttribute] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const areAllAttributeTotalsEqual = (attributesArray) => {
    if (!attributesArray || attributesArray.length === 0) {
      return true;
    }
    
    // Tính tổng số lượng tồn kho cho mỗi biến thể
    const attributeTotals = attributesArray.map(attribute => {
      let total = 0;
      attribute.values.forEach(value => {
        total += value.stockQuantity;
      });
      return total;
    });
    
    // Nếu chỉ có 1 biến thể hoặc không có biến thể nào
    if (attributeTotals.length <= 1) {
      return true;
    }
    
    // Kiểm tra xem tất cả các tổng có bằng nhau không
    const firstTotal = attributeTotals[0];
    return attributeTotals.every(total => total === firstTotal);
  };

  const handleStockChange = (attributeIndex, valueIndex, newValue) => {
    // Tạo bản sao để không thay đổi trực tiếp state
    const updatedAttributes = [...attributes];
    
    // Chuyển đổi giá trị thành số và đảm bảo là số dương
    const newStock = parseInt(newValue, 10);
    if (!isNaN(newStock) && newStock >= 0) {
      updatedAttributes[attributeIndex].values[valueIndex].stockQuantity = newStock;
      setAttributes(updatedAttributes);
      
      // Cập nhật tổng số lượng tồn kho
      updateTotalStockQuantity(updatedAttributes);
    }
  };
  
  // Xử lý khi tăng số lượng
  const handleIncreaseStock = (attributeIndex, valueIndex) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[attributeIndex].values[valueIndex].stockQuantity += 1;
    setAttributes(updatedAttributes);
    
    // Cập nhật tổng số lượng tồn kho
    updateTotalStockQuantity(updatedAttributes);
  };
  
  // Xử lý khi giảm số lượng
  const handleDecreaseStock = (attributeIndex, valueIndex) => {
    const updatedAttributes = [...attributes];
    const currentStock = updatedAttributes[attributeIndex].values[valueIndex].stockQuantity;
    if (currentStock > 0) {
      updatedAttributes[attributeIndex].values[valueIndex].stockQuantity -= 1;
      setAttributes(updatedAttributes);
      
      // Cập nhật tổng số lượng tồn kho
      updateTotalStockQuantity(updatedAttributes);
    }
  };
  
  // Hàm tính tổng số lượng tồn kho từ tất cả các biến thể
  const updateTotalStockQuantity = (attributesArray) => {
    let totalStock = 0;
    let totalVariants = 0;
    
    attributesArray.forEach(attribute => {
      attribute.values.forEach(value => {
        totalStock += value.stockQuantity;
      });
      totalVariants++;
    });
    
    // Tính trung bình - nếu không có biến thể nào thì giữ nguyên stockQuantity
    if (totalVariants > 0) {
      setStockQuantity(Math.round(totalStock / totalVariants));
    }
  };

  const resetState = () => {
    setNameProduct("");
    setDescription("");
    setStockQuantity(10);
    setPrice(0);
    setSalePrice(0);
    setIsSale(false);
    setIsAddAttr(false);
    setImages([]);
    setAttributes([]);
    setNewAttribute("");
    setNameValue("");
    setStockValue(1);
    setValuePrice("");
    setImageValue("");
    setNameAttribute("");
    setSelectedProduct(null);
    setIsAddValue(false);
    setShowModal(false);
  }
  const prepareUpdate = (product) => {
    setNameProduct(product.name);
    setDescription(product.description);
    setStockQuantity(product.totalStockQuantity);
    setPrice(product.price);
    setSalePrice(product.salePrice);
    setAttributes(product.attributes);
    setIsSale(product.isSale);
  }
  const handleAddValue = () => {

    if(nameAttribute === ""){
      enqueueSnackbar('Nhập tên biến thể', { variant: 'warning' });
    }
    else{
      if(nameValue === "" || imageValue === "" || valuePrice === ""){
        enqueueSnackbar('Thiếu thông tin', { variant: 'warning' });
      }
      else{
        const isDuplicated = newAttribute.values.filter(item => item.attributeName === nameValue);
        if(isDuplicated.length === 0){
          const newValue = {
            attributeName: nameValue,
            stockQuantity: stockValue,
            attributeImage: imageValue,
            priceAttribute: valuePrice,
          };
          newAttribute.values.push(newValue);
          setIsAddValue(false);
          setNameValue("");
          setStockValue(1);
          setValuePrice(0);
          setImageValue("");
        }
        else{
          enqueueSnackbar('Giá trị bị trùng', { variant: 'warning' });
        }
      }
    }
  }
  const handleAddAttribute = () => {

    if(nameAttribute === ""){
      enqueueSnackbar('Vui lòng nhập tên biến thể', { variant: 'warning' });
    }
    else if(newAttribute.values.length === 0){
      enqueueSnackbar('Thêm giá trị cho biến thể', { variant: 'warning' });
    }
    else{
      const isDuplicated = attributes.filter(item => item.name === nameAttribute);
      if(isDuplicated.length === 0){
        const totalStock = newAttribute.values.reduce((sum, item) => sum + (Number(item.stockQuantity) || 0), 0);
        if(stockQuantity === 0){
          setStockQuantity(prevQuantity => (prevQuantity + totalStock));
        }
        else if(stockQuantity !== 0 && totalStock === stockQuantity){
          setStockQuantity(prevQuantity => (prevQuantity + totalStock)/2);
        }
        else{
          enqueueSnackbar('Số lượng biến thể không hợp lệ', { variant: 'warning' });
          return;
        }
        const updatedAttribute = { ...newAttribute, name: nameAttribute };
        attributes.push(updatedAttribute);
        attributes.map((attribute)=> (
          console.log(attribute)
        ))
        setIsAddAttr(false);
        setNameAttribute("");
      }
      else{
        enqueueSnackbar('Biến thể bị trùng', { variant: 'warning' });
      }
    }
  }
  const handleOpenAttribute = () => {
    if(attributes.length === 0 && !isAddAttr){
      const newAttr = {
        name: "",
        values: [], 
      }
      setNewAttribute(newAttr);
      setIsAddAttr(true);
      setIsAddValue(true);
      setStockQuantity(0);
    }
    else if(attributes.length === 0 && isAddAttr){
      setNewAttribute("");
      setIsAddAttr(false);
      setIsAddValue(false);
      setStockQuantity(10);
    }
    else if (!isAddAttr){
      const newAttr = {
        name: "",
        values: [], 
      }
      setNewAttribute(newAttr);
      setIsAddAttr(true);
      setIsAddValue(true);
    }
    else{
      setNewAttribute("");
      setIsAddAttr(false);
      setIsAddValue(false);
    }
  }
  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  const filteredProducts = products.filter(product => 
    (filterCategory === 'all' || product.category[0].name === filterCategory) &&
    (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handleFileChange = (e) => {
    setImages(e.target.files);
    const fileArray = e.target.files;

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('File reading has failed'));
            reader.readAsDataURL(file);
        });
    };

    const loadMedia = async () => {
        const mediaPromises = [];

        for (let i = 0; i < fileArray.length; i++) {
            if (fileArray[i]) {
                const mediaType = fileArray[i].type.startsWith('image/') ? 'image' : 'video';
                mediaPromises.push(
                    readFileAsDataURL(fileArray[i]).then((dataURL) => ({
                        type: mediaType,
                        url: dataURL,
                    }))
                );
            }
        }

        const media = await Promise.all(mediaPromises); // Đợi tất cả media (ảnh/video) được đọc xong
        setListMedia(media); // Lưu media vào state
    };

    loadMedia();
  };
  const handleUpload = async () => {
    try {
      // Mảng chứa tất cả file cần upload (ảnh sản phẩm và ảnh thuộc tính)
      const allImages = [...images];
      const attributeImagesMap = new Map();
      
      // Thêm attributeImage vào danh sách upload
      attributes.forEach((attr, attrIndex) => {
        attr.values.forEach((value, valueIndex) => {
          if (value.attributeImage && typeof value.attributeImage === 'object') {
            // Lưu vị trí của file hình ảnh để cập nhật sau khi upload
            attributeImagesMap.set(allImages.length, {
              attrIndex,
              valueIndex
            });
            // Thêm file vào danh sách cần upload
            allImages.push(value.attributeImage);
          }
        });
      });
  
      const uploadedImageIds = [];
  
      // Upload tất cả hình ảnh lên server
      for (let i = 0; i < allImages.length; i++) {
        const formData = new FormData();
        formData.append('file', allImages[i]);
        
        try {
          const response = await axios.post('https://dhkshop.onrender.com/files/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          const fileId = response.data.file._id;
          uploadedImageIds.push(fileId);
          
          // Nếu đây là ảnh thuộc tính, cập nhật ID vào object thuộc tính
          if (attributeImagesMap.has(i)) {
            const { attrIndex, valueIndex } = attributeImagesMap.get(i);
            attributes[attrIndex].values[valueIndex].attributeImage = fileId;
          }
          
          console.log('File uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
          enqueueSnackbar('Upload hình ảnh thất bại', { variant: 'error' });
          return; // Dừng quá trình nếu có lỗi
        }
      }
  
      // Tách IDs ảnh sản phẩm từ tổng số ảnh đã upload
      const productImageIds = uploadedImageIds.slice(0, images.length);
      
      // Tạo payload cho API tạo sản phẩm
      const data = {
        name: nameProduct,
        description: description,
        category: categoryAdd,
        totalStockQuantity: stockQuantity,
        price: price,
        store: Cookies.get('store'),
        images: productImageIds,
        isSale: isSale
      };
      
      // Thêm attributes đã được cập nhật vào payload
      if (attributes.length > 0) {
        data.attributes = attributes;
      }
      
      if (salePrice > 0) {
        data.salePrice = salePrice;
      }
      
      try {
        const response = await axios.post('https://dhkshop.onrender.com/product', data);
        console.log(response.data);
        enqueueSnackbar('Thêm sản phẩm thành công', { variant: 'success' });
        
        // Reset state
        setNameProduct("");
        setDescription("");
        setStockQuantity(10);
        setPrice(0);
        setSalePrice(0);
        setAttributes([]);
        setIsSale(false);
        setListMedia([]);
        setImages([]);
        setisOpenModal(false);
      } catch (error) {
        console.error("Error creating product:", error);
        enqueueSnackbar('Thêm sản phẩm thất bại', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Thêm sản phẩm thất bại', { variant: 'error' });
      console.log(error);
    }
  };
  
  const handleCategory = (category) => {
    // setCategoryAdd(prevCategories => [...new Set([...prevCategories, category])]);
    setCategoryAdd([category]);
    console.log([category]);
  };
  const handlePrice = (price) => {
    if(price === "" || Number(price) < 0){
      setPrice(0);
      setSalePrice(0);
    }
    else if(Number(price) >= 50000000){
      setPrice(50000000);
      setSalePrice(50000000)
    }
    else{
      setPrice(price);
      setSalePrice(price);
    }
  }
  const handleUpdate = async () => {
    try {
      // Tạo bản sao của attributes để không thay đổi trực tiếp state
      const processedAttributes = await Promise.all(attributes.map(async (attribute) => {
        // Nếu attribute có values
        if (attribute.values && attribute.values.length > 0) {
          // Xử lý upload image cho từng value
          const processedValues = await Promise.all(attribute.values.map(async (value) => {
            // Nếu value có attributeImage là File
            if (value.attributeImage instanceof File) {
              const formData = new FormData();
              formData.append('file', value.attributeImage);
              
              try {
                const response = await axios.post('https://dhkshop.onrender.com/files/upload', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
                
                // Tạo một bản sao mới của value với fileId
                return {
                  ...value,
                  attributeImage: response.data.file._id
                };
              } catch (error) {
                console.error('Image upload error:', error);
                // Nếu upload thất bại, giữ nguyên value
                return value;
              }
            }
            return value;
          }));
  
          // Trả về attribute với values đã được xử lý
          return {
            ...attribute,
            values: processedValues
          };
        }
        return attribute;
      }));
  
      // Chuẩn bị dữ liệu update
      const data = {
        name: nameProduct,
        description: description,
        totalStockQuantity: stockQuantity,
        price: price,
        isSale: isSale,
        attributes: processedAttributes
      };
  
      // Thêm salePrice nếu có
      if (salePrice > 0) {
        data.salePrice = salePrice;
      }
      
      // Gọi API update
      const response = await axios.put(`https://dhkshop.onrender.com/product/${selectedProduct._id}`, data);
      
      // Thông báo thành công
      enqueueSnackbar('Chỉnh sửa sản phẩm thành công', { variant: 'success' });
      
      // Reset state
      setNameProduct("");
      setDescription("");
      setStockQuantity(10);
      setPrice(0);
      setSalePrice(0);
      setAttributes([]);
      setIsSale(false);
      setisOpenModal(false);
      setShowModal(false);
  
      // Trả về dữ liệu response nếu cần
      return response.data;
  
    } catch (error) {
      console.error("Error updating product:", error);
      enqueueSnackbar('Chỉnh sửa sản phẩm thất bại', { variant: 'error' });
      
      // Ném lỗi để component có thể xử lý nếu cần
      throw error;
    }
  };
  const uploadProduct = async () => {
    const uploader = new ProductUploader(enqueueSnackbar, products, images, handleUpload);
    uploader.uploadProduct(nameProduct, description, stockQuantity, price);
  }
  const updateProduct = async () => {
    const updater = new ProductUpdater(enqueueSnackbar, areAllAttributeTotalsEqual, handleUpdate);
    updater.updateProduct(selectedProduct, 
                          nameProduct, 
                          description, 
                          stockQuantity, 
                          price, 
                          attributes, 
                          salePrice, 
                          isSale);
  }
  useEffect(() => {
    const storeID = Cookies.get('store');
    axios.get('https://dhkshop.onrender.com/categories')
    .then((response) => {
      const listCate = [{name: 'all'}, ...response.data]
      setListCategory(listCate);
    })
    axios.get(`https://dhkshop.onrender.com/product/store/${storeID}`)
    .then((response) => {
      setProduct(response.data);
      
      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(response.data.map(product => product.category[0].name))];
      setCategory(uniqueCategories);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
  }, [])

  useEffect(() => {
          // Lắng nghe sự kiện thêm sản phẩm
          socket.on("productAdded", (newProduct) => {
            setProduct((prevProducts) => {
              const updatedProducts = [...prevProducts, newProduct];
              
              // Lấy tất cả danh mục từ danh sách sản phẩm mới
              const uniqueCategories = ['all', ...new Set(updatedProducts.map(product => product.category[0].name))];
      
              setCategory(uniqueCategories);
              return updatedProducts;
          });
          });
  
          // Lắng nghe sự kiện cập nhật sản phẩm
          socket.on("productUpdated", (updatedProduct) => {
            setProduct((prevProducts) =>
                  prevProducts.map((product) =>
                      product._id === updatedProduct._id ? updatedProduct : product
                  )
              );
          });
  
          // Lắng nghe sự kiện xóa sản phẩm
          socket.on("productDeleted", ({ productId }) => {
            setProduct((prevProducts) =>
                  prevProducts.filter((product) => product._id !== productId)
              );
          });
  
          return () => {
              socket.off("productAdded");
              socket.off("productUpdated");
              socket.off("productDeleted");
          };
      }, []);
  return (
    <div className='flex bg-gray-100'>
      <SellerHomeNav/>
      <div className='w-1/5'></div>
      {/* Main content area that adjusts based on sidebar state */}
      <div className={`min-h-screen transition-all duration-500 w-4/5`}>
        <div className='p-6'>
          <div className='bg-white rounded-xl shadow p-6 mb-6'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6'>
              <h1 className='text-2xl font-bold text-gray-800 mb-4 md:mb-0'>Quản lý sản phẩm</h1>
              <button
              onClick={() => setisOpenModal(true)}
              className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition'>
                <FaPlus /> Thêm sản phẩm mới
              </button>
            </div>
            
            <div className='grid grid-cols-3 md:grid-cols-4 gap-4 mb-6'>
              <div className='col-span-1 md:col-span-3'>
                <div className='relative'>
                  <input 
                    type='text'
                    className='w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-300'
                    placeholder='Tìm kiếm sản phẩm...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                </div>
              </div>
              
              <div className='col-span-1'>
                <div className='relative flex items-center'>
                  <FaFilter className='absolute left-3 text-gray-400' />
                  <select 
                    className='w-full pl-10 pr-4 py-2 rounded-lg text-black border appearance-none focus:outline-none focus:ring-2 focus:ring-purple-300'
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category === 'all' ? 'Tất cả danh mục' : category}
                      </option>
                    ))}
                  </select>
                  <div className='absolute right-3 pointer-events-none'>
                    <svg className='fill-current h-4 w-4 text-gray-500' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                      <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className='overflow-x-auto rounded-lg border'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Sản phẩm</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Danh mục</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Giá</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Kho</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Đã bán</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Trạng thái</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Thao tác</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {displayedProducts.map((product) => (
                    <tr key={product._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='flex-shrink-0 h-10 w-10'>
                            <img className='h-10 w-10 rounded-md object-cover' src={`https://dhkshop.onrender.com/files/download/${product.images[0]}`} alt={product.name} />
                          </div>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>{product.name}</div>
                            <div className='text-sm text-gray-500'>{product._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{product.category[0].name}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>{formatPrice(product.price)}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{product.totalStockQuantity}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{product.soldQuantity}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === "Active" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.status === "Active" ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <button className='text-blue-600 hover:text-blue-900' title='Chỉnh sửa' onClick={() => {setShowModal(true); prepareUpdate(product); setSelectedProduct(product)}}>
                            <FaEdit />
                          </button>
                          <button className={`${product.active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`} title={product.active ? 'Ngừng bán' : 'Kích hoạt'}>
                            {product.status === "Active" ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button className='text-red-600 hover:text-red-900' title='Xóa'>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='w-full flex justify-center'>
              <div className='mt-4 flex items-center gap-2'>
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  Trước
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-purple-600 text-white' : 'border hover:bg-gray-50'}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  Sau
                </button>
              </div>
            </div>
            
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            <div className='bg-white p-4 rounded-xl shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500'>Tổng sản phẩm</p>
                  <h3 className='text-2xl font-bold'>{products.length}</h3>
                </div>
                <div className='bg-blue-100 p-3 rounded-full'>
                  <FaBox className='text-blue-600' />
                </div>
              </div>
            </div>
            
            <div className='bg-white p-4 rounded-xl shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500'>Đang bán</p>
                  <h3 className='text-2xl font-bold'>{products.filter(p => p.status === 'Active').length}</h3>
                </div>
                <div className='bg-green-100 p-3 rounded-full'>
                  <FaEye className='text-green-600' />
                </div>
              </div>
            </div>
            
            <div className='bg-white p-4 rounded-xl shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500'>Ngừng bán</p>
                  <h3 className='text-2xl font-bold'>{products.filter(p => p.status !== 'Active').length}</h3>
                </div>
                <div className='bg-red-100 p-3 rounded-full'>
                  <FaEyeSlash className='text-red-600' />
                </div>
              </div>
            </div>
            
            <div className='bg-white p-4 rounded-xl shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500'>Tổng đã bán</p>
                  <h3 className='text-2xl font-bold'>{products.reduce((sum, product) => sum + product.soldQuantity, 0)}</h3>
                </div>
                <div className='bg-purple-100 p-3 rounded-full'>
                  <FaShippingFast className='text-purple-600' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal sản phẩm */}
      <div className={`fixed flex inset-0 items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300 ${isOpenModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 max-w-6xl">
          {/* Product Preview Card */}
          <div className={`bg-white rounded-xl shadow-2xl w-full lg:w-1/3 overflow-hidden transform transition-all duration-500 ease-in-out ${isOpenModal ? "translate-y-0" : "translate-y-10 pointer-events-none"}`}>
            <div className="flex flex-col h-[600px]">
              {/* Product Image */}
              <div className={`relative h-2/3 w-full ${listMedia.length === 0 ? "bg-gray-100 flex items-center justify-center" : ""} rounded-t-xl overflow-hidden group`}>
                {listMedia.length === 0 ? (
                  <div className="text-center p-6" onClick={() => imgRef.current.click()}>
                    <MdOutlineAddPhotoAlternate className="text-6xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Nhấn để thêm hình ảnh sản phẩm</p>
                  </div>
                ) : (
                  <>
                    <img 
                      src={listMedia[0].url} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      alt="Product preview"
                      onClick={() => imgRef.current.click()}
                    />
                    <div className="absolute bottom-3 right-3 bg-white bg-opacity-80 px-2 py-1 rounded-md text-xs">
                      {listMedia.length} ảnh
                    </div>
                  </>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex-1 p-6 flex flex-col">
                <h3 className="text-xl font-medium text-gray-800 mb-2 line-clamp-2">
                  {nameProduct !== "" ? nameProduct : "Tên sản phẩm"}
                </h3>
                
                {/* Price Section */}
                <div className="mb-4">
                  {isSale ? (
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        {salePrice === 0 ? "100.000" : Number(salePrice).toLocaleString("vi-VN")} đ
                      </p>
                      <div className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg text-xs">
                        -{Math.round(100 - ((salePrice/price) * 100)) || 0}%
                      </div>
                      <p className="text-sm text-gray-500 line-through">
                        {Number(price).toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {price ? Number(price).toLocaleString("vi-VN") : "0"} đ
                    </p>
                  )}
                </div>
                
                {/* Rating & Sales */}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium">4.5</span>
                    </div>
                    <span className="text-sm text-gray-500">|</span>
                    <div className="text-sm text-gray-600">
                      Đã bán: <span className="font-medium">13.9k</span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {attributes.length > 0 ? `${attributes.length} biến thể` : "Sản phẩm đơn"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          {/* Form Container */}
          <div className={`bg-white rounded-xl shadow-2xl w-full lg:w-2/3 transform transition-all duration-500 ease-in-out ${isOpenModal ? "translate-y-0" : "translate-y-10 pointer-events-none"}`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h2>
                <button 
                  onClick={() => {setisOpenModal(false); resetState()}}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              
              {/* Scrollable Form */}
              <div className="overflow-y-auto max-h-[500px] px-2 custom-scrollbar">
                {/* Basic Information */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                    <input 
                      value={nameProduct} 
                      type="text" 
                      onChange={(e) => setNameProduct(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 focus:outline-none" 
                      placeholder="VD: Áo thun unisex form rộng" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      style={{resize: 'none'}}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 focus:outline-none" 
                      placeholder="Mô tả chi tiết về sản phẩm của bạn" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition duration-200 focus:outline-none"
                      onChange={(e) => handleCategory(e.target.value)}
                    >
                      {listCategory.map((category, index) => (
                        <option key={index} value={category._id}>
                          {category.name === 'all' ? 'Tất cả danh mục' : category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Pricing and Stock */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá sản phẩm</label>
                      <div className="relative">
                        <input 
                          value={price} 
                          type="number" 
                          onChange={(e) => handlePrice(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 focus:outline-none" 
                          placeholder="Nhập giá bán" 
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">đ</span>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                      {attributes.length === 0 && !isAddAttr ? (
                        <div className="flex items-center">
                          <button 
                            className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-100"
                            onClick={() => {stockQuantity <= 10 ? setStockQuantity(stockQuantity) : setStockQuantity(stockQuantity - 1)}}
                          >
                            <FaMinus className="text-gray-600" />
                          </button>
                          <input
                            type="number"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(Number(e.target.value))}
                            className="w-20 text-center p-2 border-y border-gray-300 focus:outline-none"
                          />
                          <button 
                            className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-100"
                            onClick={() => {stockQuantity >= 1000 ? setStockQuantity(stockQuantity) : setStockQuantity(stockQuantity + 1)}}
                          >
                            <FaPlus className="text-gray-600" />
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                          {stockQuantity}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Áp dụng giảm giá</label>
                      <button 
                        onClick={() => setIsSale(!isSale)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isSale ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${isSale ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    {isSale && (
                      <div className="relative">
                        <input 
                          type="number" 
                          value={salePrice}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || Number(value) > price || Number(value) < 0) {
                              setSalePrice(salePrice);
                            } else {
                              setSalePrice(value);
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 focus:outline-none" 
                          placeholder="Nhập giá sau khi giảm" 
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">đ</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Media Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                  <div 
                    onClick={() => imgRef.current.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-500 transition-colors cursor-pointer"
                  >
                    <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-500">Nhấn để thêm hình ảnh</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (Tối đa 5MB)</p>
                  </div>
                  <input 
                    className="hidden" 
                    type="file" 
                    onChange={handleFileChange} 
                    ref={imgRef} 
                    multiple 
                    accept="image/*"
                  />
                  
                  {listMedia.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {listMedia.map((media, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden">
                          <img src={media.url} className="w-full h-full object-cover" alt={`Product ${index}`} />
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                
                {/* Attributes/Variants */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-lg font-medium text-gray-700">Biến thể sản phẩm</label>
                    {!isAddAttr && (
                      <button 
                        onClick={handleOpenAttribute}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm hover:opacity-90 transition-opacity"
                      >
                        <FaPlus className="text-xs" /> Thêm biến thể
                      </button>
                    )}
                  </div>
                  
                  {/* Existing Attributes Display */}
                  {attributes.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Biến thể hiện tại</h4>
                      {attributes.map((attribute, index) => (
                        <div key={index} className="mb-3 last:mb-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-purple-700">{attribute.name}</h5>
                            <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-1">
                              {attribute.values.length} giá trị
                            </span>
                          </div>
                          <div className="mt-2 space-y-2">
                            {attribute.values.map((item, subIndex) => (
                              <div key={subIndex} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                                <span>{item.attributeName}</span>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-500">SL: {item.stockQuantity}</span>
                                  <span className="text-sm font-medium">{Number(item.priceAttribute).toLocaleString("vi-VN")} đ</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add New Attribute UI */}
                  {isAddAttr && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-3">Thêm biến thể mới</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Tên biến thể</label>
                          <input 
                            type="text" 
                            maxLength={30}
                            value={nameAttribute}
                            onChange={(e) => setNameAttribute(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition focus:outline-none" 
                            placeholder="VD: Màu sắc, Kích thước, ..." 
                          />
                        </div>
                        
                        {!isAddValue ? (
                          <button 
                            onClick={() => setIsAddValue(!isAddValue)}
                            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:opacity-90 transition-opacity"
                          >
                            Thêm giá trị cho biến thể
                          </button>
                        ) : (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <h5 className="font-medium text-gray-700 mb-2">Thêm giá trị</h5>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Tên giá trị</label>
                                <input 
                                  type="text"
                                  maxLength={30}
                                  value={nameValue}
                                  onChange={(e) => setNameValue(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition focus:outline-none" 
                                  placeholder="VD: Đỏ, XL, ..." 
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Số lượng</label>
                                <div className="flex items-center">
                                  <button 
                                    className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                                    onClick={() => {stockValue <= 1 ? setStockValue(stockValue) : setStockValue(stockValue - 1)}}
                                  >
                                    <FaMinus className="text-gray-600" />
                                  </button>
                                  <input
                                    type="number"
                                    value={stockValue}
                                    readOnly
                                    className="w-20 text-center p-2 border-y border-gray-300 focus:outline-none"
                                  />
                                  <button 
                                    className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                                    onClick={() => {stockValue >= 1000 ? setStockValue(stockValue) : setStockValue(stockValue + 1)}}
                                  >
                                    <FaPlus className="text-gray-600" />
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Phụ phí biến thể</label>
                                <input 
                                  type="number"
                                  min={1}
                                  max={50000000}
                                  value={valuePrice}
                                  onChange={(e) => setValuePrice(Number(e.target.value))}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition focus:outline-none" 
                                  placeholder="Nhập phụ phí cho biến thể này" 
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Hình ảnh biến thể</label>
                                <input 
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setImageValue(e.target.files[0])}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" 
                                />
                              </div>
                              
                              <button 
                                onClick={handleAddValue}
                                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                              >
                                <FaPlus className="text-xs" /> Thêm giá trị này
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Preview of new attribute */}
                        {newAttribute.values.length > 0 && (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <h5 className="font-medium text-purple-700 mb-2">{nameAttribute}</h5>
                            <div className="bg-gray-50 rounded-md p-3 space-y-2">
                              {newAttribute.values.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                                  <span className="font-medium">{item.attributeName}</span>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">SL: {item.stockQuantity}</span>
                                    <span className="text-sm font-medium">{Number(item.priceAttribute).toLocaleString("vi-VN")} đ</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <button 
                              onClick={handleAddAttribute}
                              className="w-full py-2 mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                              <FaCheck className="text-xs" /> Hoàn tất thêm biến thể
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 mt-4">
                <button
                  onClick={uploadProduct}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Lưu sản phẩm
                </button>
                <button
                  onClick={() => {setisOpenModal(false); resetState()}}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`fixed flex inset-0 items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300 ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 max-w-6xl justify-center">
          {/* Form Container */}
          <div className={`bg-white rounded-xl shadow-2xl w-full lg:w-2/3 transform transition-all duration-500 ease-in-out ${showModal ? "translate-y-0" : "translate-y-10 pointer-events-none"}`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h2>
                <button 
                  onClick={() => {setShowModal(false); resetState()}}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              
              {/* Scrollable Form */}
              <div className="overflow-y-auto max-h-[500px] px-2 custom-scrollbar">
                {/* Basic Information */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                    <input 
                      value={nameProduct} 
                      type="text" 
                      onChange={(e) => setNameProduct(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 focus:outline-none" 
                      placeholder="VD: Áo thun unisex form rộng" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      style={{resize: 'none'}}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 focus:outline-none" 
                      placeholder="Mô tả chi tiết về sản phẩm của bạn" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition duration-200 focus:outline-none"
                      onChange={(e) => handleCategory(e.target.value)}
                    >
                      {listCategory.map((category, index) => (
                        <option key={index} value={category._id}>
                          {category.name === 'all' ? 'Tất cả danh mục' : category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Pricing and Stock */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá sản phẩm</label>
                      <div className="relative">
                        <input 
                          value={price} 
                          type="number" 
                          onChange={(e) => handlePrice(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 focus:outline-none" 
                          placeholder="Nhập giá bán" 
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">đ</span>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                      {attributes.length === 0 && !isAddAttr ? (
                        <div className="flex items-center">
                          <button 
                            className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-100"
                            onClick={() => {stockQuantity <= 10 ? setStockQuantity(stockQuantity) : setStockQuantity(stockQuantity - 1)}}
                          >
                            <FaMinus className="text-gray-600" />
                          </button>
                          <input
                            type="number"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(Number(e.target.value))}
                            className="w-20 text-center p-2 border-y border-gray-300 focus:outline-none"
                          />
                          <button 
                            className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-100"
                            onClick={() => {stockQuantity >= 1000 ? setStockQuantity(stockQuantity) : setStockQuantity(stockQuantity + 1)}}
                          >
                            <FaPlus className="text-gray-600" />
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                          {stockQuantity}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Áp dụng giảm giá</label>
                      <button 
                        onClick={() => setIsSale(!isSale)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isSale ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${isSale ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    
                    {isSale && (
                      <div className="relative">
                        <input 
                          type="number" 
                          value={salePrice}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || Number(value) > price || Number(value) < 0) {
                              setSalePrice(salePrice);
                            } else {
                              setSalePrice(value);
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 focus:outline-none" 
                          placeholder="Nhập giá sau khi giảm" 
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">đ</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Attributes/Variants */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-lg font-medium text-gray-700">Biến thể sản phẩm</label>
                    {!isAddAttr && (
                      <button 
                        onClick={handleOpenAttribute}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm hover:opacity-90 transition-opacity"
                      >
                        <FaPlus className="text-xs" /> Thêm biến thể
                      </button>
                    )}
                  </div>
                  
                  {/* Existing Attributes Display */}
                  {attributes.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Biến thể hiện tại</h4>
                      {attributes.map((attribute, index) => (
                        <div key={index} className="mb-3 last:mb-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-purple-700">{attribute.name}</h5>
                            <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-1">
                              {attribute.values.length} giá trị
                            </span>
                          </div>
                          <div className="mt-2 space-y-2">
                            {attribute.values.map((item, subIndex) => (
                              <div key={subIndex} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                                <span>{item.attributeName}</span>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">SL:</span>
                                    <div className="flex items-center border border-gray-300 rounded">
                                      <button 
                                        className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                        onClick={() => handleDecreaseStock(index, subIndex)}
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        value={item.stockQuantity}
                                        onChange={(e) => handleStockChange(index, subIndex, e.target.value)}
                                        className="w-12 text-center py-1 focus:outline-none"
                                      />
                                      <button 
                                        className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                        onClick={() => handleIncreaseStock(index, subIndex)}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  <span className="text-sm font-medium">{Number(item.priceAttribute).toLocaleString("vi-VN")} đ</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add New Attribute UI */}
                  {isAddAttr && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-3">Thêm biến thể mới</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Tên biến thể</label>
                          <input 
                            type="text" 
                            maxLength={30}
                            value={nameAttribute}
                            onChange={(e) => setNameAttribute(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition focus:outline-none" 
                            placeholder="VD: Màu sắc, Kích thước, ..." 
                          />
                        </div>
                        
                        {!isAddValue ? (
                          <button 
                            onClick={() => setIsAddValue(!isAddValue)}
                            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:opacity-90 transition-opacity"
                          >
                            Thêm giá trị cho biến thể
                          </button>
                        ) : (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <h5 className="font-medium text-gray-700 mb-2">Thêm giá trị</h5>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Tên giá trị</label>
                                <input 
                                  type="text"
                                  maxLength={30}
                                  value={nameValue}
                                  onChange={(e) => setNameValue(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition focus:outline-none" 
                                  placeholder="VD: Đỏ, XL, ..." 
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Số lượng</label>
                                <div className="flex items-center">
                                  <button 
                                    className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                                    onClick={() => {stockValue <= 1 ? setStockValue(stockValue) : setStockValue(stockValue - 1)}}
                                  >
                                    <FaMinus className="text-gray-600" />
                                  </button>
                                  <input
                                    type="number"
                                    value={stockValue}
                                    readOnly
                                    className="w-20 text-center p-2 border-y border-gray-300 focus:outline-none"
                                  />
                                  <button 
                                    className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                                    onClick={() => {stockValue >= 1000 ? setStockValue(stockValue) : setStockValue(stockValue + 1)}}
                                  >
                                    <FaPlus className="text-gray-600" />
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Phụ phí biến thể</label>
                                <input 
                                  type="number"
                                  min={1}
                                  max={50000000}
                                  value={valuePrice}
                                  onChange={(e) => setValuePrice(Number(e.target.value))}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition focus:outline-none" 
                                  placeholder="Nhập phụ phí cho biến thể này" 
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Hình ảnh biến thể</label>
                                <input 
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setImageValue(e.target.files[0])}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" 
                                />
                              </div>
                              
                              <button 
                                onClick={handleAddValue}
                                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                              >
                                <FaPlus className="text-xs" /> Thêm giá trị này
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Preview of new attribute */}
                        {newAttribute.values.length > 0 && (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <h5 className="font-medium text-purple-700 mb-2">{nameAttribute}</h5>
                            <div className="bg-gray-50 rounded-md p-3 space-y-2">
                              {newAttribute.values.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                                  <span className="font-medium">{item.attributeName}</span>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">SL: {item.stockQuantity}</span>
                                    <span className="text-sm font-medium">{Number(item.priceAttribute).toLocaleString("vi-VN")} đ</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <button 
                              onClick={handleAddAttribute}
                              className="w-full py-2 mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                              <FaCheck className="text-xs" /> Hoàn tất thêm biến thể
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 mt-4">
                <button
                  onClick={updateProduct}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Lưu sản phẩm
                </button>
                <button
                  onClick={() => {setShowModal(false); resetState()}}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerProducts
