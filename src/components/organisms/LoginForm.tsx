import { Eye } from "lucide-react";

export default function LoginForm() {
  return (
    <form>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Username / Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
          </div>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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

        <div className="flex justify-end">
          <a
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-blue-500"
          >
            Forgot Password?
          </a>
        </div>

        <div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 px-4 py-3 text-center font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
}
