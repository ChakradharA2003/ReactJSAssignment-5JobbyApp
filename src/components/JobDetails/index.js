import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {IoLocationSharp} from 'react-icons/io5'
import {TiStar} from 'react-icons/ti'
import {FaEnvelope, FaExternalLinkAlt} from 'react-icons/fa'

import Header from '../Header/index'

import './index.css'

const SkillItem = props => {
  const {name, imageUrl} = props
  return (
    <li className="skill-item">
      <img src={imageUrl} alt={name} className="skill-image" />
      <p className="skill-name">{name}</p>
    </li>
  )
}

const SimilarJobItem = props => {
  const {details} = props
  const {
    similarJobCompanyLogoUrl,
    similarJobEmploymentType,
    similarJobDescription,
    similarLocation,
    similarRating,
    similarTitle,
  } = details
  return (
    <li className="job-item">
      <div className="logo-title-container">
        <img
          src={similarJobCompanyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div className="title-container">
          <h1 className="company-title">{similarTitle}</h1>
          <p className="rating">
            <TiStar className="star-icon" />
            {similarRating}
          </p>
        </div>
      </div>

      <h1 className="description-heading">Description</h1>
      <p className="description">{similarJobDescription}</p>
      <div className="location-jobtype-container">
        <div className="icons-container">
          <IoLocationSharp className="icon-style" />
          <p className="icon-beside-text">{similarLocation}</p>
        </div>
        <div className="icons-container">
          <FaEnvelope className="icon-style" />
          <p className="icon-beside-text">{similarJobEmploymentType}</p>
        </div>
      </div>
    </li>
  )
}

const apiConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {
    jobDetailsArray: [],
    similarJobsArray: [],
    apiStatus: apiConstants.loading,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({
      apiStatus: apiConstants.loading,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const apiJobDetailsUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiJobDetailsUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedJobDetailsArray = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompanyDescription: data.job_details.life_at_company.description,
        lifeAtCompanyImageUrl: data.job_details.life_at_company.image_url,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        skills: data.job_details.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        })),
      }
      // console.log(updatedJobDetailsArray)
      const updatedSimilarJobsArray = data.similar_jobs.map(job => ({
        similarJobCompanyLogoUrl: job.company_logo_url,
        similarJobEmploymentType: job.employment_type,
        similarJobId: job.id,
        similarJobDescription: job.job_description,
        similarLocation: job.location,
        similarRating: job.rating,
        similarTitle: job.title,
      }))
      this.setState(
        {
          jobDetailsArray: updatedJobDetailsArray,
          similarJobsArray: updatedSimilarJobsArray,
          apiStatus: apiConstants.success,
        },
        this.renderJobDetailsView,
      )
    } else {
      this.setState(
        {
          apiStatus: apiConstants.failure,
        },
        this.renderJobDetailsView,
      )
    }
  }

  jobDetailsSuccessView = () => {
    const {jobDetailsArray, similarJobsArray} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompanyDescription,
      lifeAtCompanyImageUrl,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
    } = jobDetailsArray
    return (
      <>
        <div className="job-details-item">
          <div className="logo-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
          <div className="company-description-url-container">
            <h1 className="job-details-side-heading">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_self"
              className="company-website-url"
            >
              Visit <FaExternalLinkAlt />
            </a>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="job-details-side-heading">Skills</h1>

          <ul className="skills-list">
            {jobDetailsArray.skills.map(skill => (
              <SkillItem
                key={skill.name}
                name={skill.name}
                imageUrl={skill.imageUrl}
              />
            ))}
          </ul>

          <div className="life-at-company-container">
            <div className="life-at-company-details">
              <h1 className="job-details-side-heading">Life at Company</h1>
              <p className="description">{lifeAtCompanyDescription}</p>
            </div>
            <img
              src={lifeAtCompanyImageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobsArray.map(job => (
            <SimilarJobItem key={job.similarJobId} details={job} />
          ))}
        </ul>
        <ul>.</ul>
      </>
    )
  }

  loadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobDetailsFailureView = () => (
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
      <button
        type="button"
        className="retry-btn"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.loading:
        return this.loadingView()
      case apiConstants.success:
        return this.jobDetailsSuccessView()
      case apiConstants.failure:
        return this.jobDetailsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-container">
        <Header />
        {this.renderJobDetailsView()}
      </div>
    )
  }
}
export default JobDetails
