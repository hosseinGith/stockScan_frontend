import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Headset, CalendarCheck, Folder, Video, Pill } from "lucide-react";
import { NavLink } from "react-router";
import Layout from "./layout";

const LandingPage = () => {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 75 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <Layout>
        <main className="space-y-12 mt-20 mx-auto">
          {/* بخش اول - Hero */}
          <motion.section
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <div className="text-(--primery) text-sm font-bold px-4 py-2 bg-(--primery-vl) w-max mx-auto rounded-2xl">
              سیستم نوبت‌دهی هوشمند
            </div>
          </motion.section>

          <motion.section
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="flex md:flex-row flex-col justify-between gap-12 pb-8"
          >
            <div className="space-y-6">
              <div className="text-5xl flex font-bold flex-col items-center whitespace-nowrap">
                <span>سلامت تو،</span>
                <span>اولویت ماست.</span>
              </div>
              <p className="text-(--foreground) max-w-125 text-center mx-auto">
                کلینیک آترینا با ۱۲ سال تجربه و ۱۵ پزشک فوق‌تخصص، مسیر درمان رو
                برات ساده کرده. نوبت بگیر، مشاوره آنلاین ببین، پرونده الکترونیک
                داشته باش.
              </p>
              <div className="pr-6 space-x-4 whitespace-nowrap">
                <NavLink
                  to={"/app"}
                  className="button primery px-9! shadow-lg hover:-translate-y-1 transition inline-block"
                >
                  نوبت بگیر
                </NavLink>
                <NavLink
                  to={"/app"}
                  className="button border-2 px-6! border-(--foreground-l) shadow-lg"
                >
                  مشاوره رایگان
                </NavLink>
              </div>
            </div>
            <div className="flex md:justify-end justify-center">
              <div className="shadow-2xl p-12 flex items-center justify-center flex-col rounded-[50px] bg-(--primery-vl) lg:w-120">
                <Headset size={120} />
                <span>پزشکت همیشه همراهته</span>
              </div>
            </div>
          </motion.section>

          {/* بخش آمارها */}
          <motion.section
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="flex py-7 px-6! max-w-200! justify-between flex-wrap bg-(--primery-vl) mx-auto rounded-full *:flex *:flex-col  *:items-center *:w-max *:mx-auto gap-8"
          >
            <div>
              <span className="text-(--primery) text-4xl" dir="ltr">
                +15
              </span>
              <span className="text-(--foreground-h)">پزشک متخصص</span>
            </div>
            <div>
              <span className="text-(--primery) text-4xl" dir="ltr">
                +52k
              </span>
              <span className="text-(--foreground-h)">بیمار راضی</span>
            </div>
            <div>
              <span className="text-(--primery) text-4xl" dir="ltr">
                سال 12
              </span>
              <span className="text-(--foreground-h)">تجربه درخشان</span>
            </div>
            <div>
              <span className="text-(--primery) text-4xl" dir="ltr">
                24 / 7
              </span>
              <span className="text-(--foreground-h)">پشتیبانی آنلاین</span>
            </div>
          </motion.section>

          {/* بخش خدمات */}
          <motion.section
            ref={servicesRef}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center space-y-4"
          >
            <div className="text-4xl font-bold">خدمات پیشرفته</div>
            <p className="">تکنولوژی روز دنیا در خدمت سلامتی شما</p>
            <div className="flex *:max-w-60 *:hover:-translate-y-2 *:transition **:stroke-(--primery) *:shadow *:rounded-2xl *:p-4 justify-between items-center flex-wrap max-w-[90%] mx-auto rounded-4xl p-4 *:flex *:flex-col *:items-center *:mx-auto *:border *:w-full *:border-(--foreground-l) gap-8">
              <div>
                <CalendarCheck size={90} />
                <span className="text-lg font-bold">نوبت‌دهی هوشمند</span>
                <span className="text-sm">بدون تماس، بدون اتلاف وقت.</span>
              </div>
              <div>
                <Folder size={90} />
                <span className="text-lg font-bold">پرونده الکترونیک</span>
                <span className="text-sm">سوابق پزشکی همیشه در دسترس..</span>
              </div>
              <div>
                <Video size={90} />
                <span className="text-lg font-bold">مشاوره آنلاین</span>
                <span className="text-sm">ویزیت ویدئویی از خانه.</span>
              </div>
              <div>
                <Pill size={90} />
                <span className="text-lg font-bold">نسخه دیجیتال</span>
                <span className="text-sm">دریافت نسخه بدون کاغذ.</span>
              </div>
            </div>
          </motion.section>

          {/* بخش CTA */}
          <motion.section
            ref={ctaRef}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <div
              className="text-white text-center flex items-center flex-col px-2 mx-auto rounded-4xl py-4 space-y-6"
              style={{
                background: "linear-gradient(105deg, #2b7aff, #5a3dff)",
              }}
            >
              <span className="text-2xl">آماده شروع مسیر سلامتی‌ای؟</span>
              <p>همین الان ثبت‌نام کن و از خدمات ویژه استفاده کن.</p>
              <NavLink
                to="/app"
                className="button bg-white text-(--primery) px-6! inline-block text-xl font-bold"
              >
                ورود رایگان
              </NavLink>
            </div>
          </motion.section>
        </main>
      </Layout>
    </>
  );
};
export default LandingPage;
