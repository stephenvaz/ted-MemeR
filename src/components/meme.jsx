const Meme = ({url}) => {
    return (
        <div className="p-2 m-2 mx-auto rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-gradient">
            <img className="w-full rounded-lg bg-transparent" src={url} alt="Generated meme" 
                style={
                    {
                        maxHeight: '78vh',
                    }
                }
            />
        </div>
    )
}

export default Meme;
