import { useState, useEffect } from 'react';
import img1 from '../../assets/img_1.jpg';
import img2 from '../../assets/img_2.jpg';
import img3 from '../../assets/img_3.jpg';
import img4 from '../../assets/img_4.jpg';
import img5 from '../../assets/img_5.jpg';
import img6 from '../../assets/img_6.jpg';
import img7 from '../../assets/img_7.jpg';
import img8 from '../../assets/img_8.jpg';
// import avatar from '../../assets/avt.jpg';
import activity_1 from '../../assets/activity_1.png';
import activity_2 from '../../assets/activity_2.png';
import bookmark_1 from '../../assets/bookmark_1.png';
import bookmark_2 from '../../assets/bookmark_2.png';
import heart from '../../assets/heart.png';
import comment from '../../assets/comment.png';
import setting from '../../assets/setting.png';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ChangeAvatarModal from '../../components/ChangeAvatarModal';
import FollowersModal from '../../components/FollowersModal';
import FollowingsModal from '../../components/FollowingsModal';
import { Avatar } from '@chakra-ui/react';
// const posts = [
//   { image: img1, likes: 474000, comments: 24000 },
//   { image: img2, likes: 1200000, comments: 45293 },
//   { image: img3, likes: 567237, comments: 56200 },
//   { image: img4, likes: 362478, comments: 24888 },
//   { image: img5, likes: 1340753, comments: 6782 },
//   { image: img6, likes: 568328, comments: 550 },
//   { image: img7, likes: 28892, comments: 7535 },
//   { image: img8, likes: 562883, comments: 16243 },
//   { image: img1, likes: 474000, comments: 24000 },
//   { image: img2, likes: 1200000, comments: 45293 },
//   { image: img3, likes: 567237, comments: 56200 },
//   { image: img4, likes: 362478, comments: 24888 },
//   { image: img5, likes: 1340753, comments: 6782 },
//   { image: img6, likes: 568328, comments: 550 },
//   { image: img7, likes: 28892, comments: 7535 },
//   { image: img8, likes: 562883, comments: 16243 },
//   { image: img1, likes: 474000, comments: 24000 },
//   { image: img2, likes: 1200000, comments: 45293 },
//   { image: img3, likes: 567237, comments: 56200 },
//   { image: img4, likes: 362478, comments: 24888 },
//   { image: img5, likes: 1340753, comments: 6782 },
//   { image: img6, likes: 568328, comments: 550 },
//   { image: img7, likes: 28892, comments: 7535 },
//   { image: img8, likes: 562883, comments: 16243 },
// ];

// const bookmarks = [
//   { image: img2, likes: 474000, comments: 24000 },
//   { image: img1, likes: 250000, comments: 45293 },
//   { image: img3, likes: 567237, comments: 56200 },
//   { image: img3, likes: 362478, comments: 24888 },
//   { image: img6, likes: 1340753, comments: 6782 },
//   { image: img8, likes: 568328, comments: 3550 },
// ];

// const user = [
//   {
//     avatar:'../../assets/avt.jpg' ,
//     name: 'fourth.ig',
//     fullname: 'Nattawat Jirochtikul',
//     bio: [
//       '@numone_official',
//       '🐾 @munmuang.ig',
//       '0639796424, 026699079',
//       'GMMTVARTISTS@GMAIL.COM',
//     ],
//     posts: 497,
//     followers: 3500000,
//     following: 1006
//   },
// ];

// Hàm định dạng số lượng theo dõi
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' Tr'; // Ví dụ: 1200000 -> 1.2 Tr
  } else if (num >= 10000) {
    return Math.floor(num / 1000) + ' N'; // Ví dụ: 11000 -> 11 N
  } else {
    return num.toLocaleString(); // Hiển thị số bình thường cho các giá trị nhỏ hơn 10,000
  }
};

const ProfilePage = () => {
  const [user, setUser] = useState('');
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [description, setDescription] = useState("");
  const [activeSection, setActiveSection] = useState('posts');
  const [visiblePosts, setVisiblePosts] = useState(12); // Khởi tạo với 12 bài viết
  const [loading, setLoading] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false); // Trạng thái kiểm tra đã tải hết hay chưa
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [isChangeAvatarModalOpen, setIsChangeAvatarModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false); // Thay đổi tên cho rõ ràng
  const [isFollowingsModalOpen, setIsFollowingsModalOpen] = useState(false); // Modal cho Đang theo dõi
  // const [previewAvatar, setPreviewAvatar] = useState(null);
  const enqueueSnackbar = useSnackbar();
  const userId = Cookies.get("customerId");

  const[posts,setPosts] = useState([]);
  const[bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  const handleLoadMorePosts = () => {
    if (!loading && !loadedAll) {
      setLoading(true);
      setTimeout(() => {
        if (visiblePosts < (activeSection === 'posts' ? posts.length : bookmarks.length)) {
          setVisiblePosts((prev) => prev + 12);
        } else {
          setLoadedAll(true); // Đánh dấu đã tải hết
        }
        setLoading(false);
      }, 1000); // Thời gian giả lập tải
    }
  };
  async function followData() {
    try {
      const { data } = await axios.get(`https://dhkptsocial.onrender.com/users/${userId}`, {
        withCredentials: true, // hoặc dùng headers nếu cần thêm token
      });     
      setFollowersData(data.followers.length);
      setFollowingsData(data.followings.length);
      setUser(data);
    } catch (error) {
      console.log(error);
      console.log("Error fetching user data", error);
    }
  }

  const { id } = useParams();
  useEffect(() => {
    fetchPost(Cookies.get('customerId'));
    // console.log(id);
    
      const fetchUserData = async () => {
        if (!userId) return;
  
        try {
          const response = await axios.get(
            `https://dhkptsocial.onrender.com/users/${userId}`
          );
          const user = response.data;
          // console.log("User Data:", user);
          setUsername(user.username);
          setDescription(user.description);
          setAvatar(user.avatar);
          setName(user.name);
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      };
  
      fetchUserData();
      followData();
  
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        handleLoadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, visiblePosts, loadedAll, userId]); 
  
  const handleAvatarChange = (newAvatar) => {
    setAvatar(newAvatar);
    updateAvatar(newAvatar)
  };
  const updateAvatar = async (newAvatar) => {
    try {
      const userId = Cookies.get('userId'); 
      const formData = new FormData();
      formData.append("avatar", newAvatar); 
  
      const response = await axios.put(
        `https://dhkptsocial.onrender.com/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      enqueueSnackbar('Thêm ảnh thành công', {variant : 'success'})
    } catch (error) {
      console.error("Error updating avatar", error);
    }
  };
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

  return (
    <div className="lg:w-5/6 mx-auto p-5 bg-black" >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-center items-stretch lg:justify-between">
        {/* Profile Information */}
        <div className="w-full lg:w-1/3 h-auto flex justify-center items-center">
          <div className="flex justify-center items-center">
            <Avatar
              size="2xl"
              className="w-full h-full rounded-full object-cover cursor-pointer"
              src={`https://dhkptsocial.onrender.com/files/download/${avatar}`}
              alt="profile"
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col items-center lg:items-start mt-3 lg:flex-grow gap-4 lg:w-2/3">
          <div className="flex flex-col items-center lg:items-start gap-3 mt-3 lg:mt-0">
            <div className="flex flex-col lg:flex-row flex-wrap justify-center lg:justify-start items-center gap-3">
              <div className="text-white text-lg font-medium flex">{username}</div>
              <button className="p-2 bg-[#212425] rounded-lg text-base font-medium text-white hover:bg-[#3a3d40]">
                <Link to={`/edit/${userId}`}>Chỉnh sửa trang cá nhân</Link>
              </button>
              <img
                src={setting}
                className="cursor-pointer"
                style={{ width: "30px", height: "30px" }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 text-center lg:text-left">
            <div className="flex flex-row items-center cursor-pointer">
              <span className="text-white text-base font-medium">{posts.length} bài viết</span>
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
          {/* <ChangeAvatarModal
            isOpen={isChangeAvatarModalOpen}
            onClose={() => setIsChangeAvatarModalOpen(false)}
            currentAvatar={`data:image/jpeg;base64,${avatar}`} // Pass the current avatar to the modal
            onAvatarChange={handleAvatarChange} // Hàm xử lý thay đổi avatar
          /> */}
          <FollowingsModal
            isOpen={isFollowingsModalOpen}
            onClose={() => setIsFollowingsModalOpen(false)}
            followings={user.followings} // Hàm xử lý thay đổi avatar
          />
          <FollowersModal
            isOpen={isFollowersModalOpen}
            onClose={() => setIsFollowersModalOpen(false)}
            followers={user.followers} // Hàm xử lý thay đổi avatar
          />
          {/* User Bio */}
          <div className="text-center lg:text-left" style={{ fontSize: "20px" }}>
            <div className="text-white font-medium text-lg">{name}</div>
            <div className="text-white font-medium text-base">{description}</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 bg-gray-700 my-3"></div>

      {/* Tab Section */}
      <div className="flex flex-col gap-3">
        <div className="justify-center items-center gap-[59px] inline-flex">
          <div 
            className={`justify-center items-center gap-1 flex cursor-pointer ${activeSection === 'posts' ? 'text-white' : 'text-[#949696]'}`}
            onClick={() => {
              setActiveSection('posts');
              setVisiblePosts(12); // Reset số bài viết khi chuyển tab
              setLoadedAll(false); // Reset trạng thái đã tải hết
            }}
          >
            <img src={activeSection === 'posts' ? activity_1 : activity_2} alt="Post icon" className="w-5 h-w-5"/>
            <div className="text-base font-medium">BÀI VIẾT</div>
          </div>
          <div 
            className={`justify-center items-center gap-1 flex cursor-pointer ${activeSection === 'bookmarks' ? 'text-white' : 'text-[#949696]'}`}
            onClick={() => {
              setActiveSection('bookmarks');
              setVisiblePosts(12); // Reset số bài đã lưu khi chuyển tab
              setLoadedAll(false); // Reset trạng thái đã tải hết
            }}
          >
            {/* <img src={activeSection === 'bookmarks' ? bookmark_2 : bookmark_1} alt="Bookmark icon" className="w-5 h-w-5"/>
            <div className="text-base font-medium">ĐÃ LƯU</div> */}
          </div>
        </div>

        {/* Posts Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 justify-center">
          {(activeSection === 'posts' ? posts : bookmarks).slice(0, visiblePosts).map((post, index) => (
            <div key={index} className="relative w-full group" onClick={() => handlePost(post)}>
              <div className="w-full h-0 pb-[100%] relative"> {/* Tạo tỷ lệ 1:1 cho hình vuông */}
                <img src={`https://dhkptsocial.onrender.com/files/download/${post.image}`} alt={`Post ${index}`} className="absolute top-0 left-0 w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-row gap-3">
                  <div className="flex items-center">
                    <img src={heart} alt="Likes" className="w-5 h-5 mr-1"/>
                    <span className="text-white font-medium text-base">{formatNumber(post.likes)}</span>
                  </div>
                  <div className="flex items-center">
                    <img src={comment} alt="Comments" className="w-5 h-5 mr-1"/>
                    <span className="text-white font-medium text-base">{formatNumber(post.comments)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Loading Indicator */}
        {loading && <div className="text-center text-white font-medium text-base">Đang tải...</div>}
        {!loadedAll && !loading && (
          <button
            onClick={handleLoadMorePosts}
            className="w-full p-3 bg-[#0077c5] rounded-lg text-white font-medium text-base hover:bg-[#005ea3]"
          >
            Tải thêm bài viết
          </button>
        )}
        {loadedAll && <div className="text-center text-white font-medium text-base">Đã tải hết bài viết</div>}
      </div>
    </div>
  );
};

export default ProfilePage;
