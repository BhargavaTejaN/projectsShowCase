import './index.css'

const ProjectItem = props => {
  const {details} = props
  const {id, imageUrl, name} = details

  return (
    <li className="each-list">
      <div className="each-list-container">
        <img src={imageUrl} alt={name} className="image" />
        <p className="description">{name}</p>
      </div>
    </li>
  )
}

export default ProjectItem
