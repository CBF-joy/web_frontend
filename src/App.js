import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { Route, withRouter, Switch, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Layout, notification } from 'antd';

import { getCurrentUser } from './util/APIUtils';
import { ACCESS_TOKEN } from './constants';
import caver from './klaytn/caver'

import './App.css';
import Main from "./container/Main";
import AppHeader from './common/AppHeader';
import LoadingIndicator from './common/LoadingIndicator';
import BanPage from './common/BanPage';
import NotFound from './common/NotFound';

import AllTokens from './market/AllTokens'
import MyToken from './market/MyToken'
import MyPage from './market/MyPage.js'
import MyGallery from './market/MyGallery'

import Signup from "./market/components/loginform/Signup";
import Login from "./market/components/loginform/Login";
import TokenIssuance from "./market/TokenIssuance";

import Gallery from "./market/components/gallery/Page_Gallery"
import MyTokenList from "./market/components/mytoken/MyTokenList"
import MyTokenEdit from "./market/components/mytoken/MyTokenEdit"
import MyTokenExhibit from "./market/components/mytoken/MyTokenExhibit"


import AdminMenu from './admin/AdminMenu'
import EndBid from './admin/EndBid'
import NewAdd from './admin/NewAdd'
import EditExhibitList from './admin/EditExhibitList'
import EditExhibit from './admin/EditExhibit'

import SavePainting from "./market/components/mytoken/SavePainting"

import Viewer from './container/Viewer'


const { Content } = Layout;
// const isPc = useMediaQuery({
//   query: "(min-width:1024px)"
// });
// const isTablet = useMediaQuery({
//   query: "(min-width:768px) and (max-width:1023px)"
// });
// const isMobile = useMediaQuery({
//   query: "(max-width:767px)"
// });

const App = (props) => {

  const history = useHistory();

  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [isLoading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [username, setUserName] = useState(null);
  const [address, setAddress] = useState(null);
	
	const isPc = useMediaQuery({
	  query: "(min-width:1024px)"
	});
	const isTablet = useMediaQuery({
	  query: "(min-width:768px) and (max-width:1023px)"
	});
	const isMobile = useMediaQuery({
	  query: "(max-width:767px)"
	});


  notification.config({
    placement: 'topRight',
    top: 70,
    duration: 3,
  });

  const loadCurrentUser = () => {
    setLoading(true);

    getCurrentUser()
      .then(response => {

        setRole(response.authorities[0].authority);
        setCurrentUser(response);
        setLoggedIn(true);
        setUserName(response.username);
        setAddress(response.address);
        setLoading(false);

      }).catch(error => {
        setLoading(false);
      });
  }


  useEffect(() => {
	  async function fetchUser(){
		  await loadCurrentUser();
	  }
    fetchUser();
  }, [props])

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);

    setCurrentUser(null);
    setLoggedIn(false);
    setRole(null);
	setAddress(null);
    setUserName(null);

    history.push('/');

    notification.success({
      message: '전시해',
      description: "로그아웃 되었습니다.",
    });
  }


  const handleLogin = () => {
    notification.success({
      message: '전시해',
      description: "로그인 되었습니다.",
    });
    loadCurrentUser();
    history.push("/");
  }




  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <div>
      {/*isPc && <p>HI PC</p>*/}
      {/*isTablet && <p>HI Tablet</p>*/}
      {/*isMobile && <p>HI Mobile</p>*/}
		  {isMobile ? <Layout className="app-container">
        <AppHeader
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          currentUser={currentUser}
          role={role}
        />

        <Content className="app-content_mobile">
          <div className="container">
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/login"
                render={(props) => <Login onLogin={handleLogin} {...props} />}></Route>
              <Route path="/signup" component={Signup}></Route>
              <Route path="/alltokens"
                render={() => <AllTokens isLoggedIn={isLoggedIn} role={role} address={address} />}></Route>
              <Route path="/mytoken"
                render={() => <MyToken isLoggedIn={isLoggedIn} role={role} address={address} />}></Route>
              <Route path="/gallery" component={Gallery} ></Route>
              <Route path="/viewer/:exhibitionId"
                render={(props) => <Viewer address={address} {...props} />}></Route>
              <Route path="/mytokenlist" component={MyTokenList} address={address}></Route>
              <Route path="/mytokenedit" component={MyTokenEdit} address={address}></Route>
              <Route path="/mygallery"
                render={() => <MyGallery isLoggedIn={isLoggedIn} role={role} address={address} />}></Route>
              <Route path="/mytokenexhibit" component={MyTokenExhibit} address={address}></Route>
              <Route path="/mypage"
                render={() => <MyPage isLoggedIn={isLoggedIn} address={address} username={username} currentUser={currentUser} />}></Route>
              <Route path="/tokenissuance"
                render={() => <TokenIssuance isLoggedIn={isLoggedIn} role={role} address={address} />}></Route>

              <Route path="/adminmenu" render={props => <AdminMenu isLoggedIn={isLoggedIn} role={role} address={address} {...props} />}></Route>
              <Route path="/endBid" render={props => <EndBid isLoggedIn={isLoggedIn} role={role} address={address} {...props} />}></Route>
              <Route path="/newAdd" render={props => <NewAdd isLoggedIn={isLoggedIn} role={role} address={address} {...props} />}></Route>
              <Route path="/editExhibitList" render={props => <EditExhibitList isLoggedIn={isLoggedIn} role={role} address={address}  {...props} />}></Route>

              <Route path="/editExhibit/:id" render={props => <EditExhibit isLoggedIn={isLoggedIn} role={role} address={address}  {...props} />}></Route>

              <Route path="/savepainting/:id" render={props => <SavePainting isLoggedIn={isLoggedIn} role={role} address={address}  {...props} />}></Route>

              <Route component={NotFound}></Route>
              <Route component={BanPage}></Route>
            </Switch>
          </div>
        </Content>
      </Layout> : <Layout className="app-container">
        <AppHeader
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          currentUser={currentUser}
          role={role}
        />

        <Content className="app-content">
          <div className="container">
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/login"
                render={(props) => <Login onLogin={handleLogin} {...props} />}></Route>
              <Route path="/signup" component={Signup}></Route>
              <Route path="/alltokens"
                render={() => <AllTokens isLoggedIn={isLoggedIn} role={role} address={address} />}></Route>
              <Route path="/mytoken"
                render={() => <MyToken isLoggedIn={isLoggedIn} role={role} address={address} />}></Route>
              <Route path="/gallery" component={Gallery} ></Route>
              <Route path="/viewer/:exhibitionId"
                render={(props) => <Viewer address={address} username={username} {...props} />}></Route>
              <Route path="/mytokenlist" component={MyTokenList} address={address}></Route>
              <Route path="/mytokenedit" component={MyTokenEdit} address={address}></Route>
              <Route path="/mygallery"
                render={() => <MyGallery isLoggedIn={isLoggedIn} role={role} address={address} />}></Route>
              <Route path="/mytokenexhibit" component={MyTokenExhibit} address={address}></Route>
              <Route path="/mypage"
                render={() => <MyPage isLoggedIn={isLoggedIn} address={address} username={username} currentUser={currentUser} />}></Route>
              <Route path="/tokenissuance"
                render={() => <TokenIssuance isLoggedIn={isLoggedIn} role={role} address={address} />}></Route>

              <Route path="/adminmenu" render={props => <AdminMenu isLoggedIn={isLoggedIn} role={role} address={address} {...props} />}></Route>
              <Route path="/endBid" render={props => <EndBid isLoggedIn={isLoggedIn} role={role} address={address} {...props} />}></Route>
              <Route path="/newAdd" render={props => <NewAdd isLoggedIn={isLoggedIn} role={role} address={address} {...props} />}></Route>
              <Route path="/editExhibitList" render={props => <EditExhibitList isLoggedIn={isLoggedIn} role={role} address={address}  {...props} />}></Route>

              <Route path="/editExhibit/:id" render={props => <EditExhibit isLoggedIn={isLoggedIn} role={role} address={address}  {...props} />}></Route>

              <Route path="/savepainting/:id" render={props => <SavePainting isLoggedIn={isLoggedIn} role={role} address={address}  {...props} />}></Route>

              <Route component={NotFound}></Route>
              <Route component={BanPage}></Route>
            </Switch>
          </div>
        </Content>
      </Layout> }

      
    </div>
  )

}


export default withRouter(App);
