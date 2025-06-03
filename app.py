from flask import Flask, request, render_template_string

app = Flask(__name__)

FLAG = "FLAG{bypassed_login_using_sql_injection}"

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = request.form['username']
        pwd = request.form['password']
        
        # Vulnerable query (no input sanitization)
        query = f"SELECT * FROM users WHERE username = '{user}' AND password = '{pwd}'"
        
        # Simulate vulnerable logic (not actually querying a DB)
        if "' OR '" in pwd or "1=1" in pwd:
            return f"<h3>Welcome, {user}!</h3><p>Your flag is: {FLAG}</p>"
        else:
            return "<p>Login failed.</p>"
    
    return render_template_string('''
        <h2>Login</h2>
        <form method="post">
            Username: <input name="username"><br>
            Password: <input name="password" type="password"><br>
            <input type="submit" value="Login">
        </form>
    ''')

if __name__ == '__main__':
    app.run(debug=True)
