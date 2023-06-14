import { useVariableValue } from "@devcycle/devcycle-react-sdk"


export default function Frame () {

    const featureVariable = useVariableValue('title', false)
        

    return ( 
        <>
        { featureVariable ?
            <iframe src="https://giphy.com/embed/eBiYeYeLqP9ZsS782k" width="480" height="480" className="giphy-embed" allowFullScreen></iframe> : null 
        }
        </>
    )
}