import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";

const EditProfilePage = () => {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const userId = Cookies.get("customerId");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  // const token = Cookies.get("token"); // Lấy token từ cookie

  useEffect(() => {  
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `https://dhkptsocial.onrender.com/users/${userId}`
        );
        console.log(response.data);
        const user = response.data;
        setUsername(user.name);
        setEmail(user.email);
        setDescription(user.description);
        setAvatar(user.avatar);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (avatar == null) {
      console.log(username);
      console.log(description);
      // const data = {
      //   name: username,
      //   description: description
      // }
      // axios.put(`https://dhkptsocial.onrender.com/users/${Cookies.get("customerId")}`, data)
      // .then((response) => {
      //   enqueueSnackbar('Cập nhật thông tin thành công', { variant: 'success' });
      //   navigate('/home');
      // })
    }
    else if(avatar != null){
      const formDataAvatar = new FormData();
      formDataAvatar.append('avatar', avatar);
      axios.post('https://dhkptsocial.onrender.com/files/upload/avatar', formDataAvatar, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        })
      .then((response) => {
        // console.log(username);
        // console.log(description);
        // console.log('Last file uploaded successfully:', response.data.file);
        // console.log(response.data.file._id);
        const dataUpdate = {
          name: username,
          description: description,
          avatar: response.data.file._id
        }
        axios.put(`https://dhkptsocial.onrender.com/users/edit/${Cookies.get("customerId")}`, dataUpdate)
        .then((response) => {
          console.log(response.data);
          enqueueSnackbar('Cập nhật thông tin thành công', { variant: 'success' });
          navigate('/home');
        })
      })
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewAvatar(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500">
      <div className="bg-[rgb(30,30,30)] text-white p-6 rounded-3xl shadow-lg w-full max-w-4xl flex flex-col lg:flex-row gap-6">
        
        {/* Phần Avatar */}
        <div className="flex  flex-col items-center  lg:w-1/3 mb-6 lg:mb-0 mt-16">
          <div className="w-40 h-40 mb-4 ">
            {avatar && !previewAvatar && (
              <Avatar
                size={'2xl'}
                src={`data:image/jpeg;base64,${avatar}`}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover "
              />
            )}
            {previewAvatar && (
              <Avatar
                size={'2xl'}
                src={previewAvatar}
                alt="Avatar Preview"
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>
          <input
            type="file"
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-700 file:text-white hover:file:bg-purple-600"
            onChange={handleAvatarChange}
            accept="image/*"
          />
        </div>

        {/* Phần Thông Tin Cá Nhân */}
        <div className="info-section lg:w-2/3">
          <h2 className="text-2xl font-bold text-center mb-6">
            Thay Đổi Thông Tin Cá Nhân
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 rounded bg-gray-800 text-gray-400 border border-gray-700"
                value={email}
                disabled
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1">
                Tiểu sử
              </label>
              <input
                type="text"
                id="description"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-3xl font-bold"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
