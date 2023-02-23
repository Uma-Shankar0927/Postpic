import React from 'react'
import {GoogleLogin} from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {FcGoogle} from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png';
import jwt_decode from 'jwt-decode'
import {client} from '../client';

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    const decoded = jwt_decode(response.credential);
    localStorage.setItem('user', JSON.stringify(decoded));
    const {name, sub, picture} = decoded;
    
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture
    }
    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', {replace: true});
      })
  }
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video className='w-full h-full object-cover' src={shareVideo} type="video/mp4" loop controls={false} muted autoPlay />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5 gap-2 flex justify-center items-center'>
            <img src={logo} width="50px" alt="logo" />
            <p className='text-[#FFFFFF] font-bold text-3xl font-sans'>PostPic</p>
          </div>  
          <p className='text-xl font-sans text-[#FFFFFF] pb-4'>Share your memories...</p>
          <div className='shadow-2xl'>
            <GoogleLogin
              clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
              render={(renderProps) => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled} type='button' className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'><FcGoogle className='mr-4'/>SignIn with google</button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>       
        </div>
      </div>
    </div>
  )
}

export default Login