import Form from "../../../components/Form";

function Register() {
    return <Form route={`${import.meta.env.VITE_API_URL}/api/auth/register/`} method="register" />;
}

export default Register;