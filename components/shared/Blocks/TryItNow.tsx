import Image from "next/image";
import Container from "../../Container";
import { Button } from "../../ui/button";

const TryItNow = () => {
  return (
    <Container>
      <div className=" text-white w-full max-w-4xl bg-[#1e1e1e]/80 rounded-xl p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Start recording in 3 easy steps!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-[#2a2a2a] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">1. Pin extension</h3>
            <p className="text-gray-400 text-sm mb-4">
              Click the ⋮ at the top right of your browser, then the 📌 next to
              YakShaver.
            </p>
            <div className="bg-white/10 rounded-lg p-2">
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
          <div className="bg-[#2a2a2a] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">2. Enable devices</h3>
            <p className="text-gray-400 text-sm mb-4">
              Click the button below to set up your recording devices.
            </p>
            <div className="flex justify-center mt-12">
              <Button className="bg-red-500 hover:bg-red-600 text-white rounded-md py-2 px-4 flex items-center gap-2">
                <span>🎙️</span> Enable Mic & Webcam
              </Button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#2a2a2a] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">3. Pin extension</h3>
            <p className="text-gray-400 text-sm mb-4">
              Click the ⋮ at the top right of your browser, then the next to
              Screencastify.
            </p>
            <div className="bg-white/10 rounded-lg p-2">
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
      </div>
    </Container>
  );
};

export default TryItNow;
