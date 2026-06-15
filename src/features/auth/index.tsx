import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { Otp } from "./Otp";
import { motion } from "framer-motion";
import apiClient, { api } from "../../api/axois";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router";
import Logo from "../../components/common/Logo";

const Auth = () => {
  const [isOtp, setIsOtp] = useState(false);
  const [number, setNumber] = useState<string>("");
  const [timer, setTimer] = useState(0);

  const formButton = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (() => {
      if (location.hash !== "#verify-code") {
        setIsOtp(false);
      }
    })();
  }, [location.hash]);
  useEffect(() => {
    if (isOtp) navigate("#verify-code");
    else navigate("");
  }, [navigate, isOtp]);
  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const formData = new FormData(e.target);
    if (!isOtp) {
      try {
        const response = await apiClient.post(api.auth.main, { number });
        if (!response.data) throw new Error("");
        if (response.data.error === "haveCode") {
          toast.success(
            "کد یکبار مصرف ارسال شده است ! از کد یکبار مصرف قبلی استفاده کنید.",
          );
          setTimer(response.data.time);
          return setIsOtp(true);
        }

        toast.success("کد یکبار مصرف ارسال شد.");
        setTimer(response.data.time);
        setNumber(number);

        return setIsOtp(true);
      } catch {
        /* empty */
      }
      return;
    }

    const code_otp = Array(5)
      .fill("")
      .map((item, i) => {
        item = String(formData.get("otp_" + (i + 1)) || ",");
        return item;
      })
      .join("");
    try {
      const response = await apiClient.post(api.auth.verifyCode, {
        number,
        code: code_otp,
      });
      const { token } = response.data as { token: string };
      localStorage.setItem("token", token);

      toast.success("خوش آمدید.");
      navigate("/app");
    } catch (e) {
      console.error(e);

      // if (isAxiosError(e)) {
      //   console.log(e.response.data.error);

      //   if (e.response.data.error !== "Code incorrect") setIsOtp(false);
      // }
    }
  };
  return (
    <div className="min-h-screen flex justify-center ">
      <form
        onSubmit={submit}
        className="pb-5 bgBox shadow rounded-2xl border border-(--foreground-l) p-3 space-y-6 my-auto max-w-125 w-[90%] "
      >
        <div className="space-y-4">
          <div className="max-w-32 mx-auto">
            <Logo />
          </div>
          <h1 className="text-2xl text-(--primery)">ورود به حساب</h1>
          <p className="border-r-4 pr-4 border-(--primery) text-(--foregorund)">
            به کلینیک هوشمند خوش آمدید
          </p>
        </div>
        <div className="overflow-hidden">
          {!isOtp && (
            <motion.label
              transition={{ delay: 0.1 }}
              initial={{ opacity: 0.0 }}
              animate={{ opacity: 1 }}
              className={`flex flex-col gap-2`}
            >
              <span>شماره تلفن</span>
              <input
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                type="tel"
                pattern="09[0-9]{9}"
                placeholder="09*********"
                title="شماره موبایل باید با 09 شروع شده و 11 رقم باشد"
              />
            </motion.label>
          )}
          {isOtp && (
            <Otp
              timer={timer}
              formButton={formButton}
              isShow={isOtp}
              setIsShow={setIsOtp}
              number={number}
            />
          )}
        </div>
        <button
          ref={formButton}
          type="submit"
          className="primery font-bold w-full "
        >
          {!isOtp && "اراسل کد یکبار مصرف"}
          {isOtp && "ورود"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
