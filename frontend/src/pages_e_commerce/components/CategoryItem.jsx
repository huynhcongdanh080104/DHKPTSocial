import React from "react";

function CategoryItem({ name, imageUrl, bgColorClass }) {
  return (
    <article className="flex flex-col self-stretch pb-2.5 my-auto w-[167px]">
      <div
        className={`flex flex-col justify-center items-center px-4 ${bgColorClass} rounded-full border border-solid border-zinc-400 border-opacity-30 h-[167px] w-[167px] max-md:px-5`}
      >
        <img
          src={imageUrl}
          alt={name}
          className="object-contain aspect-square w-[101px]"
        />
      </div>
      <h3 className="self-center mt-3 text-2xl font-semibold tracking-tighter text-center text-black">
        {name}
      </h3>
    </article>
  );
}

export default CategoryItem;
