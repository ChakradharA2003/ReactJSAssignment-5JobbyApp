import {Link, withRouter} from 'react-router-dom'

import {IoMdHome, IoIosLogOut} from 'react-icons/io'
import {FaEnvelope} from 'react-icons/fa'

import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickedLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <>
      <div className="large-header-container">
        <Link to="/" className="link-style">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-image"
          />
        </Link>

        <div className="header-routes-container">
          <Link to="/" className="link-style">
            Home
          </Link>
          <Link to="/jobs" className="link-style">
            Jobs
          </Link>
        </div>
        <button type="button" className="logout-btn" onClick={onClickedLogout}>
          Logout
        </button>
      </div>

      <div className="small-header-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo-image2"
        />
        <div className="header-routes-container">
          <Link to="/" className="link-style">
            <IoMdHome />
          </Link>
          <Link to="/jobs" className="link-style">
            <FaEnvelope />
          </Link>
          {/* eslint-disable-next-line */}
          <button
            type="button"
            className="logout-btn2"
            onClick={onClickedLogout}
          >
            <IoIosLogOut className="logout" />
          </button>
        </div>
      </div>
    </>
  )
}
export default withRouter(Header)
