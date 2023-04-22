import { Card } from "antd";

export const CustomCard = ({ children, title, otherProps = {} }) => (
    <Card
        title={title}
        bordered={true}
        headStyle={{ borderBottomWidth: "3px" }}
        style={{
            width: 300,
            borderWidth: "2px",
            marginLeft: "auto",
            marginRight: "auto",
            ...(otherProps.style ?? {}),
        }}
        {...(otherProps.card ?? {})}
    >
        {children}
    </Card>
);
