

async function handleLogin(req, res) {
    const { user, password } = req.body;
    const users = {
        user: 'johan',
        password: '1234'
    }
    if (!user || !password) {
        return res.status(400).send('User and password are required');
    }
    else if (user !== users.user || password !== users.password) {
    console.log('problema de inicio de sesion');
    return res.status(401).send('User or password are incorrect');
    }
    console.log('inicio de sesion exitoso');
    return res.status(200).send('Login successful');
}

export const METHODS = {
    handleLogin
}