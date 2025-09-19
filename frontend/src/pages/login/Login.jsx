import Form from "../../components/Form";

function Login() {
    return <Form route={`${import.meta.env.VITE_API_URL}/api/auth/login/`} method="login" />;
}

export default Login;