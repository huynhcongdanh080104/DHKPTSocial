import React from "react";

const AttributeSelector = () => {
  return (
    <div className="flex gap-5 justify-between mt-8 max-w-full text-2xl text-center whitespace-nowrap w-[309px]">
      <label className="my-auto tracking-tighter">Size:</label>
      <div className="flex gap-5 items-start">
        <button className="overflow-hidden gap-2.5 self-stretch px-3 py-2.5 rounded-md border border-solid border-zinc-300 min-h-[47px]">
          Xs
        </button>
        <button className="overflow-hidden gap-2.5 self-stretch px-1.5 py-2.5 w-10 tracking-tighter rounded-md border border-solid border-zinc-300 min-h-[47px]">
          S
        </button>
        <button className="overflow-hidden gap-2.5 self-stretch px-1.5 py-2.5 w-10 rounded-md border border-solid border-zinc-300 min-h-[47px]">
          xl
        </button>
        <button className="overflow-hidden gap-2.5 self-stretch p-2.5 rounded-md border border-solid border-zinc-300 min-h-[47px]">
          XS
        </button>
      </div>
    </div>
  );
};

export default AttributeSelector;
