import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import CardPost from '../../components/CardPost';
import { useStatStyles } from '@chakra-ui/react';
import { FaAngleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const PostDetails = () => {
    const location = useLocation();
    const [post, setPost] = useState(location.state?.data);
  return (
    <div className='bg-gradient-to-r from-purple-600 to-pink-600 h-screen flex items-center py-24' style={{height: "max-content"}}>
        <div className='absolute top-2 left-2 rounded-full p-2 bg-black text-white text-center hover:cursor-pointer'>
          <Link to="/home">
            <FaAngleLeft fontSize='25px'/>
          </Link>
        </div>
        <CardPost postID={post._id} author={post.userID} description={post.description} post={post}/>
    </div>
    
  )
}

export default PostDetails