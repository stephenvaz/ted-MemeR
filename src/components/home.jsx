import axios from "axios";
import React from "react";
import "../App.css"
import { Button } from "@chakra-ui/react";
import Meme from "./meme";

import { useToast } from '@chakra-ui/react'
import { FaShareNodes } from 'react-icons/fa6'
import {FiLink2} from 'react-icons/fi'

function Home() {


    const encodedParams = new URLSearchParams();
    
    const headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID,
        'X-RapidAPI-Host': 'shorturl9.p.rapidapi.com'
    }

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

    const shareUrl = async () => {
        try {
            encodedParams.set('url', img);
            const resp = await axios.post('https://shorturl9.p.rapidapi.com/functions/api.php', 
                encodedParams,
                {
                    headers: headers

                })
            const data = resp.data
            // console.log(data.url)
            if (data && data.url) {
                navigator.clipboard.writeText(data.url)
                toast({
                    title: "Link copied to clipboard",
                    description: "You can now share the link",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
            }

        }
        catch (e) {
            console.log(e)
            toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {img && (
                <div className="">
                    <Meme url={img} />
                </div>
            )}
            <div className="mt-4 w-full flex flex-row justify-center gap-4 items-center">
                <Button
                    colorScheme="whiteAlpha"
                    variant="outline"
                    onClick={generateMeme}
                    backgroundColor={"rgba(0, 0, 0, 0.2)"}
                    disabled={loading || auto}
                >
                    Generate a meme
                </Button>

                {auto ?
                    (<Button colorScheme="red" variant="solid" onClick={() => setAuto(false)}>Stop</Button>) :
                    (<Button
                        colorScheme="grey"
                        variant="outline"
                        onClick={() => {
                            setAuto(true);
                            autoMeme();
                        }}
                        backgroundColor={"rgba(255, 255, 255, 0.2)"}
                    >
                        Auto
                    </Button>)
                }

                {img && sharing && (
                    <Button
                        colorScheme="green"
                        variant="outline"
                        onClick={
                            () => {
                                navigator.share({
                                    title: "Meme",
                                    text: "Check out this meme!",
                                    url: img,
                                })
                            }
                        }
                        backgroundColor={
                            "rgba(255, 255, 255, 0.2)"
                        }
                    >
                        <FaShareNodes mx="2px" />
                    </Button>
                )}

                {img && (
                    <Button
                        colorScheme="green"
                        variant="outline"
                        onClick={shareUrl}
                        backgroundColor={
                            "rgba(255, 255, 255, 0.2)"
                        }
                    >
                        <FiLink2 mx="2px" />
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Home;