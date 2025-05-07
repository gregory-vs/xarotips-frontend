import React, { useState, useEffect } from "react";
import { Layout, Menu, theme } from "antd";
import BetTable from "./components/BetTable";
import Graphic from "./components/Graphic";
import { getTeams } from "./services/teamService";
import { Team } from "./types/Team";
import NewBetDrawer from "./components/NewBetDrawer";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState("1");
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <BetTable />;
      case "2":
        return <Graphic />;
      default:
        return <BetTable />;
    }
  };

  const fetchData = async () => {
    getTeams()
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => setError(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Layout
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            onClick={(e) => setSelectedKey(e.key)}
            items={[
              { key: "1", label: "Bet" },
              { key: "2", label: "Gráfico" },
            ]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content style={{ padding: "0 48px" }}>
          <br />
          <div
            style={{
              padding: 24,
              minHeight: 380,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>

      <NewBetDrawer openDrawer={true} teamList={teams}/>
    </>
  );
};

export default App;
