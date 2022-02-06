import Navigation from "./navigation";

const Wrapper = ({ children }) => {
    return (
        <>
            <Navigation />
            {children}
        </>
    );
}

export default Wrapper;