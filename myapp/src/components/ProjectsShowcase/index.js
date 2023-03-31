import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import ProjectItem from '../ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProjectsShowcase extends Component {
  state = {
    activeTabId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectData: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({
      apiStatus: apiStatusConstants.loading,
    })
    const {activeTabId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeTabId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handleOptionChange = event => {
    this.setState({activeTabId: event.target.value}, this.getProjects)
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {projectData} = this.state
    return (
      <div className="project-container">
        {projectData.map(each => (
          <ProjectItem details={each} key={each.id} />
        ))}
      </div>
    )
  }

  onRetry = () => {
    this.getProjects()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button onClick={this.onRetry} type="button" className="button">
        Retry
      </button>
    </div>
  )

  getProjectsAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeTabId} = this.state
    console.log(activeTabId)
    return (
      <div className="bg-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </nav>
        <select
          className="dropdown"
          value={activeTabId}
          onChange={this.handleOptionChange}
        >
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        <div className="projects-main-container">{this.getProjectsAll()}</div>
      </div>
    )
  }
}

export default ProjectsShowcase
