import Header from '../Header/index'

import './index.css'

const Home = props => {
  const onClickedFindJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <>
      <div className="large-home-container">
        <Header />
        <div className="home-description-container">
          <h1 className="large-heading">Find The Job That Fits Your Life</h1>
          <p className="large-description">
            Millions of people are searching for jobs,salary,information,company
            reviews. Find the job that fits your ability and potential.
          </p>
          <button
            type="button"
            className="find-jobs-btn"
            onClick={onClickedFindJobs}
          >
            Find Jobs
          </button>
        </div>
      </div>
      <div className="small-home-container">
        <Header />
        <div className="home-description-container">
          <h1 className="large-heading">Find The Job That Fits Your Life</h1>
          <p className="large-description">
            Millions of people are searching for jobs,salary,information,company
            reviews. Find the job that fits your ability and potential.
          </p>
          <button
            type="button"
            className="find-jobs-btn"
            onClick={onClickedFindJobs}
          >
            Find Jobs
          </button>
        </div>
      </div>
    </>
  )
}
export default Home
