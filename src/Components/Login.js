import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import env from "react-dotenv";
import Swal from "sweetalert2"; 


function Login() {
	const CLIENTID = `${env.CLIENT_ID}`
	
	const [passwordShown, setPasswordShown] = useState(false);
	const [values, setValues] = useState({
		username: '',
		password: '',
	});
	// const [dataLogin, setDataLogin] = useState({});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		if(localStorage.getItem('access_token') != null){
			navigate('/dashboard');
		}
	},[])

	const handleChange = (e) => {
		const { name, value } = e.target
		setValues({
			...values,
			[name]: value
		})
	}

	const validateInput = (values) => {
		// console.log(values)
		let error = {}
		
		if(!values.username.trim()){
			error.username = 'Email atau Nomor Induk tidak boleh kosong'
		}

		if(values.password.length < 8){
			error.password = 'Kata Sandi harus 8 karakter'
		}

		// console.log(error)
		return error
	}

	const ResponToastError = (icon, msg) => {
    Swal.fire({  
      title: 'Pemberitahuan',  
      text: msg,  
      icon: icon,    
			confirmButtonText: 'Tutup',
			allowOutsideClick: false
    });
	}

	const ResponToast = (icon, msg) => {
    Swal.fire({  
      title: 'Pemberitahuan',  
      text: msg,  
      icon: icon,    
			showConfirmButton: false,
			allowOutsideClick: false
    });
	}
  
	const onSuccess = (res) => {
		// console.log(res)
		masukGmail(res.profileObj)
	}

	const onFailure = (res) => {
		ResponToastError('error', 'Gagal masuk panel')
	}

	const masukGmail = async(data) => {
		try {
			const login = await axios.post(`${env.SITE_URL}restApi/moduleLogin/loginBygmail`, {
				email: data.email
			});
			if(login){
				localStorage.setItem('idProfile', login.data.data[0].id)
				localStorage.setItem('namaLengkap', login.data.data[0].name)
				localStorage.setItem('roleID', login.data.data[0].roleID)
				localStorage.setItem('access_token', login.data.data.access_token)
				const masukLog = await axios.post(`${env.SITE_URL}restApi/moduleLogin/postImage`, {
					email: data.email,
					gambar: data.imageUrl,
				});
				ResponToast('success', masukLog.data.message)
			}
			navigate('/dashboard');
			window.location.reload()
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToastError('error', message)
			}
		}
	}

	const masuk = async(e) => {
		e.preventDefault();
		setErrors(validateInput(values))
		try {
			const login = await axios.post(`${env.SITE_URL}restApi/moduleLogin/login`, {
				username: values.username,
				password: values.password,
			});
			if(login){
				localStorage.setItem('idProfile', login.data.data[0].id)
				localStorage.setItem('namaLengkap', login.data.data[0].name)
				localStorage.setItem('roleID', login.data.data[0].roleID)
				localStorage.setItem('access_token', login.data.data.access_token)
			}
			ResponToast('success', login.data.message)
			navigate('/dashboard');
			window.location.reload()
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToastError('error', message)
			}
		}
	}
	
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

	return (
		<div>
			<div className='login-page'>
				<div className="login-box">
					<div className="login-logo-css">
						<img style={{width: '35%'}} src='gatsa.png' alt="SEKOLAH MTsS SIROJUL ATHFAL" />
					</div>
					<div className="card">
						<div className="card-body login-card-body">
							<p className="login-box-msg">Masuk untuk memulai sesi Anda</p>
							<form onSubmit={masuk}>
								<div className="input-group mb-3">
									<input type="text" className="form-control" name='username' placeholder="Email atau Nomor Induk" autoComplete="off" value={values.username} onChange={handleChange} />
									<div className="input-group-append">
										<div className="input-group-text">
											<span className="fas fa-envelope" />
										</div>
									</div>
								</div>
								<p className='errorMsg'>{errors.username}</p>
								<div className="input-group mb-3">
									<input type={passwordShown ? "text" : "password"} className="form-control" name='password' placeholder="Kata Sandi" autoComplete="off" value={values.password} onChange={handleChange} />
									<div className="input-group-append">
										<div className="input-group-text">
											<span onClick={togglePassword} className={!passwordShown ? "fas fa-eye" : "fas fa-eye-slash"} />
										</div>
									</div>
								</div>
								<p className='errorMsg'>{errors.password}</p>
								<div className="row">
									<div className="col-12">
										<button type="submit" className="btn btn-primary btn-block">Masuk</button>
									</div>
								</div>
							</form>
							<div className="social-auth-links text-center mb-3">
								<GoogleLogin
									clientId={CLIENTID}
									render={ renderProps => (
										<button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn btn-block btn-danger"><i className="fab fa-google-plus mr-2" /> Masuk dengan Google+</button>
									)}
									onSuccess={onSuccess}
									onFailure={onFailure}
									cookiePolicy={'single_host_origin'}
								/>
							</div>

							<p className="mb-1">
								<Link to='/'>Lupa Kata Sandi</Link>
							</p>
							{/* <p className="mb-0">
								Belum punya akun ? <Link to='/register'>Daftar Akun</Link>
							</p> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
