import { height } from '@fortawesome/free-regular-svg-icons/faAddressBook'
import Footer from './Footer/Footer.jsx'
import Gamescreen from './Gamescreen/Gamescreen.jsx'
import logo from './assets/AA_logo.png'

function App() {

  return (
    <>
     <div className='page'>
        <div className='item1'>
          <img src={logo} className='logo'></img>
        </div>
        <div className='item2'>
          <Gamescreen>
          </Gamescreen>
        </div>
        <div className='item3'>
          <Footer>
          </Footer>
        </div>
     </div>
    </>
  )
}

export default App
