import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";
type InputProps = {
  onChange?: (value: string) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  icon: React.ReactNode;
};

const Input = ({
  onChange,
  type,
  icon: Icon,
  className,
  placeholder,
}: InputProps) => {
  return (
    <div className="relative">
      <input
        type={type}
        onChange={(e) => {
          if (!onChange) return;
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className={cn(
          "w-full bg-ssw-charcoal border text-white border-white/20 rounded-lg py-3 px-4 pl-12 placeholder:text-gray-300 focus:outline-none",
          className
        )}
      />
      {Icon}
    </div>
  );
};

const WaitList = () => {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full pt-6 md:pt-12 lg:pt-16">
        <div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                Join the Waitlist
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Be the first to know when we launch our new product. Sign up for
                the waitlist and get exclusive access.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-muted-foreground">People Registered</div>
              </div>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex gap-2">
                <Input
                  icon={
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
                  }
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-lg flex-1"
                />
                <Button type="submit">Join Waitlist</Button>
              </form>
              <p className="text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link
                  href="#"
                  className="underline underline-offset-2"
                  prefetch={false}
                >
                  Terms &amp; Conditions
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Top Waitlisters
            </div>
            <div className="mt-4 grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CrownIcon className="h-5 w-5 text-primary" />
                  <div className="text-lg font-medium">John Doe</div>
                </div>
                <div className="text-muted-foreground">1,000 points</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CrownIcon className="h-5 w-5 text-primary" />
                  <div className="text-lg font-medium">Jane Smith</div>
                </div>
                <div className="text-muted-foreground">950 points</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CrownIcon className="h-5 w-5 text-primary" />
                  <div className="text-lg font-medium">Bob Johnson</div>
                </div>
                <div className="text-muted-foreground">900 points</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CrownIcon className="h-5 w-5 text-primary" />
                  <div className="text-lg font-medium">Sarah Lee</div>
                </div>
                <div className="text-muted-foreground">850 points</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CrownIcon className="h-5 w-5 text-primary" />
                  <div className="text-lg font-medium">Tom Wilson</div>
                </div>
                <div className="text-muted-foreground">800 points</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> */}
    </div>
  );
};

export default WaitList;
