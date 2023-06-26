import { useNavigate } from "react-router-dom"


export default function Success () {

    const navigate = useNavigate()

    const goTo = () => {
        navigate("/user-protected-route")
    }


    return (
        <div>
            <iframe src="https://giphy.com/embed/5jT0jaNDsM6Ik7X9yq" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/justin-background-confetti-5jT0jaNDsM6Ik7X9yq">via GIPHY</a></p>
            <button onClick={goTo}>Go to User Protected Route</button>
        </div>
    )
}