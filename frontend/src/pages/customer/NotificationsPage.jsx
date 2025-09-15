import { Avatar } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
const NotificationsPage = () => {
  const [notifyList, setNotifyList] = useState([]);
  const navigate = useNavigate();
  const fetchNotify = async (userID) => {
    const response = await axios.get(`https://dhkptsocial.onrender.com/notifications/${userID}`)
    if(response)
    { 
      // console.log(response.data);
      setNotifyList(response.data.reverse());
    }
    else{
      console.log('Không có bình luận nào cả')
    }
  }
  fetchNotify(Cookies.get('customerId'));
  const handleNotifyArticle = (post) => {
    const data = {
      _id: post?._id,
      numberOfLike: post?.numberOfLike,
      numberOfComment: post?.numberOfComment,
      userID: post?.userID,
      articleStatus: post?.articleStatus,
      publishDate: post?.publishDate,
      description: post?.description,
    }
    navigate('/article', {state: {data}});
  }
  return (
    <div className='w-full flex justify-center'>
      <div className='md:w-3/6 w-4/6'>
        <div className='w-full flex jusfify-center items-center py-6 bg-black text-white font-bold rounded-b-lg shadow-lg'>
          <p className='text-center w-full md:text-xl text-md'>Thông báo</p>
        </div>
        {notifyList.length != null ? (
          notifyList.map((notification, index) => (
            notification.article != null ? (
              <div key={index} className='w-full rounded-lg bg-black text-white py-4 flex px-4 mt-4 hover:cursor-pointer' 
              onClick={() => handleNotifyArticle(notification.article)}>
                <Avatar size={['sm', 'md']} src={`data:image/png;base64,${notification.actor?.avatar}`}/>
                <div className='w-full flex items-center ml-4'>
                  <p className='md:text-lg text-sm'><b>{notification.actor?.name}</b> {notification.actionDetail}</p>
                </div>
              </div>
            ):(
              <div key={index} className='w-full rounded-lg bg-black text-white py-4 flex px-4 mt-4 hover:cursor-pointer' onClick={() => navigate(`/users/${notification.actor?._id}`)}>
                <Avatar size={['sm', 'md']} src={`data:image/png;base64,${notification.actor?.avatar}`}/>
                <div className='w-full flex items-center ml-4'>
                  <p className='md:text-lg text-sm'><b>{notification.actor?.name}</b> {notification.actionDetail}</p>
                </div>
              </div>
            )
          ))
        ):(
          <div className='w-full mt-4 flex jusfify-center items-center py-6 bg-black text-white font-bold rounded-lg shadow-lg'>
          <p className='text-center w-full text-xl'>Không có thông báo nào</p>
        </div>
        )}
        
      </div>
    </div>
  )
}

export default NotificationsPage