import * as React from "react";

function Footer(props) {
    return (
        <section className="flex flex-col">
            <header className="bg-fuchsia-800 self-stretch flex w-full flex-col pt-14 pb-16 px-5 max-md:max-w-full">
                <div className="self-center flex w-full max-w-[1090px] flex-col max-md:max-w-full">
                    <div className="flex w-[571px] max-w-full items-start gap-3.5 ml-6 self-start max-md:flex-wrap">
                        <img
                            loading="lazy"
                            src="/img/mmbu23_logo.png"
                            className="aspect-[1.1] object-contain object-center w-[109px] overflow-hidden self-stretch max-w-full"
                            alt="Logo"
                        />
                        <h1 className="text-zinc-100 text-3xl font-semibold max-w-[452px] self-center grow shrink-0 basis-auto my-auto max-md:max-w-full">
                            The Search for <br /> Mr. and Ms. Bicol University 2023
                        </h1>
                    </div>
                    <p className="text-stone-300 text-base w-[622px] max-w-full ml-6 mt-5 self-start">
                        Presented by the Bicol University - University Student Council, MMBU returns this 2023 pulling out all the stops to bring you a show that's bigger, bolder, and avant-garde than ever before.
                    </p>
                    <hr className="bg-zinc-400 self-stretch w-full h-px mt-7 max-md:max-w-full" />
                    <div className="self-center flex w-full max-w-[1025px] items-start justify-between gap-5 mt-4 max-md:max-w-full max-md:flex-wrap max-md:justify-center">
                        <p className="text-stone-300 text-base max-w-[623px] grow shrink-0 basis-auto mt-2.5 self-start max-md:max-w-full">
                            This tabulation web app was developed for Bicol University - University Student Council <br /> by Google Developer Student Clubs Bicol University.
                        </p>
                        <img
                            loading="lazy"
                            src="/img/usc_logo.png" className="aspect-[1.15] object-contain object-center w-[86px] bg-blend-lighten overflow-hidden self-stretch max-w-full"
                            alt="Image 1"
                        />
                        <img
                            loading="lazy"
                            src="/img/gdsc_logover2.png" className="aspect-[1.0] object-contain object-center w-[87px] overflow-hidden self-center max-w-full my-auto"
                            alt="Image 2"
                        />
                    </div>
                </div>
            </header>
        </section>
    );
}

export default Footer;