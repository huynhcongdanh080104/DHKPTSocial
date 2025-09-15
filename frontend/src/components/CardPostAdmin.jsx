import React, { useEffect, useState } from 'react'
import Heart from '../assets/heart.png'
import Heart_Love from '../assets/heart-red.png'
import { FaRegComment, FaRegHeart, FaRegPaperPlane, FaAngleRight, FaAngleLeft, FaHeart  } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  HStack,
  VStack,
  Box,
  Input,
  Avatar,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Textarea,
  background,
  Divider,
} from '@chakra-ui/react'
import Cookies from 'js-cookie';
import { color } from 'framer-motion';
import CommentItem from './CommentItem';

const CardPostAdmin = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenReport, onOpen: onOpenReport, onClose: onCloseReport } = useDisclosure()
    const { isOpen: isOpenComment, onOpen: onOpenComment, onClose: onCloseComment } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen: isOpenDeleteComment, onOpen: onOpenDeleteComment, onClose: onCloseDeleteComment } = useDisclosure()
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [author, setAuthor] = useState('');
    const [ava_author, setAvaAuthor] = useState('');
    const [authorID, setAuthorID] = useState('');
    const [username, setUsername] = useState('');
    const [files, setFile] = useState([]);
    const [comment, setComment] = useState('');
    const [descriptionPost, setDescription] = useState('');
    const [fileLength, setFileLength] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [postID, setPostID] = useState('');
    const [post, setPost] = useState('');
    const [like, setLike] = useState();
    const [likeID, setLikeID] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [reportDetails, setReportDetails] = useState('');
    const [deleteCommentID, setDeleteCommentID] = useState('');
    const [reportCommentID, setReportCommentID] = useState('');
    const [isHideDescription, setIsHideDescription] = useState(false)
  const fetchVideos = async (postID) => {
    try {
      const response = await axios.get(`https://dhkptsocial.onrender.com/files/${postID}`);
      setFile(response.data);
      setFileLength(response.data.length);
      // console.log(response.data.length);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };
  const fetchUser = async (userID) => {
    try {
      const response = await axios.get(`https://dhkptsocial.onrender.com/users/${userID}`);
      setAuthor(response.data.name);
      setAvaAuthor(response.data.avatar)
      setUsername(response.data.username);
      setAuthorID(response.data._id);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };
  const fetchLike = async (user, postID) => {
    try{
      const response = await axios.get(`https://dhkptsocial.onrender.com/likes/${user}/${postID}`);
      
      if(response.data != null){
        // console.log('Người dùng đã like bài post' + postID);
        setLike(true);
        setLikeID(response.data._id);
      }
      else{
        // console.log('Người dùng chưa like bài post' + postID);
        setLike(false);
      }
    }
    catch{
      console.log('Like not found');
    }
  }
  const fetchPost = async () => {
    const response = await axios.get(`https://dhkptsocial.onrender.com/articles/all/${postID}`);
    setPost(response.data);
  }
  const handleTurnRight = () => {
    const element = document.getElementById(`${postID}width`);
    const computedStyle = window.getComputedStyle(element);
    const width = computedStyle.width;
    if(scrollPosition == fileLength - 1){
      console.log(scrollPosition);
      document.getElementById(`${postID}`).style.transform = 'translateX(0)';
      setScrollPosition(0);
    }
    else{
      console.log(scrollPosition);
      const updatePossition = scrollPosition + 1;
      document.getElementById(`${postID}`).style.transform = `translateX(${updatePossition*(-(width.split('px')[0]))}px)`;
      setScrollPosition(updatePossition);
    }
  }
  const handleTurnLeft = () => {
    const element = document.getElementById(`${postID}width`);
    const computedStyle = window.getComputedStyle(element);
    const width = computedStyle.width;
    if(scrollPosition == 0){
      document.getElementById(`${postID}`).style.transform = `translateX(${(fileLength - 1)*(-(width.split('px')[0]))}px)`;
      setScrollPosition(fileLength - 1);
    }
    else{
      const updatePossition = scrollPosition - 1;
      document.getElementById(`${postID}`).style.transform = `translateX(${updatePossition*-(width.split('px')[0])}px)`;
      setScrollPosition(updatePossition);
    }
  }

  const fetchComment = async (postID) => {
    try{
      const response = await axios.get(`https://dhkptsocial.onrender.com/comments/${postID}`);
      // console.log(response.data.data);
      setCommentList(response.data.data);
    }
    catch(error){
      console.log(error);
    }

  }
  fetchComment(props.postID);
  useEffect(() => {
    fetchVideos(props.postID);
    fetchUser(props.author);
    setDescription(props.description);
    setPostID(props.postID);
    setPost(props.post);
    fetchLike(Cookies.get('customerId'), props.postID);
    fetchComment(props.postID);
  }, [])

  function calculateDaysDifference(publish) {
    // Lấy ngày hiện tại
    const currentDate = new Date();
    const publishDate = new Date(publish);
  
    // Tính số mili giây giữa hai ngày
    const differenceInMilliseconds = Math.abs(currentDate - publishDate);
  
    // Chuyển đổi mili giây sang ngày, giờ, phút
    const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
    // Xuất kết quả theo yêu cầu
    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return 'Vừa đăng';
    }
  }
  return (
    <div className="bg-black my-2 text-white rounded-lg max-w-md mx-auto shadow-2xl md:w-[299px] w-[200px]" id={`${postID}width`}>
        {/* Header của post */}
        <div className="flex items-center p-4">
          <Avatar
            src={`https://dhkptsocial.onrender.com/files/download/${ava_author}`}
            alt={author}
            className="w-10 h-10 rounded-full hover:cursor-pointer"
            onClick={() => navigate(`/users/${authorID}`)}
          />
          <div className="ml-4">
            <h4 className="font-bold text-md md:text-lg">{author}</h4>
            <p className=" text-gray-500 text-sm md:text-md">@{username}</p>
            <p className=" text-gray-500 text-sm md:text-md">{calculateDaysDifference(post.publishDate)}</p>
          </div>
        </div>
        {post.articleStatus === 'active' || post.articleStatus === 'reported'?(
          <div>
            <div className="relative" style={{overflow:"hidden"}}>
              <div className='flex transition duration-500 ease-in-out' id={postID}>
                {files.map((file) => (
                      file.filename.includes(".mp4") ? (
                        <div className='w-[299px] h-[200px]' style={{flex:"none"}}>
                          <video className='object-contain w-full h-full' controls key={file._id} >
                              <source src={`https://dhkptsocial.onrender.com/files/download/${file._id}`} type="video/mp4" />
                          </video>
                        </div>
                          
                      ) : (
                        <div className='w-[299px] h-[200px]' style={{flex:"none"}}>
                          <img className='object-contain w-full h-full' src={`https://dhkptsocial.onrender.com/files/download/${file._id}` } key={file._id}/>
                        </div> 
                      )
                  ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-center space-x-2 pb-2">
                {fileLength != 0 ? (
                  files.map((fileCircle, index) => (
                    index == scrollPosition ? (
                      <div className="w-2 h-2 rounded-full bg-white" key={fileCircle._id}></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-500" key={fileCircle._id}></div>
                    )
                  ))
                ) : (
                  <div className="hidden"></div>
                )}
              </div>
              <div className="absolute inset-y-0 right-0 flex justify-center space-x-2 items-center mr-2">
                <div className="w-6 h-6 rounded-full bg-white bg-opacity-75 flex justify-center items-center hover:ring-2 hover:ring-black" onClick={handleTurnRight} >
                  <FaAngleRight className='text-black text-opacity-75 cursor-pointer'/>
                </div>
              </div>
              <div className="absolute inset-y-0 flex justify-center space-x-4 items-center ml-2">
                <div className="w-6 h-6 rounded-full bg-white bg-opacity-75 flex justify-center items-center hover:ring-2 hover:ring-black" onClick={handleTurnLeft}>
                  <FaAngleLeft className='text-black text-opacity-75 cursor-pointer'/>
                </div>
              </div>
            </div>

            
            <div className="px-4 pb-4">
              <div className='flex-col gap-2'>
                <p className='md:text-md text-sm w-full' onClick={() => setIsHideDescription(!isHideDescription)}>
                  {descriptionPost.length >= 50 && !isHideDescription ? (
                      descriptionPost.slice(0, 50) + '...'
                  ):(
                    descriptionPost
                  )}
                </p>
              </div>
            </div>
          </div>
        ): (
          <div className='w-full flex justify-content text-center'>
            {authorID === Cookies.get('customerId') ? (
              <p className='text-center w-full text-red-500 py-4'>Bài đăng đã bị ẩn vì vi phạm một số nguyên tắc cộng đồng</p>
            ):(
              <p className='text-center w-full text-red-500 py-4'>Bài đăng hiện không khả dụng</p>
            )}
            
          </div>
        )}
      </div>
  )
}

export default CardPostAdmin