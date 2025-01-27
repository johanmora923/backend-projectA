
export function handleLogin(req, res) {
    const { user, password } = req.body;
    console.log('user:', user);
    console.log('Password:', password);
}
