import { useDataContext } from "../context/DataContext";
import Dashboard from "./Dashboard";
import Form from "./Form";
import Header from "./Header";
import Layout from "./Layout";

function Wrapper() {
  const { testData } = useDataContext();

  return (
    <Layout
      Header={<Header />}
      Content={Object.keys(testData).length ? <Dashboard /> : <Form />}
    />
  );
}

export default Wrapper;
