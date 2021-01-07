import Sidebar from './Sidebar'
import Content from './Content'
import './App.scss'

export default function App() {
    return (
        <section className="wrapper container-fluid">
            <section className="row w-100">
                <Sidebar />
                <Content />
            </section>
        </section>
    );
}