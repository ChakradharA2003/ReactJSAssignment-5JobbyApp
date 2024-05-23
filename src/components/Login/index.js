// import {withRouter} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMessage: '',
    showSubmitError: false,
  }

  onChangeName = event => {
    this.setState({
      username: event.target.value,
      errorMessage: '',
      showSubmitError: false,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
      errorMessage: '',
      showSubmitError: false,
    })
  }

  onSubmitSuccess = jwtToken => {
    console.log(jwtToken)
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 10})
    history.replace('/')
  }

  onSubmitFailure = msg => {
    console.log(msg)
    this.setState({
      errorMessage: msg,
      showSubmitError: true,
    })
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userCredentials = {username, password}
    console.log(userCredentials)
    const options = {
      method: 'POST',
      body: JSON.stringify(userCredentials),
    }
    const loginUrl = 'https://apis.ccbp.in/login'
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMessage, showSubmitError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <form type="submit" className="login-form" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <div className="login-element-container">
            <label htmlFor="name" className="label-style">
              USERNAME
            </label>
            <input
              type="text"
              className="input-field-style"
              placeholder="Username"
              value={username}
              onChange={this.onChangeName}
            />
          </div>
          <div className="login-element-container">
            <label htmlFor="password" className="label-style">
              PASSWORD
            </label>
            <input
              type="password"
              className="input-field-style"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMessage}</p>}
        </form>
      </div>
    )
  }
}
export default Login
