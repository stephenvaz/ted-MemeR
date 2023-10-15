

import axios from "axios";

import React from "react";
import "../App.css"
import { Button } from "@chakra-ui/react";
import Meme from "./meme";

function Home() {

    const memeAPI = "https://meme-api.com/gimme"

    const [img, setImg] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [auto, setAuto] = React.useState(false)
    const autoRef = React.useRef(auto);


    React.useEffect(() => {
        autoRef.current = auto;
    }, [auto]);

    const generateMeme = async () => {
        setLoading(true)
        const response = await axios.get(memeAPI)
        const data = response.data
        const imgurls = data['preview']
        setImg(imgurls.slice(-1))
        setLoading(false)
    }

    const autoMeme = async () => {
        await generateMeme();
        setTimeout(() => {
            if (autoRef.current) {
                autoMeme()
            }
        }, 8000)
    }

    React.useEffect(() => {
        if (auto) { autoMeme() }
        else {
            clearTimeout()
        }
    }, [auto]);



    return (
        <div className="flex flex-col items-center justify-center h-screen"> 
            {img && (
                <div className=""> 
                    <Meme url={img} />
                </div>
            )}
            <div className="mt-4 w-full flex flex-row justify-center gap-4 items-center">
                <Button colorScheme="blue" onClick={generateMeme}>Generate a meme</Button>
                {auto ?
                    (<Button colorScheme="red" onClick={() => setAuto(false)}>Stop</Button>) : 
                        (<Button colorScheme="teal" onClick={() => {

                            setAuto(true)
                            autoMeme()
                        }}>Auto</Button>)
                }
            </div>
        </div>
    )
}

export default Home;