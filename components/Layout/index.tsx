import Navbar from "components/Navbar";
import Footer from "components/Footer";

const Layout = ( { children } : {children:any}) => {
    return (
        <div>
            <Navbar />
            <main> { children } </main>
            <Footer />
        </div>
    )
}
export default Layout