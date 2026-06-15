import Layout from "../layout";
import DoctorsSearch from "./components/Doctors";

const PublicDoctors = () => {
  return (
    <>
      <Layout>
        <main className="flex-1">
          <DoctorsSearch />
        </main>
      </Layout>
    </>
  );
};
export default PublicDoctors;
