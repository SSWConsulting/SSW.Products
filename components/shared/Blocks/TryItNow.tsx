import Image from "next/image";
import Container from "../../Container";
import { ActionButton } from "./ActionsButton";
import { ButtonSize, ButtonVariant } from "./buttonEnum";
const TryItNow = () => {
  return (
    <Container className="z-0 relative">
      <div className=" text-white z-20 border-2 border-gray-lighter/40 relative w-full max-w-4xl py-12 bg-gray-dark rounded-3xl px-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
          Start recording in 3 easy steps!
        </h2>
        {/* main box */}
        <div className="grid relative z-10 grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-gray-neutral rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-3">1. Pin extension</h3>
            <p className="text-gray-light text-sm mb-4">
              Click the ⋮ at the top right of your browser, then the 📌 next to
              YakShaver.
            </p>
            <div className=" rounded-lg p-2">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Pin extension screenshot"
                width={300}
                height={200}
                className="w-full rounded"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-neutral rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-3">2. Enable devices</h3>
            <p className="text-gray-light text-sm mb-4">
              Click the button below to set up your recording devices.
            </p>
            <div className="flex justify-center mt-12">
              <ActionButton
                className="w-fit text-sm"
                action={{
                  label: "🎙️Enable Mic & Webcam",
                  size: ButtonSize.Large,
                  variant: ButtonVariant.SolidRed,
                  url: "http://localhost:3000/admin/index.html#/~/try-it-now",
                }}
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-neutral rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-3">3. Pin extension</h3>
            <p className="text-gray-light text-sm mb-4">
              Click the ⋮ at the top right of your browser, then the next to
              Screencastify.
            </p>
            <div className="rounded-2xl p-2">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Extension interface screenshot"
                width={300}
                height={200}
                className="w-full rounded"
              />
            </div>
          </div>
        </div>
        {/* background box */}
      </div>
      <div className="absolute bg-gray-dark/20 inset-y-4 rounded-3xl inset-x-8 z-10 -bottom-4"></div>
    </Container>
  );
};

export default TryItNow;
