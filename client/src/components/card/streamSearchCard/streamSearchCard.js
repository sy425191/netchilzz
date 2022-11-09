import "./StreamCard.css";
const StreamSearchCard = ({result, handleSelect}) => {
    const { title, description, imgUrl, streams, _id } = result;

    return (
        <div className="scard" data-key={_id} onClick={handleSelect}>
            <div className="scard__img">
                <img src={imgUrl} alt="img" />
            </div>
            <div className="scard__body">
                <h5>{title}</h5>
                <p>{description}</p>
                <span className="scard__body__streams mt-3">
                    {streams} Streams
                </span>
            </div>
            
        </div>
    );
};

export default StreamSearchCard;