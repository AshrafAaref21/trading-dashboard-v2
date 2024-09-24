import PropTypes from "prop-types";

import { Flex, Layout as AndLayout } from "antd";

function Layout(props) {
  const { Header, Content } = AndLayout;

  const headerStyle = {
    textAlign: "center",
    color: "#003366",
    height: "10%",
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#4A90E2",
    alignContent: "center",
  };

  const contentStyle = {
    textAlign: "center",
    padding: "1rem",
    minHeight: 120,
    lineHeight: "55px",
    color: "#333333",
    backgroundColor: "#F5F5F5",
  };

  const layoutStyle = {
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",
    height: "100vh",
  };

  return (
    <Flex gap="middle" wrap>
      <AndLayout style={layoutStyle}>
        <Header style={headerStyle}>{props.Header}</Header>
        <Content style={contentStyle}>{props.Content}</Content>
      </AndLayout>
    </Flex>
  );
}

export default Layout;

Layout.propTypes = {
  Header: PropTypes.object,
  Content: PropTypes.object,
};
