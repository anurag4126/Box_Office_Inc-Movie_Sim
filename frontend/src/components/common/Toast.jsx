import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../../features/ui/toastSlice";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const Toast = () => {
  const { message, type } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const bgClass =
    type === "success" ? "bg-green-600" :
    type === "error" ? "bg-red-600" :
    "bg-blue-600";

  const Icon =
    type === "success" ? CheckCircle :
    type === "error" ? AlertCircle :
    Info;

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`${bgClass} flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white min-w-[300px]`}>
        <Icon size={20} />
        <p className="flex-1 font-bold">{message}</p>
        <button onClick={() => dispatch(hideToast())} className="hover:opacity-70 transition">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
