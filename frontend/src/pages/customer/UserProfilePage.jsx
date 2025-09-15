import React, { useEffect, useState } from "react";
import setting from '../../assets/setting.png';
import activity_1 from '../../assets/activity_1.png';
import activity_2 from '../../assets/activity_2.png';
import bookmark_1 from '../../assets/bookmark_1.png';
import bookmark_2 from '../../assets/bookmark_2.png';
import heart from '../../assets/heart.png';
import comment from '../../assets/comment.png';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Avatar } from "@chakra-ui/react";
import Spiner from "../../components/Spiner";
import FollowersModal from "../../components/FollowersModal";
import FollowingsModal from "../../components/FollowingsModal";

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' Tr'; // Ví dụ: 1200000 -> 1.2 Tr
  } else if (num >= 10000) {
    return Math.floor(num / 1000) + ' N'; // Ví dụ: 11000 -> 11 N
  } else {
    return num.toLocaleString(); // Hiển thị số bình thường cho các giá trị nhỏ hơn 10,000
  }
};

const UserAccount = () => {
  // const { posts } = PostData();
  const [user, setUser] = useState([]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [description, setDescription] = useState("");
  const [activeSection, setActiveSection] = useState('posts');
  const [followed, setFollowed] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(12); // Khởi tạo với 12 bài viết
  const [loading, setLoading] = useState(true); 
  const [loadingFollow, setLoadingFollow] = useState(false); 
  const [loadedAll, setLoadedAll] = useState(false); // Trạng thái kiểm tra đã tải hết hay chưa
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [isChangeAvatarModalOpen, setIsChangeAvatarModalOpen] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingsModalOpen, setIsFollowingsModalOpen] = useState(false);
  const enqueueSnackbar = useSnackbar();
  const userId = Cookies.get("customerId");
  const params = useParams();
  const navigate = useNavigate();

  const[posts,setPosts] = useState([]);
  const[bookmarks, setBookmarks] = useState([]);

  function fetchUser() {
    setLoading(true);
    try {
      axios.get(`https://dhkptsocial.onrender.com/users/${params.id}`)
      .then((response) => {
        setUser(response.data);
        setUsername(response.data.username);
        setDescription(response.data.description);
        setAvatar(response.data.avatar);
        setName(response.data.name);
        if (response.data.followers.length == 0 || !response.data.followers.some(follower => follower._id === Cookies.get("customerId"))) setFollowed(false);
        setLoading(false);
        setLoadingFollow(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  const fetchPost = async (userId) => {
    let postList = [];
    const responsePost = await axios.get(`https://dhkptsocial.onrender.com/articles/${userId}`);
    // console.log(responsePost.data.data)
    try{
      let postList = [];
      for(let i = 0; i < responsePost.data.data.length; i++){
        // console.log(responsePost.data.data[i]._id);
        const responseImage = await axios.get(`https://dhkptsocial.onrender.com/files/${responsePost.data.data[i]._id}`);
        const postItem = {
          id: responsePost.data.data[i]._id,
          likes: responsePost.data.data[i].numberOfLike,
          comments: responsePost.data.data[i].numberOfComment,
          image: responseImage.data[0]._id,
          author: responsePost.data.data[i].userID,
          articleStatus: responsePost.data.data[i].articleStatus,
          publishDate: responsePost.data.data[i].publishDate,
          description: responsePost.data.data[i].description
        }
        postList.push(postItem);
      }
      setPosts(postList);
    }
    catch(error){
      console.log(error);
    }
    
}
  const handlePost = (post) => {
    const data = {
      _id: post.id,
      numberOfLike: post.likes,
      numberOfComment: post.comments,
      userID: post.author,
      articleStatus: post.articleStatus,
      publishDate: post.publishDate,
      description: post.description,
    }
    navigate('/article', {state: {data}});
  }

  useEffect(() => {
    fetchPost(params.id);
    fetchUser();
  }, [params.id]);

  const followHandler = () => {
    setLoadingFollow(true)
    try {
      axios.post(`https://dhkptsocial.onrender.com/users/follow/${params.id}`, 
        {loggedInUserId: userId},
        { withCredentials: true } // gửi với token
      )
      .then((response) => {
        if(followed){
          const notify = {
            user: params.id,
            actor: Cookies.get('customerId')
          };
          axios.delete('https://dhkptsocial.onrender.com/notifications', { data: notify })
          .then((response) => {
            setFollowed(!followed);
            fetchUser();
          });
        }
        else if(!followed){
          const notification = {
            user: params.id,
            actor: Cookies.get('customerId'),
            actionDetail: 'đã theo dõi bạn',
          };
          axios.post('https://dhkptsocial.onrender.com/notifications', notification)
          .then((response) => {
            setFollowed(!followed);
            fetchUser();
          });
        }
      });
      
      

    } catch (error) {
      console.log(error);
      setLoadingFollow(false);
    }
  };

  

  useEffect(() => {
    
    if (params.id === userId) {
      navigate('/home');
    }
  }, [user]);

  async function followData() {
    try {
      const { data } = await axios.get(`https://dhkptsocial.onrender.com/users/followdata/${params.id}`,
      {withCredentials: true}
      );
      setFollowersData(user.followers.length);
      setFollowingsData(user.followings.length);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    followData();
  }, [user]);

  return (
    <div className="w-full h-screen bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="lg:w-4/6 mx-auto p-5 bg-black">
        <div className="flex flex-col lg:flex-row justify-center items-stretch lg:justify-between">
        {/* Profile Information */}
        <div className="w-full lg:w-1/3 h-auto flex justify-center items-center">
          <div className="flex justify-center items-center">
          <Avatar size="2xl" className="w-full h-full rounded-full object-cover" src={`https://dhkptsocial.onrender.com/files/download/${avatar}`} alt="profile"/>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col items-center lg:items-start mt-3 lg:flex-grow gap-4 lg:w-2/3">
          <div className="flex flex-col items-center lg:items-start gap-3 mt-3 lg:mt-0">
            <div className="flex flex-col lg:flex-row flex-wrap justify-center lg:justify-start items-center gap-3">
              <div className="text-white text-lg font-medium flex">{username}</div>
              {user._id !== userId && (
                <button
                  onClick={followHandler}
                  disabled={loadingFollow}
                  className={`p-1 text-white rounded-md ${followed ? "bg-red-500" : "bg-blue-400"}`}
                >
                  {loadingFollow ? <Spiner /> : (followed ? "UnFollow" : "Follow")}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 text-center lg:text-left">
            <div className="flex flex-row items-center cursor-pointer">
              <span className="text-white text-base font-medium">{formatNumber(posts ? posts.length : 0)} bài viết</span>
            </div>
            <div className="flex flex-row items-center cursor-pointer">
              <span className="text-white text-base font-medium" onClick={() => setIsFollowersModalOpen(true)}>
              {formatNumber(followersData)} người theo dõi
              </span>
            </div>
            <div className="flex flex-row items-center cursor-pointer">
              <span className="text-white text-base font-medium" onClick={() => setIsFollowingsModalOpen(true)}>
                Đang theo dõi {formatNumber(followingsData)} người dùng
              </span>
            </div>
          </div>

          {/* Modals */}
          <FollowingsModal
              isOpen={isFollowingsModalOpen}
              onClose={() => setIsFollowingsModalOpen(false)}
              followings={user.followings}
            />
            <FollowersModal
              isOpen={isFollowersModalOpen}
              onClose={() => setIsFollowersModalOpen(false)}
              followers={user.followers}
            />
          {/* User Bio */}
          <div className="text-center lg:text-left" style={{ fontSize: "20px" }}>
            <div className="text-white font-medium text-lg">{name}</div>
            <div className="text-white font-medium text-base">{description}</div>
          </div>
        </div>
      </div>

        {/* Divider */}
        <div className="w-full h-1 bg-gray-700 my-5"></div>

        {/* Tab Section */}
        <div className="flex flex-col gap-5 mb-5">
          <div className="justify-center items-center gap-[50px] inline-flex">
            <div 
              className={`justify-center items-center gap-1 flex cursor-pointer ${activeSection === 'posts' ? 'text-white' : 'text-[#949696]'}`}
              onClick={() => setActiveSection('posts')}
            >
              <img src={activeSection === 'posts' ? activity_1 : activity_2} alt="Post icon" className="w-5 h-5 mr-1" />
              <div className="text-[18px] font-semibold">BÀI VIẾT</div>
            </div>
            <div 
              className={`justify-center items-center gap-1 flex cursor-pointer ${activeSection === 'bookmarks' ? 'text-white' : 'text-[#949696]'}`}
              onClick={() => setActiveSection('bookmarks')}
            >
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-1 justify-center">
          {(activeSection === 'posts' ? posts : bookmarks).slice(0, visiblePosts).map((post, index) => (
            <div key={index} className="relative w-full group" onClick={() => handlePost(post)}>
              <div className="w-full h-0 pb-[100%] relative">
                <img src={`https://dhkptsocial.onrender.com/files/download/${post.image}`} alt={`Post ${index}`} className="absolute top-0 left-0 w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-row gap-3">
                  <div className="flex items-center">
                    <img src={heart} alt="Likes" className="w-4 h-4 mr-1"/>
                    <span className="text-white font-medium text-base">{formatNumber(post.likes)}</span>
                  </div>
                  <div className="flex items-center">
                    <img src={comment} alt="Comments" className="w-4 h-4 mr-1"/>
                    <span className="text-white font-medium text-base">{formatNumber(post.comments)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



export default UserAccount;
