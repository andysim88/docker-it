import { useNavigate } from "react-router";
import { Form, Checkbox, Input, Button, message } from "antd";
import { authenticateUserLogin } from "../dataHandles/userService";

export const LoginPage = (props) => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log("Success:", values);
        const loginStatus = await authenticateUserLogin(values);
        console.log("LoginPage::onFinish::loginStatus", loginStatus);
        if (loginStatus.authenticateStatus) {
            message.success(loginStatus.message);
            sessionStorage.setItem("authToken", loginStatus.jwt);
            navigate(`/account`);
        } else {
            message.error(loginStatus.message);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <h1>Login Page</h1>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your username!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
