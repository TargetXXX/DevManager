import { Avatar, Layout, Menu } from "antd";
import { Link, useLocation, Outlet } from "react-router-dom";
import { HomeOutlined, TeamOutlined, AppstoreOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import EditProfileModal from "./EditProfileModal";
import { useState } from "react";
import './styles/Layout.css';
import { defaultAvatarURL } from "../api/axios";

const { Header, Content } = Layout;

export default function AppLayout() {
    const location = useLocation();
    const {dev} = useAuth();
    const [profileModal, setProfileModal] = useState<boolean>(false);
    const selectedKey =  location.pathname === "/" ? "/" : location.pathname.startsWith("/desenvolvedores") ? "/desenvolvedores" : location.pathname.startsWith("/niveis") ? "/niveis" : "";
  
    return (
      <>
        <EditProfileModal open={profileModal} setOpen={setProfileModal}/>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: 18 }}>DevManager</div>
            <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]} style={{ flex: 1 }} 
              items={[
                { key: "/", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
                { key: "/desenvolvedores", icon: <TeamOutlined />, label: <Link to="/desenvolvedores">Desenvolvedores</Link> },
                { key: "/niveis", icon: <AppstoreOutlined />, label: <Link to="/niveis">Niveis</Link> },
                { key: "/logout", icon: <LogoutOutlined />, label: <Link to="/logout">Deslogar</Link> },
              ]}
            />
            <img src={dev?.avatar ? 'data:image/png;base64,' + dev?.avatar as string : defaultAvatarURL} style={{width: 60, height: 60, borderRadius: "50%"}} className="avatarHover" onClick={() => {
              setProfileModal(true);
            }}/>
          </Header>
          <Content style={{ padding: 24 }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 12 }}>
              <Outlet/> 
            </div>
          </Content>
        </Layout>
      </>
    );
}