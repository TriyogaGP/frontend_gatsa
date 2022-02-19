import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import env from "react-dotenv";

function Dashboard(props) {
	const roleID = localStorage.getItem('roleID')
	const [expire, setExpire] = useState('');
	const [TotalData, setTotalData] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		getData()
	},[])

	const getData = async(role) => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleuser/dataDashboard`);
			// console.log(response.data.data)
			setTotalData(response.data.totalData);
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
				</div>
			</section>

			<section className="content">
				{roleID === '1' &&
					<div className='row'>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-success">
								<div className="inner">
									<h3>{TotalData.dataSiswaPria}</h3>
									<p><b>Siswa/i</b><br/>Jenis Kelamin : Laki - Laki (Aktif)</p>
								</div>
								<div className="icon"><i className="fas fa-users" /></div>
								<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
							</div>
						</div>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-success">
								<div className="inner">
									<h3>{TotalData.dataSiswaWanita}</h3>
									<p><b>Siswa/i</b><br/>Jenis Kelamin : Perempuan (Aktif)</p>
								</div>
								<div className="icon"><i className="fas fa-users" /></div>
								<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
							</div>
						</div>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-warning">
								<div className="inner">
									<h3>{TotalData.dataSiswaMutasi}</h3>
									<p><b>Siswa/i</b><br/>(Mutasi)</p>
								</div>
								<div className="icon"><i className="fas fa-users" /></div>
								<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
							</div>
						</div>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-primary">
								<div className="inner">
									<h3>{TotalData.dataGuru}</h3>
									<p><br/>Guru / Pegawai (Aktif)</p>
								</div>
								<div className="icon"><i className="fas fa-users" /></div>
								<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
							</div>
						</div>
					</div>
				}
				<div className="card">
					<div className="card-body">
						<h2>SELAMAT DATANG</h2>
					</div>
				</div>				
			</section>
		</div>
	)
}

export default Dashboard
