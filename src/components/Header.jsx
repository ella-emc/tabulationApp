import React from "react";

function Header({ headerName }) {
    return (
        <section className="self-stretch bg-gradient-to-r from-fuchsia-200 to-amber-100 flex w-screen flex-col px-5 py-3">
            <header className="flex w-[356px] max-w-full items-start gap-4 ml-40 self-start 
            max-md:ml-2.5">
                < img
                    loading="lazy"
                    src="/img/mmbu23_logo.png" className="aspect-[0.82] object-contain object-center w-[70px] overflow-hidden self-stretch max-w-full"
                    alt="Score Card"
                />
                <h1 className="text-xl font-bold text-purple-900 tracking-wider bg-clip-text self-center grow shrink-0 basis-auto my-auto">
                    MMBU 2023 {headerName}
                </h1>
            </header >
        </section >
    );
}

export default Header;