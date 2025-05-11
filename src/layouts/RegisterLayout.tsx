import { RegisterLayoutProps } from "@/types/RegisterLayout";

export const RegisterLayout = ({ children, description }: RegisterLayoutProps) => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-transparent z-10 flex justify-between items-center px-8 py-4">
        <div className="text-white font-bold text-lg">
          <img src={"/findev-medium-logo.svg"} width={80} height={80} alt="Findev logo" />
        </div>
        <nav className="flex gap-6">
          {/* <a href="/" className="text-white hover:text-gray-200 transition">
            Login
          </a>
          <a href="/contact" className="text-white hover:text-gray-200 transition">
            Contato
          </a> */}
        </nav>
      </header>

      <div className="flex flex-col md:flex-row w-full h-full justify-center items-center bg-zinc-100">
        <div className="w-full h-screen flex flex-col justify-center items-center">
          {children}
        </div>
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#7936CF] to-[#085FA3]">
          <h1 className="text-6xl text-white w-[490px] text-center font-bold font-poppins leading-snug">
            “{description}”
          </h1>
        </div>
      </div>
    </>
  );
};
