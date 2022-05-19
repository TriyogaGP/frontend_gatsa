import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import env from "react-dotenv";
import Swal from "sweetalert2"; 

function Lockscreen() {	
	const [passwordShown, setPasswordShown] = useState(false);
	const [data, setData] = useState({});
	const gbr = data.codeLog === 1 ? data.gambar != null ? `${env.SITE_URL}images/${data.gambar}` : 'dist/img/user.png' : data.codeLog === 2 ? data.gambarGmail : 'dist/img/user.png';
	const [values, setValues] = useState({
		password: '',
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const d = new Date();
	let year = d.getFullYear();

	useEffect(() => {
		if(localStorage.getItem('access_token') != null){
			getData()
		}else{
			ResponToastError('error', 'Tidak bisa mengakses halaman ini !')
			navigate('/')
		}
	},[])

	const getData = async() => {
		const response = await axios.get(`${env.SITE_URL}api/v1/moduleMain/getuserslookscreen/${localStorage.getItem('idProfile')}`);
		setData(response.data.result);
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setValues({
			...values,
			[name]: value
		})
	}

	const validateInput = (values) => {
		let error = {}
		if(values.password.length < 8){
			error.password = 'Kata Sandi harus 8 karakter'
		}

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

	const masuk = async(e) => {
		e.preventDefault();
		setErrors(validateInput(values))
		try {
			const login = await axios.post(`${env.SITE_URL}api/v1/moduleMain/login`, {
				username: data.email,
				password: values.password,
				jenis: "nonGmail"
			});
			if(login){
				localStorage.setItem('idProfile', login.data.result.id)
				localStorage.setItem('namaLengkap', login.data.result.name)
				localStorage.setItem('roleID', login.data.result.roleID)
				localStorage.setItem('access_token', login.data.result.accessToken)
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
	
	const masukGmail = async() => {
		try {
			const login = await axios.post(`${env.SITE_URL}api/v1/moduleMain/login`, {
				username: data.email,
				gambar: data.gambarGmail,
				jenis: "Gmail"
			});
			if(login){
				localStorage.setItem('idProfile', login.data.result.id)
				localStorage.setItem('namaLengkap', login.data.result.name)
				localStorage.setItem('roleID', login.data.result.roleID)
				localStorage.setItem('access_token', login.data.result.accessToken)
				// await axios.post(`${env.SITE_URL}api/v1/moduleMain/updateprofile`, {
				// 	email: data.email,
				// 	ubah: "loginGmail"
				// });
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
	
  const gotoLogin = () => {
		localStorage.clear()
		navigate('/');
  };

	return (
		<>
			<div className="lockscreen-wrapper">
				<div className="lockscreen-logo">
					<a href="../../index2.html"><b>Aplikasi</b></a>
				</div>
				{ data.codeLog === 1 ? 
					<>
						<div className="lockscreen-name">{localStorage.getItem('namaLengkap')}</div>
						<div className="lockscreen-item" style={{width: '100%'}}>
							<div className="lockscreen-image">
								<img src={gbr} alt="User Image" />
							</div>
							<div className="lockscreen-credentials">
								<div className="input-group">
									<input type={passwordShown ? "text" : "password"} className="form-control" name='password' placeholder="Kata Sandi" autoComplete="off" value={values.password} onChange={handleChange} onKeyPress={(e) => {if(e.key == "Enter"){e.preventDefault(); masuk(e);}}} />
									<div className="input-group-append">
										<button type="button" className="btn">
											<span onClick={togglePassword} className={!passwordShown ? "fas fa-eye" : "fas fa-eye-slash"} />
										</button>
										<button type="button" className="btn">
											<i onClick={masuk} className="fas fa-arrow-right text-muted" />
										</button>
									</div>
								</div>
							</div>
						</div>
						<p className='errorMsg' style={{paddingLeft: '65px'}}>{errors.password}</p>
						<div className="help-block text-center">
							Masukkan kata sandi Anda untuk mengambil sesi Anda
						</div>
					</>
				 : 
				 	<div className="lockscreen-item" style={{width: '100%'}}>
						<div className="lockscreen-image">
							<img src={gbr} alt="User Image" />
						</div>
						<div className="lockscreen-credentials">
							<div className="input-group">
								<div className="form-control">{localStorage.getItem('namaLengkap')}</div>
								<div className="input-group-append">
									<button type="button" className="btn">
										<i onClick={masukGmail} className="fas fa-arrow-right text-muted" />
									</button>
								</div>
							</div>
						</div>
					</div>
				} 
				<div className="text-center">
					<a onClick={gotoLogin} className="text-black" style={{cursor: 'pointer'}}>Atau masuk dengan akun yang lain</a>
				</div>
				<div className="lockscreen-footer text-center">
					Copyright © {year} <b><a href="/dashboard" className="text-black">MTsS SIROJUL ATHFAL</a></b><br />
					All rights reserved
				</div>
			</div>			
		</>
	)
}

export default Lockscreen
