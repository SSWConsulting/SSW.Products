import SadYak from "@images/sad-yak.png";
import Image from "next/image";
export default function NotFound() {
  return (
    <div className="flex items-center">
      <div className="grid h-fit grid-cols-2 w-248 mx-auto">
        <Image
          aria-hidden={true}
          className="size-109 rounded-2xl"
          quality={90}
          alt=""
          src={SadYak}
        />
        {/* background: linear-gradient(98.94deg, #CC4141 48.51%, #D699FB 100.38%, #FF778E 178.58%);
         */}
        <div className="flex-col flex justify-center text-white">
          <h1 className="text-6xl  w-fit text-transparent from-50% font-bold via-100% to-180% bg-linear-100 from-ssw-red via-[#D699FB] to-[#FF778E] bg-clip-text">
            404
          </h1>
          <p className="text-xl text-white">
            This page isn’t in our training data. Even our Yak couldn’t generate
            a prediction for it. If you got here through a broken link consider
            YakShaving it!
          </p>
          <p></p>
        </div>
      </div>
      {/* </Container> */}
    </div>
  );
}
