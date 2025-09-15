import React from "react";

function NavItem({ icon, text, alt }) {
  return (
    <button className="flex gap-2 items-center p-2.5 bg-white">
      <img src={icon} className="h-[27px] w-[27px] border border-solid border-zinc-400 rounded-[99px]" alt={alt} />
      <span className="text-base text-sm font-semibold tracking-tighter text-black">
        {text}
      </span>
    </button>
  );
}

export default NavItem;
