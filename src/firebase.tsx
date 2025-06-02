import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyDqvzH3jEkH324fmDSe6MIofRHW5G7prKc',
    authDomain: 'aike-53217.firebaseapp.com',
    projectId: 'aike-53217',
    storageBucket: 'aike-53217.firebasestorage.app',
    messagingSenderId: '959565422604',
    appId: '1:959565422604:web:1859410a32ac27ad1f4e29',
    measurementId: 'G-RJ2045KT04'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }
