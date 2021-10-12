import logo from './title.png'
import React from 'react';
import { useState, useEffect } from 'react';
import { Link, withRouter, NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import './AppHeader.css';
import { Layout, Menu, Dropdown, Icon, Drawer, Button } from 'antd';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;
const { Header, Sider } = Layout;


const AppHeader = (props) => {
  const [visible, setVisible] = useState(false);
	const isPc = useMediaQuery({
	  query: "(min-width:1024px)"
	});
	const isTablet = useMediaQuery({
	  query: "(min-width:768px) and (max-width:1023px)"
	});
	const isMobile = useMediaQuery({
	  query: "(max-width:767px)"
	});

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };


  function handleMenuClick({ key }) {
    if (key === "logout") {
      props.onLogout();
    }
  }


  let menuItems;
  if (props.isLoggedIn) {//로그인됨
    menuItems = [
      <Menu.Item key="logout" onClick={handleMenuClick}>
        Logout
      </Menu.Item>,
      <Menu.Item key="/profile" className="profile-menu">
        <ProfileDropdownMenu
          isLoggedIn={props.isLoggedIn}
          handleMenuClick={handleMenuClick}
          currentUser={props.currentUser} />
      </Menu.Item>,
    ];
  } else {//로그아웃
    menuItems = [
      <Menu.Item key="/login">
        <Link to="/login">Login</Link>
      </Menu.Item>,
      <Menu.Item key="/signup">
        <Link to="/signup">Signup</Link>
      </Menu.Item>
    ];
  }

  if(isMobile){
    return (

      <Layout>
        <Header className="app-header">
            <div  >
              <Button icon="menu" className="menu-icon" onClick={showDrawer} />
				<NavLink to="/" className="app-title"><img className="app-logo" src={logo}/></NavLink>
            </div>
            <Menu
              className="app-menu"
              mode="horizontal"
              selectedKeys={[props.location.pathname]}
              style={{ lineHeight: '64px' }} >
              {menuItems}
            </Menu>
        </Header>
        <Layout>
          <Drawer title="바바" placement="left" onClose={onClose} visible={visible}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item>
                <Link to="/gallery">전시회</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/alltokens">전체 토큰</Link>
              </Menu.Item>
              <SubMenu key="sub2" icon={<UserOutlined />} title="내 토큰">
                <Menu.Item key="2-1"><Link to="/mytoken">내 토큰</Link></Menu.Item>
                <Menu.Item key="2-2"><Link to="/mygallery">전시회 관리</Link></Menu.Item>
              </SubMenu>
              {props.role == 'ROLE_AUTHOR'
                ? <Menu.Item>
                  <Link to="/tokenissuance">토큰 발행</Link>
                </Menu.Item>
                : null}
              {props.role == 'ROLE_ADMIN'
                ? <Menu.Item>
                  <Link to="/adminmenu">관리자 메뉴</Link>
                </Menu.Item>
                : null}
            </Menu>
          </Drawer>
        </Layout>
      </Layout>
    );
  }
  else {
    return (

      <Layout>
        <Header className="app-header">
            <div className="app-title" >
              <NavLink to="/" className="app-title"><img className="app-logo" src={logo}/></NavLink>
            </div>
            <Menu
              className="app-menu"
              mode="horizontal"
              selectedKeys={[props.location.pathname]}
              style={{ lineHeight: '64px' }} >
              {menuItems}
            </Menu>
        </Header>
        <Layout>
          <Sider style={{ width: "200", background: '#025C30', height: "100vh", position: 'fixed', left: 0 }} className="app-sider">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
        <Menu.Item>
                <Link to="/gallery">전시회</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/alltokens">전체 토큰</Link>
              </Menu.Item>
              <SubMenu key="sub2" icon={<UserOutlined />} title="내 토큰">
                <Menu.Item key="2-1"><Link to="/mytoken">내 토큰</Link></Menu.Item>
                <Menu.Item key="2-2"><Link to="/mygallery">전시회 관리</Link></Menu.Item>
              </SubMenu>
              {props.role == 'ROLE_AUTHOR'
                ? <Menu.Item>
                  <Link to="/tokenissuance">토큰 발행</Link>
                </Menu.Item>
                : null}
          {props.role == 'ROLE_ADMIN'
          ? <Menu.Item>
            <Link to="/adminmenu">관리자 메뉴</Link>
          </Menu.Item>
          :null}
            </Menu>
          </Sider>
        </Layout>
      </Layout>
    );
  }
}


function ProfileDropdownMenu(props) {
  let dropdownMenu;
  dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Item key="tokenprofile" className="dropdown-item">
        <Link to="/mypage"> 마이 페이지 </Link>
      </Menu.Item>,
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={['click']}
      getPopupContainer={() => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
        <Icon type="user" className="nav-icon" style={{ marginRight: 0 }} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}



export default withRouter(AppHeader);