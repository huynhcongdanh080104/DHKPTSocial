import LogoSvg from "./svgs/DHKPTSocial";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FaFacebookMessenger } from 'react-icons/fa';

const Sidebar = () => {
	const data = {
		fullName: "Hoàng",
		username: "hoangphm1101",
		profileImg: "/avatars/boy1.png",
	};

	return (
		<div className='md:flex-[2_2_0] w-1/5 max-w-1/5'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/home' className='flex justify-center md:justify-start'>
					<LogoSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/home'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/chat'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaFacebookMessenger className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Messenger</span>
						</Link>
					</li>
				</ul>

			</div>
		</div>
	);
};
export default Sidebar;