import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LockIcon, MailIcon, User2Icon } from "lucide-react";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const Signup = () => {
 const { navigate, axios, loading, setLoading, isAuth } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/auth/register",
        formData,
        { withCredentials: true }
      );

     if (data.success) {
  toast.success(data.message);
  await isAuth();   // ✅ refresh auth state
  navigate("/");
}
     else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[350px] text-center border border-zinc-300/60 dark:border-zinc-700 rounded-2xl px-8 bg-white dark:bg-zinc-900"
      >
        <h1 className="text-zinc-900 dark:text-white text-3xl mt-10 font-medium">
          Register
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 pb-6">
          Please sign up to continue
        </p>

        <div className="flex items-center w-full mt-4 bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full pl-6 gap-2">
          <User2Icon className="text-white" />
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={onChangeHandler}
            required
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>

        <div className="flex items-center w-full mt-4 bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full pl-6 gap-2">
          <MailIcon className="text-white" />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            required
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>

        <div className="flex items-center w-full mt-4 bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full pl-6 gap-2">
          <LockIcon className="text-white" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
            required
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full bg-orange-500 text-white"
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <p className="text-sm mt-4">
          Already have an account?
          <Link to="/login" className="text-indigo-500 ml-1">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
