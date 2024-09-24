import { Alert, Form as AndForm, Button, DatePicker, Input, Spin } from "antd";
import { useDataContext } from "../context/DataContext";

function Form() {
  const {
    requestData,
    setInitialData,
    setData,
    setChartData,
    isLoading,
    setIsloading,
    setError,
    error,
  } = useDataContext();

  console.log("errorerrorerror", error);

  const onFinish = async (values) => {
    console.log("values", values);
    setIsloading(true);
    const newData = await requestData(values, setIsloading, setError);
    setInitialData(newData);
    setData(newData);
    setChartData(newData);
    setIsloading(false);
    setError(null);
  };

  const onFinishFailed = async (errorInfo) => {
    setIsloading(false);
    console.error("Failed:", errorInfo);
  };
  return (
    <AndForm
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: "100%", marginTop: "2.4rem" }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
    >
      <AndForm.Item
        label="Date Range"
        name="dateRange"
        rules={[{ required: true, message: "Please Select Both Dates" }]}
        style={{ marginTop: "2rem" }}
      >
        <DatePicker.RangePicker
          style={{ width: "60%" }}
          format="YYYY-MM-DD"
          disabled={isLoading}
        />
      </AndForm.Item>

      <AndForm.Item
        label="Market Name"
        name="market"
        rules={[
          {
            required: true,
            message: "Please input the market name!",
          },
        ]}
        style={{ marginTop: "2rem" }}
      >
        <Input style={{ width: "60%" }} disabled={isLoading} />
      </AndForm.Item>

      <AndForm.Item
        label="Model Name"
        name="policies"
        rules={[
          {
            required: true,
            message: "Please input the model name!",
          },
        ]}
        style={{ marginTop: "2rem" }}
      >
        <Input style={{ width: "60%" }} disabled={isLoading} />
      </AndForm.Item>

      <AndForm.Item
        label="Node Name"
        name="node"
        rules={[
          {
            required: true,
            message: "Please input the Node name!",
          },
        ]}
        style={{ marginTop: "2rem" }}
      >
        <Input style={{ width: "60%" }} disabled={isLoading} />
      </AndForm.Item>

      {error && (
        <div
          style={{
            marginBottom: 20,
            minHeight: "50px",
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Alert
            message={error.message}
            type="error"
            showIcon
            style={{ width: "50%" }}
          />
        </div>
      )}
      <AndForm.Item
        wrapperCol={{ offset: 4, span: 36 }}
        style={{ marginTop: "2.5rem" }}
      >
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <Button type="primary" htmlType="submit" disabled={isLoading}>
              Send Request
            </Button>
            <Button
              style={{ marginLeft: "1.1rem" }}
              type="primary"
              danger
              htmlType="reset"
              disabled={isLoading}
            >
              Reset
            </Button>
          </>
        )}
      </AndForm.Item>
    </AndForm>
  );
}

export default Form;
