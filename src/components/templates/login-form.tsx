import { Eye } from "lucide-react";

export default function LoginForm() {
  return (
    <form>
      <div className="space-y-6 px-[50px] pt-4">
        <div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Username"
            required
            className="rounded-[8px] border border-[#D9D9D9] shadow-sm placeholder: p-3 text-[14px] text-[#03111F] font-normal leading-[19.36px] pl-3 outline-blue-500 w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between"></div>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              required
              className="rounded-[8px] border border-[#D9D9D9] shadow-sm placeholder: p-3 text-[14px] text-[#03111F] font-normal leading-[19.36px] pl-3 outline-blue-500 w-full"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"
              aria-label="Toggle password visibility"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#5291CD] text-[#FFFFFF] text-[18px] font-semibold px-8 py-2 rounded-[10px]"
          >
            Login
          </button>
        </div>
        <div className="flex justify-center">
          <a
            href="#"
            className="text-sm font-medium hover:text-blue-500 text-[#5291CD]"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </form>
  );
}
