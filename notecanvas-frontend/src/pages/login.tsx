import { useState } from "react";
import { useRouter } from "next/router";

// imports for the login page

export default function LoginPage() {
  //imports router hook from next/router
  const router = useRouter();

  // state for email, if setemail is called then state is updated and rerendered
  const [email, setEmail] = useState("");
    // state for password
  const [password, setPassword] = useState("");

    // function to handle form submission
  function handleSubmit(e: React.FormEvent) {
    // prevent default form submission (if you click enter it will not refresh the page)
    e.preventDefault();
    //append email to local storage
    localStorage.setItem("user", email); // fake login
    //go to editor page
    router.push("/editor");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />
                <button
                    type="submit"
                    className="bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition"
                >
                    Log In
                </button>
            </form>
        </div>

        <div className="w-full max-w-sm flex justify-between text-sm text-black mt-2">
            <a href="#" className="hover:underline">Forgot Password?</a>
            <a href="#" className="hover:underline">Sign Up</a>
        </div>

    </main>
  );
}
