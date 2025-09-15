import React, { useEffect, useState } from 'react'
import CardPost from '../../components/CardPost.jsx'
import Cookies from 'js-cookie';
import axios from 'axios';
import { FaSearch, FaChevronDown  } from 'react-icons/fa';
import { IoReloadOutline } from "react-icons/io5";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Avatar,
  Button,
  Input
} from '@chakra-ui/react'

import { useNavigate } from 'react-router-dom';
const HomePage = () => {
  const[defaultPost, setDefaultPost] = useState([]);
  const[postIDs, setPostID] = useState([]);
  const[loadingPost, setLoadingPost] = useState('');
  const[loadNewest, setLoadNewest] = useState(false);
  const[loadOldest, setLoadOldest] = useState(false);
  const[userList, setUserList] = useState([]);
  const[selectedItem, setSelectedItem] = useState('');
  const[filterPost, setFilterPost] = useState([]);
  const[loadFilter, setLoadFilter] = useState(false);
  const[selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();
  const fetchFollow = async (userID) => {
    setLoadingPost(true);
    try{
      const responseFollow = await axios.get(`https://dhkptsocial.onrender.com/users/${userID}`);
      // console.log(responseFollow.data.followings);
      const followers = responseFollow.data.followings;
      let postList = [];
      for(let i = 0; i < followers.length; i++){
        const responseArticle = await axios.get(`https://dhkptsocial.onrender.com/articles/${followers[i]._id}`);
        for(let i = 0; i < responseArticle.data.count; i++)
        {
          postList.push(responseArticle.data.data[i]);
        }
      }
      setDefaultPost(postList);
      setPostID(shuffleArray(postList));
      setLoadingPost(false);
    }
    catch(error){
      console.log('Chưa theo dõi người dùng nào cả!');
    }
  }
  const findUser = async (e) => {
    try {
      if(e.target.value.length != 0){
        const { data } = await axios.get(`https://dhkptsocial.onrender.com/users/all?search=${e.target.value}`, { withCredentials: true });

        setUserList(data);
      }
      else{
        fetchUser();
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  const fetchUser = () => {
    axios.get('https://dhkptsocial.onrender.com/users')
    .then((response) => {
      setUserList(response.data.data);
    })
    .catch((error) => {
      console.log(error);
    })
  }
  useEffect(() => {
    const id = Cookies.get('customerId');
    fetchFollow(id);
    fetchUser();
  }, [])
  //Trộn bài đăng
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      // Tạo số ngẫu nhiên từ 0 đến i
      const j = Math.floor(Math.random() * (i + 1));
      // Hoán đổi phần tử thứ i và j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  //Sắp xếp theo ngày đăng gần nhất
  function sortPostsByDate(posts) {
    return posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  }
  const handleFilter = (selectedDate) => {
    setSelectedDate(selectedDate);
  
    // Hàm lấy phần ngày
    const getLocalDate = (datetime) => {
      const date = new Date(datetime);
      return date.toISOString().split("T")[0];
    };
  
    // Xóa mảng trước đó để tránh giữ lại dữ liệu cũ
    setFilterPost([]);
  
    // Lọc bài viết theo ngày
    const filtered = defaultPost.filter((post) => {
      if (!post.publishDate) return false;
      const postDate = getLocalDate(post.publishDate);
      return postDate === selectedDate;
    });
  
    // Cập nhật trạng thái
    setFilterPost(filtered);
    setLoadNewest(false);
    setLoadOldest(false);
    setSelectedItem('');
    setLoadFilter(true);
  };
  return (
    <>  
      <div className='w-full flex justify-center pt-2'>
        <div className='w-2/3 '>
        {postIDs.length == 0 && !loadingPost ? (
          <div></div>
        ):(
          <div className='md:flex block md:justify-center text-center md:gap-2'>
            {/* <button className={`md:text-lg text-xs px-4 py-2 rounded-md ${loadNewest ? ('bg-black text-white'): ('bg-white text black')}`} 
            onClick={() => {setLoadNewest(true); setLoadOldest(false)}}>
              Đăng gần đây
            </button>
            <button className={`md:text-lg text-xs px-4 py-2 rounded-md ${loadOldest ? ('bg-black text-white'): ('bg-white text black')}`} 
            
            onClick={() => {setLoadNewest(false); setLoadOldest(true)}}>
              Đăng đã lâu
            </button> */}
            <Input value={selectedDate} type='date' w={['100%','60%','60%','50%']} bg='white' mb={['10px', '10px', '0px', '0px']} onChange={(e) => {handleFilter(e.target.value)}} onClick={() => {setFilterPost([])}}/>
            <Menu >
              <MenuButton as={Button} rightIcon={<FaChevronDown />} w={['100%', '60%','60%','30%']}>
                {selectedItem === '' ? (<p>Bộ lọc</p>) : (<p>{selectedItem}</p>)}
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <button value='Đăng gần đây' onClick={(e) => {setLoadNewest(true); 
                    setLoadOldest(false); 
                    setSelectedItem(e.target.value);
                    setLoadFilter(false);
                    setSelectedDate('')}}>Đăng gần đây</button>
                </MenuItem>
                <MenuItem>
                  <button value='Đăng đã lâu' onClick={(e) => {setLoadNewest(false); 
                    setLoadOldest(true); 
                    setSelectedItem(e.target.value);
                    setLoadFilter(false);
                    setSelectedDate('')}}>Đăng đã lâu</button>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        )}
        </div>
      </div>
      <div className='flex w-full'>
        <div className='flex-[4_4_0] mr-auto min-h-screen w-full'>
          {loadNewest ? (
            (sortPostsByDate(defaultPost)).map((post, index) => (
              <div key={index} className='mt-2'>
                <CardPost postID={post._id} author={post.userID} description={post.description} post={post}/>
              </div>
            ))
          ):(
            <div className='hidden'></div>
          )}
          {loadOldest ? (
            sortPostsByDate(defaultPost).reverse().map((post, index) => (
              <div key={index} className='mt-2'>
                <CardPost postID={post._id} author={post.userID} description={post.description} post={post}/>
              </div>
            ))
          ):(
            <div className='hidden'></div>
          )}
          {!loadOldest && !loadNewest ? (
            postIDs.length == 0 && !loadingPost ? (
              <div className='w-full flex justify-center md:mt-2 mt-2'>
                <div className='md:w-5/6 w-4/6'>
                  <div className='text-center bg-black text-white px-2 py-4 rounded-lg'>
                    <p className='md:text-xl text-md font-bold'>Bạn chưa theo dõi người dùng nào cả</p>
                    <p className='md:text-md text-sm'>Hãy thử theo dõi một số tài khoản để có trải nghiệm được cá nhân hóa.</p>
                  </div>
                  <div className='w-full mt-2'>
                    <div className='bg-black px-6 py-4 flex items-center rounded-md'>
                      <FaSearch className='text-xl text-gray-500'/>
                      <input maxLength={30} 
                      onChange={(e) => findUser(e)}
                      placeholder='Nhập tên người dùng'
                      className='text-gray-200 ml-4 bg-transparent mr-4 focus:ring-0 focus:border-0 focus:outline-none w-full'/>
                    </div>
                    <div className='mt-2 flex justify-center '>
                      {userList.length == 0 ? (
                        <div></div>
                      ):(
                        <div className='text-center'>
                          {
                          userList.map((user, index) => (
                            user._id == Cookies.get('customerId') ? (
                              <div></div>
                            ) : (
                              <div key={index} className='flex items-center bg-black text-white py-2 px-2 rounded-md mb-2 
                              hover:cursor-pointer hover:bg-white hover:text-black'
                              onClick={() => navigate(`/users/${user._id}`)}>
                                <Avatar src={`https://dhkptsocial.onrender.com/files/download/${user.avatar}`}/>
                                <p className='ml-2'>{user.name}</p>
                              </div>
                            )
                          ))
                        }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ):(
              !loadFilter ? (
                postIDs.map((post, index) => (
                  <div key={index} className='mt-2'>
                    <CardPost postID={post._id} author={post.userID} description={post.description} post={post}/>
                  </div>
                ))
              ):(
                filterPost.length != 0 ? (
                  filterPost.map((post, index) => (
                    <div key={index} className='mt-2'>
                      <CardPost postID={post._id} author={post.userID} description={post.description} post={post}/>
                    </div>
                  ))
                ):(
                  <div className='flex justify-center'>
                    <div className='text-white text-xl font-bold mt-2'>
                      Không có kết quả nào được tìm thấy
                    </div>
                  </div>
                )
              )
            )
          ): (
            <div className='hidden'></div>
          )}
        </div>
      </div>
    </>
    
  )
}

export default HomePage