import React, { useState, useEffect  } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import env from 'react-dotenv'

function Menu(props) {
	const gbr = props.dataUser.codeLog === 1 ? props.dataUser.gambar != null ? `${env.SITE_URL}images/${props.dataUser.gambar}` : 'dist/img/user.png' : props.dataUser.codeLog === 2 ? props.dataUser.gambarGmail : 'dist/img/user.png';	
	const mengajarKelas = String(props.dataUser.mengajar_kelas)
	let myArray = mengajarKelas.split(', ').sort()
	const [Kelas7, setKelas7] = useState([]);
	const [Kelas8, setKelas8] = useState([]);
	const [Kelas9, setKelas9] = useState([]);

	// useEffect(() => {
	// 	// console.log(mengajarKelas)
	// 	myArray.forEach(kelas => {
	// 		// console.log(kelas)
	// 		getKelas(kelas)	
	// 	});
	// },[mengajarKelas])

	const getKelas = async(kelas) => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getkelas?kelas=${kelas}`);
			// console.log(response.data.data)
			if(kelas === '7'){setKelas7(response.data.data)}
			if(kelas === '8'){setKelas8(response.data.data)}
			if(kelas === '9'){setKelas9(response.data.data)}
		} catch (error) {
			console.log(error.response.data)
		}
	}

	const LowerCase = (str) => {
		const kata = String(str)
		return kata.split(' ').map(i => i[0].toUpperCase() + i.substring(1).toLowerCase()).join(' ')
	}

	return (
		<>
			<aside className="main-sidebar sidebar-dark-primary elevation-4">
				<Link to='/dashboard' className="brand-link">
					<img src="gatsa.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
					<span className="brand-text font-weight-light">MTsS SIROJUL ATHFAL</span>
				</Link>
				<div className="sidebar">
					<div className="user-panel mt-3 pb-3 mb-3 d-flex">
						<div className="image">
							<img src={gbr} className="img-circle elevation-2" alt="User Image" style={{width: '32px', height: '32px'}} />
						</div>
						<div className="info" style={{fontSize: 12}}>
							<Link to='/profile' className="d-block">{LowerCase(props.namaLengkap)}</Link>
						</div>
					</div>
					<div className="form-inline">
						<div className="input-group" data-widget="sidebar-search">
							<input className="form-control form-control-sidebar" type="search" placeholder="Cari Menu" aria-label="Search" />
							<div className="input-group-append">
								<button className="btn btn-sidebar">
									<i className="fas fa-search fa-fw" />
								</button>
							</div>
						</div>
					</div>
					<nav className="mt-2">
						<ul className="nav nav-pills nav-sidebar nav-flat nav-compact flex-column" data-widget="treeview" role="menu" data-accordion="false">
							<li className="nav-item">
								<Link to="/dashboard" className='nav-link'>
									<i className="nav-icon fas fa-tachometer-alt" />
									<p> Dashboard</p>
								</Link>
							</li>
							{props.roleID === '1' &&
								<li className="nav-item">
									<a className="nav-link" style={{cursor: 'pointer'}}>
										<i className="nav-icon fas fa-key" />
										<p> Data Master <i className="right fas fa-angle-left" /></p>
									</a>
									<ul className="nav nav-treeview">
										<li className="nav-item">
											<a className="nav-link" style={{cursor: 'pointer'}}>
												<i className="nav-icon fas fa-users" />
												<p> Data Pengguna <i className="right fas fa-angle-left" /></p>
											</a>
											<ul className="nav nav-treeview">
												<li className="nav-item">
													<Link to="/pengguna?page=administrator" className="nav-link">
														<i className="far fa-user nav-icon" />
														<p> Administrator</p>
													</Link>
												</li>
												<li className="nav-item">
													<Link to="/pengguna?page=guru" className="nav-link">
														<i className="far fa-user nav-icon" />
														<p> Guru</p>
													</Link>
												</li>
												<li className="nav-item">
													<Link to="/pengguna?page=siswa" className="nav-link">
														<i className="far fa-user nav-icon" />
														<p> Siswa</p>
													</Link>
												</li>
											</ul>
										</li>
										<li className="nav-item">
											<a className="nav-link" style={{cursor: 'pointer'}}>
												<i className="nav-icon fas fa-university" />
												<p> Data Akademis <i className="right fas fa-angle-left" /></p>
											</a>
											<ul className="nav nav-treeview">
												<li className="nav-item">
													<Link to="/kelas" className="nav-link">
														<i className="fas fa-archive nav-icon" />
														<p> Data Kelas</p>
													</Link>
												</li>
												<li className="nav-item">
													<Link to="#" className="nav-link">
														<i className="fas fa-archive nav-icon" />
														<p> Data Kelas Siswa</p>
													</Link>
												</li>
											</ul>
										</li>
									</ul>
								</li>
							}
							{props.roleID === '2' &&
								<>
									{props.dataUser.jabatan_guru === 'Wali Kelas' && 
										<li className="nav-item">
											<Link to={`/kelassiswa?page=${props.dataUser.walikelas}`} className="nav-link">
												<i className="far fa-user nav-icon" />
												<p> Wali Kelas {props.dataUser.walikelas}</p>
											</Link>
										</li>
									}
									<li className="nav-item">
										<a className="nav-link" style={{cursor: 'pointer'}}>
											<i className="nav-icon fas fa-key" />
											<p> Kelas <i className="right fas fa-angle-left" /></p>
										</a>
										<ul className="nav nav-treeview">
											{myArray.map(kelas => (  
												<li className="nav-item" key={kelas}>
													<Link to={`/kelassiswa?page=${kelas}`} className="nav-link">
														<i className="far fa-user nav-icon" />
														<p> Kelas {kelas}</p>
													</Link>
												</li>
											))}
										</ul>
									</li>
								</>
							}
							{/* <ul className="nav nav-treeview">
								{kelas === "7" && Kelas7.map(kelasChild => (
									<li className="nav-item" key={kelasChild.value}>
										<Link to={`/kelassiswa?page=${kelasChild.value}`} className="nav-link">
											<i className="far fa-user nav-icon" />
											<p> Kelas {kelasChild.value}</p>
										</Link>
									</li>
								))}
								{kelas === "8" && Kelas8.map(kelasChild => (
									<li className="nav-item" key={kelasChild.value}>
										<Link to={`/kelassiswa?page=${kelasChild.value}`} className="nav-link">
											<i className="far fa-user nav-icon" />
											<p> Kelas {kelasChild.value}</p>
										</Link>
									</li>
								))}
								{kelas === "9" && Kelas9.map(kelasChild => (
									<li className="nav-item" key={kelasChild.value}>
										<Link to={`/kelassiswa?page=${kelasChild.value}`} className="nav-link">
											<i className="far fa-user nav-icon" />
											<p> Kelas {kelasChild.value}</p>
										</Link>
									</li>
								))}
							</ul> */}
						</ul>
					</nav>
				</div>
			</aside>
		</>
	)
}

export default Menu
