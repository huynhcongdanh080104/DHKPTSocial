import React, { useEffect, useState, useRef } from 'react'
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import io from "socket.io-client";
import axios from 'axios';
import Spiner from '../../components/Spiner';

const CreatePost = () => {
    const [loading, setLoading] = useState(false);
    const [descriptionPost, setDescription] = useState('')
    const [file, setFile] = useState(null);
    const [user, setUser] = useState('');
    const [listMedia, setListMedia] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const imgRef = useRef(null);
    const socketRef = useRef(null);
    useEffect(() => {
        const id = Cookies.get('customerId');
        const name = Cookies.get('customerName');
        setUser(id);
    })
    useEffect(() => {
        socketRef.current = io("https://dhkptsocial.onrender.com");
        socketRef.current.on('connect', () => {
            console.log('Socket connected:', socketRef.current.id);
        });
        return () => {
            socketRef.current.disconnect(); // Ngắt khi rời component
        };
    }, [])
    const handleFileChange = (e) => {
        setFile(e.target.files);
        const fileArray = e.target.files;

        const imageArray = [];
        const videoArray = [];

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
    const handleDescription = (e) => {
        setDescription(e.target.value);
    };
    const handleUpload = async () => {
        setLoading(true);
        if(descriptionPost === ''){
            enqueueSnackbar('Nhập mô tả bài đăng', { variant: 'error' });
            setLoading(false);
        }
        else if(descriptionPost.length > 200){
          enqueueSnackbar('Mô tả bài đăng không dài quá 200 ký tự', { variant: 'error' });
          setLoading(false);
          }
          else if (!file){
            enqueueSnackbar('Thêm hình ảnh hoặc video', { variant: 'error' });
            setLoading(false);
          }
          else{
            const data = {
              descriptionPost,
              user
            };
            try{
                const response = await axios.post('https://dhkptsocial.onrender.com/articles', data)
                console.log('Inserted document ID:', response.data._id);
                for (let i = 0; i < file.length; i++) {
                    if(i == file.length - 1){
                        const formData = new FormData();
                        formData.append('file', file[i]);
                        formData.append('postId', response.data._id); 
                        try {
                            const response = await axios.post('https://dhkptsocial.onrender.com/files/upload', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            });
                            console.log('Last file uploaded successfully:', response.data);
                            enqueueSnackbar('Đăng tin thành công', { variant: 'success' });
                            setFile(null);
                            setListMedia([]);
                            setDescription('');
                            setLoading(false);
                            
                        } catch (error) {
                            console.error('Error uploading file:', error);
                        }
                    }
                    else{
                        const formData = new FormData();
                        formData.append('file', file[i]);
                        formData.append('postId', response.data._id); 
                        try {
                          const response = await axios.post('https://dhkptsocial.onrender.com/files/upload', formData, {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                            },
                          });
                          console.log('File uploaded successfully:', response.data);
                        } catch (error) {
                          console.error('Error uploading file:', error);
                        }
                    }
                }
                socketRef.current.emit('articleAdded', response.data, (response) => {
                    console.log('📨 EMIT CALLBACK - Server response:', response);
                });
            }
            catch(error){
                enqueueSnackbar('Đăng tin thất bại', { variant: 'error' });
                console.log(error);
                setLoading(false);
            }
          }
    };
    
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-white lg:w-2/3 w-full h-auto p-2 m-0 rounded-lg'>
          {listMedia.length == 0 ? (<div className='hidden'></div>) : (
            <div className='w-full float-left justify-center items-center p-2 bg-gradient-to-r from-purple-600 to-pink-600' style={{overflow: 'scroll'}}>
            <div className='w-screen flex '>
              {listMedia.map((media, index) => (
                  <div key={index} className='lg:h-36 lg:w-1/5 md:h-36 md:w-3/5 w-full h-24 flex justify-center'>
                      {media.type === 'image' ? (
                          <img onClick={() => imgRef.current.click()} src={media.url} className="h-full w-auto object-cover" alt={`media-${index}`} />
                      ) : (
                          <video onClick={() => imgRef.current.click()} src={media.url} className="h-full w-auto object-cover" controls />
                      )}
                  </div>
              ))}
            </div>
        </div>
          )}
          <div className='w-full h-auto block p-2 justify-center text-center'>
              {listMedia.length != 0 ? (<div className='hidden'></div>) : (
                <button onClick={() => imgRef.current.click()} 
                className='hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600
                bg-black rounded-lg text-white p-2 mb-4'>Thêm hình ảnh và video</button>
              )}
              <input className='hidden' type="file" onChange={handleFileChange} ref={imgRef} multiple accept="image/*,video/*"/>
              <p className='font-bold'>Mô tả bài viết:</p>
              <div className='p-2 border-2 rounded-lg shadow-lg'>
                <textarea placeholder='Nhập mô tả...' maxLength={200} type='text' onChange={handleDescription} className=' h-24 w-full resize-none focus:outline-none' value={descriptionPost}></textarea>
              </div>
              {listMedia.length != 0 ? (
                !loading ? (
                <button onClick={handleUpload} className=' px-6 py-2 bg-black text-white rounded-lg mt-2
                hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600'>Đăng tải</button>
                ):(
                <button onClick={handleUpload} className=' px-6 py-4 bg-black text-white rounded-lg mt-2
                hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600'><Spiner/></button>
                )

              ): (
                <button onClick={handleUpload} className='hidden px-6 py-2 bg-black text-white rounded-lg mt-2
                hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600'>Đăng tải</button>
              )}
              
          </div>
          
      </div>
    </div>
  )
}

export default CreatePost
