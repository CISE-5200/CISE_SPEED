import { GetUserFromContext } from "@/lib/auth";
import { GetServerSideProps, NextPage } from "next";

const AdminPage: NextPage = () => {
  return (
    <div className="container">
      <h1>Admin</h1>
    </div>
  );
};

export const getServerSideProps : GetServerSideProps = async (ctx) => {
  const user = await GetUserFromContext(ctx);

  if(user === null)
  {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
  else
  {
    return {
      props: {},
    };
  }
}

export default AdminPage;