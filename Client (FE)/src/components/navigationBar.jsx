import { PlayCircleOutlined, UserAddOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const loginItem = {
    label: "Login",
    key: "login",
    icon: <LoginOutlined />,
};

const items = [
    {
        label: "Accounts Management",
        key: "account",
        icon: <UserAddOutlined />,
    },
    {
        label: "Audio Management",
        key: "audio",
        icon: <PlayCircleOutlined />,
    },
    {
        label: "Logout",
        key: "logout",
        icon: <LogoutOutlined />,
    },
];
const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [current, setCurrent] = useState(location.pathname.split("/").at(-1));
    const isLoggedIn = !!sessionStorage.getItem("authToken");

    useEffect(() => {
        setCurrent(location.pathname.split("/").at(-1));
    }, [location]);

    const onClick = (e) => {
        if (e.key === "logout") {
            sessionStorage.removeItem("authToken");
            navigate("/login");
            return;
        }
        setCurrent(e.key);
        navigate("/" + e.key);
    };
    return (
        <Menu
            disabled={!isLoggedIn}
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={isLoggedIn ? items : [loginItem]}
        />
    );
};
export default NavBar;
