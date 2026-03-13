import React, { useContext } from 'react'
import { Button, Modal } from 'antd';
import { AppContext } from '../../context/AppContextProvider';
import { useNavigate } from 'react-router-dom';

const LogOut = ({ logoutModal, setLogoutModal }) => {
    const { handleLogout } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className='logout-wrapper'>
            {logoutModal && (
                <Modal className='logout-Modal'
                    open={logoutModal}
                    onOk={() => {
                        handleLogout();
                        navigate('/');
                        setLogoutModal(false);
                    }}
                    onCancel={() => setLogoutModal(false)}
                    width={600}
                    footer={false}
                >
                    {/* <h3>Logout</h3> */}
                    <div className='modal-title'>
                        <h3>Logout</h3>
                    </div>
                    <div className='delete-modal-body'>
                        <h6>Are you sure you want to logout?</h6>
                    </div>
                    <div className='logout-Btns modal-footer'>
                        <Button type='button' className='logout-cancel mr-5' onClick={() => setLogoutModal(false)}>
                            Cancel
                        </Button>
                        <Button type='button' className='logout-button' onClick={() => {
                            handleLogout();
                            navigate('/');
                            setLogoutModal(false);
                        }}>
                            Logout
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    )
};

export default LogOut;