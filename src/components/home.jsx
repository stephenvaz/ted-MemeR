import axios from "axios";
import React from "react";
import "../App.css"
import { Button } from "@chakra-ui/react";
import Meme from "./meme";

import { useToast } from '@chakra-ui/react'
import { FaShareNodes } from 'react-icons/fa6'

function Home() {

    const memeAPI = "https://meme-api.com/gimme"
    const toast = useToast()

    const [img, setImg] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [auto, setAuto] = React.useState(false)
    const autoRef = React.useRef(auto);
    const [sharing, setSharing] = React.useState(false)
    const [show, setShow] = React.useState(false)


    React.useEffect(() => {
        if (navigator.share) {
            setSharing(true)
            
        }
        else {
            const share = localStorage.getItem("sharing")
            console.log("share",share)
            if (share == null) {
                localStorage.setItem("sharing", true)
                setShow(true)
            }
        }
    }, []);

    React.useEffect(() => {
        if (show) {
            toast({
                title: "Your browser doesn't support sharing",
                description: "You can still share the link to this website",
                status: "warning",
                duration: 3000,
                isClosable: true,
            })
            setTimeout(() => {
                setShow(false)
            }, 3000)
        }
    }, [show]);


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
                <Button colorScheme="blue" variant="outline" onClick={generateMeme}>Generate a meme</Button>
                {auto ?
                    (<Button colorScheme="red" variant="solid" onClick={() => setAuto(false)}>Stop</Button>) :
                    (<Button colorScheme="teal" variant="outline" onClick={() => {

                        setAuto(true)
                        autoMeme()
                    }}>Auto</Button>)
                }
                {img && sharing && (
                    <Button colorScheme="green" variant="outline" onClick={
                        // share image
                        () => {
                            navigator.share({
                                title: "Meme",
                                text: "Check out this meme!",
                                url: img,
                            })
                        }
                    }>
                        <FaShareNodes mx="2px" />
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Home;