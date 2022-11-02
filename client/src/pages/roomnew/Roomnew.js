import { useEffect, useState } from "react";

const Roomnew = () => {
    const [room, setRoom] = useState({
        name: "",
        presenter: "",
    });

    useEffect(() => {
        window.location.href = "/room/657";
    }, []);

    return (
        <div> g </div>
    );
};
export default Roomnew