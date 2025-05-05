import Logo from "./logo";
import LoginForm from "./login-form";
import AchievementBanner from "./achievement-banner";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Section - Background and Branding */}
      <div className="relative hidden w-3/5 bg-gradient-to-br from-blue-100 to-blue-200 lg:block">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border-[40px] border-blue-50/30"></div>
          <div className="absolute -bottom-20 right-20 h-[300px] w-[300px] rounded-full border-[30px] border-blue-50/30"></div>
        </div>

        <div className="relative p-8">
          <Logo />

          <div className="mt-64 px-12">
            <AchievementBanner />
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-2/5">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-bold">Welcome back</h1>
            <p className="mt-2 text-gray-600">
              Login to your account to access portal
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
