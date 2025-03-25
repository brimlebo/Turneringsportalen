import { signup } from "../login/actions";
import styles from '../../styles/page.module.css'


export default function RegisterPage() {
    return (
        <div className={styles.container}>
            <h1>Sign up</h1>

            <form>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                <button formAction={signup}>Sign up</button>
            </form>
        </div>
    )
}
