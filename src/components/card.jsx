import "./card.css"

function Card(props) {
    return <div className="card" style={{backgroundColor: props.color}}>
            <h5>{props.text}</h5>
        </div>
}

export default Card