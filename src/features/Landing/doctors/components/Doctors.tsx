import { useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiClient, { api } from "../../../../api/axois";
import type { Doctors, Specialty } from "../../../../api/types";
import DoctorItem from "./../components/DoctorItem";
import { CircleSlash } from "lucide-react";
import { motion } from "framer-motion";
import ErrorPage from "../../../../components/layout/ErrorPage";
interface CustomDoctor extends Doctors {
  ratesAvg: number;
  ratesCount: number;
}
interface PublicDoctorFetchType {
  doctors: CustomDoctor[];
  specialties: Specialty[];
}
const DoctorsSearch = ({ customeClass = "" }: { customeClass?: string }) => {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const fetch = async () => {
    const [doctors, specialties] = await Promise.all([
      apiClient.get(
        api.doctor.public.search +
          `?q=${search.replace("دکتر", "")}&specialty=${specialty}`,
      ),
      apiClient.get(api.doctor.public.specialties),
    ]);

    return {
      doctors: doctors.data,
      specialties: specialties.data,
    } as PublicDoctorFetchType;
  };
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["PublicDoctors", debouncedSearch, specialty],
    queryFn: fetch,
    placeholderData: keepPreviousData,
    gcTime: 1000 * 60 * 5,
    staleTime: 1000 * 30,
  });

  const interval = useRef<number | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const changeSpecialty = (value: string) => {
    setSpecialty(value);
  };
  const changeSearch = (value: string) => {
    if (interval.current) {
      clearTimeout(interval.current);
      interval.current = null;
    }
    interval.current = setTimeout(() => {
      setDebouncedSearch(value);
      setIsLoadingSearch(false);
    }, 1000);
    setIsLoadingSearch(true);
    setSearch(value);
  };
  if (isLoading) return <></>;
  return (
    <>
      <section>
        {error && <ErrorPage />}
        {!error && (
          <div className="flex bgBox relative py-3 shadow rounded-2xl px-4 items-center sm:flex-row flex-col">
            {isLoadingSearch && (
              <div className="absolute -right-1">
                <CircleSlash className="animate-spin" stroke="var(--primery)" />
              </div>
            )}
            <input
              onChange={(e) => changeSearch(e.target.value)}
              value={search}
              type="text"
              placeholder="جستجو بر اساس نام پزشک یا تخصص..."
              className=" border-0! w-full py-4! px-4"
              name=""
              id=""
            />
            {data && (
              <select
                onChange={(e) => changeSpecialty(e.target.value)}
                value={specialty}
                className="py-3 rounded-full px-6 bg-(--foreground-l) sm:w-1/2 w-full "
              >
                <option key={"all"} value="">
                  همه ی تخصص ها
                </option>
                {data.specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.name}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </section>
      {!error && (
        <section className="">
          {!data.doctors.length && (
            <motion.div
              initial={{ y: 50, opacity: 0.3 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex text-center flex-col p-5 max-w-130 mx-auto text-(--foreground) items-center w-full pt-12"
            >
              <div className="flex *:stroke-(--primery) text-[100px] opacity-85">
                🩺🔍
              </div>
              <span className="text-(--main-text) sm:text-3xl text-2xl font-bold">
                هیچ پزشکی پیدا نشد!
              </span>
              <p className="pt-6">
                متأسفیم، پزشکی با این مشخصات یافت نشد. لطفاً عبارت دیگری رو
                جستجو کن یا فیلتر رو تغییر بده.
              </p>
            </motion.div>
          )}
          <ul
            className={`${customeClass ? customeClass : `grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1`} gap-6 `}
          >
            {data?.doctors?.map((doctor, i) => {
              console.log(doctor.id);

              return (
                <DoctorItem
                  id={doctor.id}
                  amount={doctor.consultation_fee}
                  first_name={doctor.user.first_name}
                  last_name={doctor.user.last_name}
                  ratesAvg={doctor.ratesAvg}
                  ratesCount={doctor.ratesCount}
                  specialties={doctor.specialties}
                  key={i}
                />
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
};
export default DoctorsSearch;
