import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import env from "react-dotenv";

function Dashboard(props) {
	const roleID = localStorage.getItem('roleID')
	const idProfile = localStorage.getItem('idProfile')
	const [expire, setExpire] = useState('');
	const [DataGuru, setDataGuru] = useState({});
	const [TotalDataArray, setTotalDataArray] = useState([]);
	const [TotalDataObject, setTotalDataObject] = useState({});
	const navigate = useNavigate();

	const Kelas = DataGuru.mengajar_bidang
	const Bidang = DataGuru.mengajar_bidang

	useEffect(() => {
		getData(roleID, idProfile)
	},[roleID, idProfile])

	const getData = async(roleID, idProfile) => {
		const kode = roleID === '1' ? 'admin' : roleID === '2' ? 'guru' : roleID === '3' && 'siswa'
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleuser/dataDashboard?kode=${kode}&id_profile=${idProfile}`);
			if(kode === 'admin') { setTotalDataObject(response.data.totalData); }
			else if(kode === 'guru') { 
				setTotalDataArray(response.data.totalData.total)
				setDataGuru(response.data.totalData.dataGuru)
			}
		} catch (error) {
			console.log(error.response.data)
		}
	}

	const refreshToken = async() => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleLogin/token/${localStorage.getItem('idProfile')}`);
			localStorage.setItem('access_token', response.data.access_token)
			const decoded = jwt_decode(response.data.access_token);
			setExpire(decoded.exp);
		} catch (error) {
			if(error.response){
				navigate('/');
			}
		}
	}

	return (
		<div className="content-wrapper">
			<section className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1>{props.title}</h1>
						</div>
						<div className="col-sm-6">
							<ol className="breadcrumb float-sm-right">
								<li className="breadcrumb-item active">{props.title}</li>
							</ol>
						</div>
					</div>
					<div className='row'>
						<div className='col-sm-12'>
							<h6 className='float-sm-right'>Selamat Datang, {localStorage.getItem('namaLengkap')}</h6>
						</div>
					</div>
				</div>
			</section>

			<section className="content">
				{roleID === '1' &&
					<div className='row'>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-success">
								<div className="inner">
									<h3>{TotalDataObject.dataSiswaPria}</h3>
									<p><b>Siswa</b><br/>Jenis Kelamin : Laki - Laki (Aktif)</p>
								</div>
								<div className="icon"><i className="fas fa-users" /></div>
								<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
							</div>
						</div>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-success">
								<div className="inner">
									<h3>{TotalDataObject.dataSiswaWanita}</h3>
									<p><b>Siswi</b><br/>Jenis Kelamin : Perempuan (Aktif)</p>
								</div>
								<div className="icon"><i className="fas fa-users" /></div>
								<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
							</div>
						</div>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-warning">
								<div className="inner">
									<h3>{TotalDataObject.dataSiswaMutasi}</h3>
									<p><b>Siswa/i</b><br/>(Mutasi)</p>
								</div>
								<div className="icon"><i className="fas fa-users" /></div>
								<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
							</div>
						</div>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-primary">
								<div className="inner">
									<h3>{TotalDataObject.dataGuru}</h3>
									<p><br/>Guru / Pegawai (Aktif)</p>
								</div>
								<div className="icon"><i className="fas fa-users" /></div>
								<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
							</div>
						</div>
					</div>
				}
				{roleID === '2' && Kelas !== null && Bidang !== null &&
					<div className='row'>
						{TotalDataArray && TotalDataArray.map(value => (
							<div className="col-lg-3 col-6" key={value.kelas}>
								<div className="small-box bg-success">
									<div className="inner">
										<h3>{value.jumlahSiswa}</h3>
										<p><b>Siswa/i Kelas {value.kelas}</b></p>
									</div>
									<div className="icon"><i className="fas fa-users" /></div>
									<Link to={`/kelassiswa?page=${value.kelas}`} className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></Link>
								</div>
							</div>
						))}
					</div>
				}
				{/* <div className="card">
					<div className="card-body">
						<h2>SELAMAT DATANG</h2>
					</div>
				</div>				 */}
			</section>
		</div>
	)
}

export default Dashboard
