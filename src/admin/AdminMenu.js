import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import './AdminMenu.css';
import Login from '../market/components/loginform/Login';


const AdminMenu = (props) => {
	
		if(props.role == "ROLE_ADMIN"){
			return (
            <div className="admin-menu-container">
                <h2>관리자님, 환영합니다</h2>
                <Button type="primary" block size="large">
                    <Link to="/newAdd">
                        새 전시회 등록
                    </Link>
                </Button>
                <Button type="primary" block size="large">
                    <Link to="/editExhibitList">
                    전시회 수정
                    </Link>
                </Button>
				<Button type="primary" block size="large">
                    <Link to="/endBid">
                    	경매 관리
                    </Link>
                </Button>
            </div>
        );
		}
		else{
			return(<Login />);

		}

    
}

export default AdminMenu;