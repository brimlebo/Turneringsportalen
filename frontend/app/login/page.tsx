import { login } from './actions'
import styles from '../../styles/page.module.css'


export default function LoginPage() {
    return (
        <div className={styles.container}>
            <h1>Log in</h1>
            <form>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                <button formAction={login}>Log in</button>
            </form>
        </div>
    )
}
