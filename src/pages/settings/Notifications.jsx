import React from 'react'
import { Switch,Button } from 'antd';

const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

const Notification = () => {
    return (
      <div className="ThirdTab bg-white">
            
        <div className='ThirdTab-body' >
          <div className='notification-div'>
            <p className='text-heading'>Clients</p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
          </div>

          <div className='notification-div'>
            <p className='text-heading'>GMS</p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
          </div>

          <div className='notification-div'>
            <p className='text-heading'>Users</p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
          </div>

          <div className='notification-div'>
            <p className='text-heading'>Billing</p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
            <p className='single-notification-text'>When new Client is added successfully <span className='toggle-button'><Switch defaultChecked onChange={onChange} /></span></p>
          </div>
        
        </div>

        <div className='button-bottom-right bg-white'>
            <Button className="cancle-btn" ghost>
                Cancel
            </Button>
            <Button type="primary" className='primary-btn'>Save Changes</Button>
          </div>
        
          </div>
    );
}

export default Notification;