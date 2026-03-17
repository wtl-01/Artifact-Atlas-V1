import Footer from './Footer/Footer.jsx'
import Gamescreen from './Gamescreen/Gamescreen.jsx'
import logo from './assets/AA_logo.png'
import hdlogo from './assets/half-dome-logo.png'

function App() {

  return (
    <>
     <div className='page'>
        <div className='item1'>

          <div className='logo_wrapper'>
            <img src={logo} className='logo'></img>
          </div>

          <a href="https://www.halfdome.games/" target='_blank'><img src={hdlogo} className='hdlogo'></img></a>

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
