import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {IoLocationSharp} from 'react-icons/io5'
import {BsSearch} from 'react-icons/bs'
import {TiStar} from 'react-icons/ti'
import {FaEnvelope} from 'react-icons/fa'

import Header from '../Header/index'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApiConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
    packagePerAnnum,
    id,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="link-style">
      <li className="job-item">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-container">
            <h1 className="company-title">{title}</h1>
            <p className="rating">
              <TiStar className="star-icon" />
              {rating}
            </p>
          </div>
        </div>
        <div className="location-salary-container">
          <div className="location-jobtype-container">
            <div className="icons-container">
              <IoLocationSharp className="icon-style" />
              <p className="icon-beside-text">{location}</p>
            </div>
            <div className="icons-container">
              <FaEnvelope className="icon-style" />
              <p className="icon-beside-text">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="description-heading">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

class Jobs extends Component {
  state = {
    profileDetails: [],
    profileApiStatus: profileApiConstants.loading,
    empFilter: [],
    salary: '',
    search: '',
    searchValue: '',
    jobsApiStatus: profileApiConstants.loading,
    jobs: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({
      profileApiStatus: profileApiConstants.loading,
    })
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiProfileUrl = 'https://apis.ccbp.in/profile'
    const response = await fetch(apiProfileUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        profileApiStatus: profileApiConstants.success,
      })
      const updatedProfileUrlDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState(
        {
          profileDetails: updatedProfileUrlDetails,
        },
        this.renderProfileView,
      )
    } else {
      this.setState(
        {
          profileApiStatus: profileApiConstants.failure,
        },
        this.renderProfileView,
      )
    }
  }

  getJobsDetails = async () => {
    this.setState({
      jobsApiStatus: profileApiConstants.loading,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {empFilter, search, salary} = this.state
    const employmentType = empFilter.join(',')
    console.log(employmentType)
    console.log(salary)
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salary}&search=${search}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()
    console.log(data.jobs)
    if (response.ok) {
      const updatedJobDetails = data.jobs.map(job => ({
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      // console.log(updatedJobDetails)
      this.setState(
        {jobs: updatedJobDetails, jobsApiStatus: profileApiConstants.success},
        this.renderJobsView,
      )
    } else {
      this.setState(
        {
          jobsApiStatus: profileApiConstants.failure,
        },
        this.renderJobsView,
      )
    }
  }

  loadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-success-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  profileFailureView = () => (
    <div className="profile-failure-view">
      <button
        type="button"
        className="profile-retry-btn"
        onClick={this.getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case profileApiConstants.loading:
        return this.loadingView()
      case profileApiConstants.success:
        return this.profileSuccessView()
      case profileApiConstants.failure:
        return this.profileFailureView()
      default:
        return null
    }
  }

  onEmploymentCheck = event => {
    const {empFilter} = this.state
    if (event.target.checked) {
      if (empFilter.includes(event.target.value) === false) {
        this.setState(
          prevState => ({
            empFilter: [...prevState.empFilter, event.target.value],
          }),
          this.getJobsDetails,
        )
      }
    } else {
      const updatedArray = empFilter.filter(arr => arr !== event.target.value)
      this.setState(
        {
          empFilter: updatedArray,
        },
        this.getJobsDetails,
      )
    }
  }

  onSalaryCheck = event => {
    this.setState({
      salary: event.target.value,
    })
  }

  onChangeSearch = event => {
    this.setState({
      searchValue: event.target.value,
    })
  }

  onSubmitSearch = event => {
    event.preventDefault()
    const {searchValue} = this.state
    this.setState(
      {
        search: searchValue,
      },
      this.getJobsDetails,
    )
  }

  jobsSuccessView = () => {
    const {jobs} = this.state
    if (jobs.length === 0) {
      return (
        <div className="zero-results-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-job-failure-image"
          />
          <h1 className="no-jobs-failure-heading">No Jobs Found</h1>
          <p className="no-jobs-failure-description">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }
    return (
      <ul className="all-jobs-container">
        {jobs.map(job => (
          <JobItem key={job.id} jobDetails={job} />
        ))}
      </ul>
    )
  }

  jobsFailureView = () => (
    <div className="zero-results-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-job-failure-image"
      />
      <h1 className="no-jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobsDetails}>
        Retry
      </button>
    </div>
  )

  renderJobsView = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case profileApiConstants.loading:
        return this.loadingView()
      case profileApiConstants.success:
        return this.jobsSuccessView()
      case profileApiConstants.failure:
        return this.jobsFailureView()
      default:
        return null
    }
  }

  render() {
    const {salary, searchValue} = this.state
    console.log(salary)
    return (
      <>
        <div className="jobs-container">
          <Header />
          <form
            type="submit"
            onSubmit={this.onSubmitSearch}
            className="small-search-container"
          >
            <input
              type="search"
              placeholder="Search"
              className="search-input"
              value={searchValue}
              onChange={this.onChangeSearch}
            />
            {/* eslint-disable-next-line */}
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={this.onSubmitSearch}
            >
              <BsSearch className="search-icon" />
            </button>
          </form>
          <div className="search-filters-container">
            <div className="profile-filters-container">
              {this.renderProfileView()}
              <hr />
              <div className="type-of-employment-container">
                <h1 className="type-of-employment-heading">
                  Type of Employment
                </h1>
                <ul className="checkbox-list">
                  {employmentTypesList.map(emp => (
                    <li className="checkbox-list-item">
                      <input
                        type="checkbox"
                        id={emp.employmentTypeId}
                        value={emp.employmentTypeId}
                        onClick={this.onEmploymentCheck}
                      />
                      <label
                        htmlFor={emp.employmentTypeId}
                        className="checkbox-label-style"
                      >
                        {emp.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <hr />
              <div className="type-of-employment-container">
                <h1 className="type-of-employment-heading">Salary Range</h1>
                <ul className="checkbox-list">
                  {salaryRangesList.map(emp => {
                    if (salary === emp.salaryRangeId) {
                      return (
                        <li className="checkbox-list-item">
                          <input
                            type="checkbox"
                            id={emp.salaryRangeId}
                            value={emp.salaryRangeId}
                            onClick={this.onSalaryCheck}
                            className="salary-input-boxes"
                            checked
                          />
                          <label
                            htmlFor={emp.salaryRangeId}
                            className="checkbox-label-style"
                          >
                            {emp.label}
                          </label>
                        </li>
                      )
                    }
                    return (
                      <li className="checkbox-list-item">
                        <input
                          type="radio"
                          id={emp.salaryRangeId}
                          value={emp.salaryRangeId}
                          onClick={this.onSalaryCheck}
                          className="salary-input-boxes"
                        />
                        <label
                          htmlFor={emp.label}
                          className="checkbox-label-style"
                        >
                          {emp.label}
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <div className="search-jobs-container">
              <form
                type="submit"
                onSubmit={this.onSubmitSearch}
                className="large-search-container"
              >
                <input
                  type="search"
                  placeholder="Search"
                  className="search-input"
                  value={searchValue}
                  onChange={this.onChangeSearch}
                />
                {/* eslint-disable-next-line */}
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-btn"
                  onClick={this.onSubmitSearch}
                >
                  <BsSearch className="search-icon" />
                </button>
                {/*
                 <button type="submit" className="search-btn">
                  <IoSearch className="search-icon" />
                </button>
                */}
              </form>
              {this.renderJobsView()}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
