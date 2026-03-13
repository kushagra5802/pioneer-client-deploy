import React from "react";
import "../../styles/auth.css";
import LoginPageVideo from "../../assets/videos/login-bg-video.mp4"
import LazyLoad from 'react-lazyload';


const AuthLayout = ({ children }) => {
    return (
        <>
            <div className="video-background">
                <LazyLoad height={200} once>
                    <video id="video-bg" autoPlay muted loop >
                        <source src={LoginPageVideo} type="video/mp4" />
                    </video>
                </LazyLoad>
            </div>
            <div className="signup-page grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                {children}
            </div>
        </>
    );
};

export default AuthLayout;

















