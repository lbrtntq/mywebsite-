import os
from flask import Blueprint, render_template, redirect, url_for, request, flash, session
from app.services.auth_service import AuthService

bp = Blueprint('auth', __name__, url_prefix='/admin')

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        env_user = os.environ.get('ADMIN_USERNAME', 'admin')
        env_pass = os.environ.get('ADMIN_PASSWORD', 'admin') # In real prod, this should be pre-hashed in DB
        
        # Simple env-based auth for this portfolio (or could use DB users)
        if username == env_user and password == env_pass:
            session['admin_logged_in'] = True
            return redirect(url_for('gallery.dashboard'))
        else:
            flash('Invalid credentials', 'error')
            
    return render_template('admin/login.html')

@bp.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('auth.login'))
