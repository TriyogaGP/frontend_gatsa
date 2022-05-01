import React, { useState, useEffect, useRef, Fragment  } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import ReactDatatable from '@ashvin27/react-datatable';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import env from "react-dotenv";
import Swal from "sweetalert2";

function JadwalMengajar(props) {
  const [DataGuru, setDataGuru] = useState([])
  const [values, setValues] = useState([])
	const [DataNilai, setDataNilai] = useState([])
	const [MengajarArray, setMengajarArray] = useState([]);
	const [MengajarKelasArray, setMengajarKelasArray] = useState([]);
	const [EditValues, setEditValues] = useState({});
	const [Guru, setGuru] = useState(null);
	const [Mapel, setMapel] = useState(null);
	const [Kelas, setKelas] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { search } = useLocation();
	
	useEffect(() => {
		setGuru(null)
		setKelas(null)
		setMapel(null)
		getGuru()
	},[])

	const getGuru = async() => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getusers/?idRole=2&idProfile=${localStorage.getItem('idProfile')}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			});
			let dataGuru = new Array()
			let Guru = response.data.data
			Guru.sort().map((x)=>{
				dataGuru.push({value: x.id, label: x.name})
			})
			setDataGuru(dataGuru);
		} catch (error) {
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const getData = async(x) => {
		if(x != null){
			const response = await axios.get(`${env.SITE_URL}restApi/moduleLogin/getusers/${x.value}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			});
			getJadwal(x.value)
			const mengajarKelas = String(response.data.data.mengajar_kelas)
			const mengajarBidang = String(response.data.data.mengajar_bidang)
			let MengajarKelas = mengajarKelas.split(', ').sort()
			let MengajarBidang = mengajarBidang.split(', ').sort()
			let mapel = new Array()		
			let kelas = new Array()		
			MengajarBidang.sort().map((nilai)=>{
				mapel.push({value: nilai, label: nilai})
			})
			MengajarKelas.sort().map((nilai)=>{
				kelas.push({value: nilai, label: nilai})
			})
			setMengajarArray(mapel)
			setMengajarKelasArray(kelas)
		}else{
			setValues([])
			setMengajarArray([])
			setMengajarKelasArray([])
			console.log('masuk sini')
		}
	}

	const getJadwal = async(id) => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getjadwalNgajar/${id}`);
			// console.log(response.data.data)
			setValues(response.data.data);
		} catch (error) {
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const simpanData = async(e) => {
		e.preventDefault();
		const payload = {
			id: Guru && Guru.value,
			mapel: Mapel && Mapel.value,
			kelas: Kelas && Kelas.value
		}
		if(!payload.id || !payload.mapel || !payload.kelas) return ResponToast('error', 'Form masih ada yang kosong, tolong lengkapi terlebih dahulu. TerimaKasih')
		try {
			const simpan = await axios.post(`${env.SITE_URL}restApi/moduleUser/jadwalngajar`, payload); 
			getJadwal(payload.id)
			setKelas(null)
			setMapel(null)
			ResponToast('success', simpan.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				setGuru(null)
				setKelas(null)
				setMapel(null)
				ResponToast('error', message)
			}
		}
	}

	const deleteRecord = async(record) => {
		try {
			const dataJadwal = await axios.delete(`${env.SITE_URL}restApi/moduleUser/jadwalNgajar/${record.id_jadwal}`);
			getData(Guru)
			ResponToast('success', dataJadwal.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToast('error', message)
			}
		}
	}

	const selectStatus = async(e) => {
		let kondisi = e.target.checked === true ? '1' : '0'
		try {
			const Status = await axios.post(`${env.SITE_URL}restApi/moduleUser/updateuserby`, {
				id: e.target.value,
				table: 'jadwal_mengajar',
				activeStatus: kondisi,
			});
			setValues([])
			getData(Guru)
			ResponToast('success', Status.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToast('error', message)
			}
		}
	}

	const ResponToast = (icon, msg) => {
		Swal.fire({  
		  title: 'Pemberitahuan',  
		  text: msg,  
		  icon: icon,    
				confirmButtonText: 'Tutup',
				allowOutsideClick: false
		});
	}
	
	const ResponToastUpload = (icon, msg) => {
		Swal.fire({  
		  title: 'Pemberitahuan',  
		  text: msg,  
		  icon: icon,    
				showConfirmButton: false,
				allowOutsideClick: false
		});
	}

	const Lower = (str) => {
		const kata = String(str)
		return kata.toLowerCase()
	}

	const LowerCase = (str) => {
		const kata = String(str)
		return kata.split(' ').map(i => i[0].toUpperCase() + i.substring(1).toLowerCase()).join(' ')
	}

	const columns = [
		{
			key: "item_no",
			text: "No",
			className: "item_no",
			align: "center",
			width: '5%',
			sortable: true,
			cell: record => {
				return(
					<div style={{textAlign: 'center'}}>{record.item_no}</div>
				)
			}
		},
		{
			key: "mapel",
			text: "Mata Pelajaran",
			className: "mapel",
			width: '15%',
			align: "center",
		},
		{
			key: "kelas",
			text: "Kelas",
			className: "kelas",
			align: "center",
			width: '10%',
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>{record.kelas}</div>
				);
			}
		},
		{
			key: "status",
			text: "Aktif Jadwal",
			className: "status",
			width: '10%',
			align: "center",
			cell: record => { 
				return (
					<Fragment>
						<div style={{textAlign: 'center'}}>
							<div className="form-group">
								<div className="custom-control custom-switch custom-switch-off-default custom-switch-on-success">
									<input type="checkbox" className="custom-control-input" id={"status"+record.id_jadwal} value={record.id_jadwal} onChange={(e) => selectStatus(e)} defaultChecked={record.status === 0 ? '' : 'checked' } />
									<label className="custom-control-label" htmlFor={"status"+record.id_jadwal}></label>
								</div>
							</div>
						</div>
					</Fragment>
				);
			}
		},
		{
			key: "action",
			text: "Aksi",
			className: "action",
			width: '10%',
			align: "center",
			cell: record => { 
				return (
					<Fragment>
						<div style={{textAlign: 'center'}}>
							<button
								className="btn btn-danger btn-xs"
								title="Hapus Data"
								onClick={() => deleteRecord(record)}>
								<i className="fa fa-trash-alt"></i>
							</button>
						</div>
					</Fragment>
				);
			}
		}
	]

	const config = {
		key_column: 'id_jadwal',
		page_size: 10,
		length_menu: [ 10, 20, 50 ],
		pagination: 'advance',
		language: {
			loading_text: "Harap Menunggu ...",
			no_data_text: "Tidak ada data ...",
			filter: "Cari data ...",
			length_menu: "Menampilkan _MENU_ Data per halaman",
			info: "Menampilkan _START_ sampai _END_ dari total _TOTAL_ Data",
			pagination: {
				first: "Awal",
				previous: "Sebelumnya",
				next: "Selanjutnya",
				last: "Akhir"
			},
		}
	}

	const extraButtons = [
		{
			className:"btn btn-primary",
			title:"Export TEst",
			children:[
				<span>
				<i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
				</span>
			],
			onClick:(event)=>{
				console.log(event);
			},
		},
		{
			className:"btn btn-primary buttons-pdf",
			title:"Export TEst",
			children:[
				<span>
				<i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
				</span>
			],
			onClick:(event)=>{
				console.log(event);
			},
			onDoubleClick:(event)=>{
				console.log("doubleClick")
			}
		},
	]

  return (
    <div>
			<div className="content-wrapper">
				<section className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1>{props.title}</h1>
							</div>
							<div className="col-sm-6">
								<ol className="breadcrumb float-sm-right">
									<li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
									<li className="breadcrumb-item active">{props.title}</li>
								</ol>
							</div>
						</div>
					</div>
				</section>

				<section className="content">
					<div className="card card-primary card-outline">
						<div className="card-header">
							<h3 className="card-title"><b>{props.title}</b></h3>
							<div className="card-tools">
								<button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
									<i className="fas fa-minus" />
								</button>
								<button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
									<i className="fas fa-times" />
								</button>
							</div>
						</div>
						<div className="card-body">
							<div className='row justify-content-md-center mb-2'>
								<div className='col-sm-6'>
									<div className='row'>
										<div className='col-sm-4'>
											<label htmlFor="name">Guru</label>
										</div>
										<div className='col-sm-8'>
											<div className="form-group">
												<Select
													placeholder='Pilih Guru'
													value={Guru}
													onChange={(x) => {setGuru(x); getData(x); setKelas(null); setMapel(null);}}
													options={DataGuru}
													isClearable
												/>
											</div>
										</div>
									</div>
									<div className='row'>
										<div className='col-sm-4'>
											<label htmlFor="name">Mata Pelajaran</label>
										</div>
										<div className='col-sm-8'>
											<div className="form-group">
												<Select
													placeholder='Pilih Mata Pelajaran'
													value={Mapel}
													onChange={(x) => {setMapel(x)}}
													options={MengajarArray}
													isDisabled={Guru ? false : true}
													isClearable
													/>
											</div>
										</div>
									</div>
									<div className='row'>
										<div className='col-sm-4'>
											<label htmlFor="name">Kelas</label>
										</div>
										<div className='col-sm-8'>
											<div className="form-group">
												<Select
													placeholder='Pilih Kelas'
													value={Kelas}
													onChange={(x) => {setKelas(x)}}
													options={MengajarKelasArray}
													isDisabled={Guru ? false : true}
													isClearable
												/>
											</div>
										</div>
									</div>
									<div className='row'>
										<div className='col-sm-12'>
											<button className="btn btn-primary btn-sm float-sm-right" title="Simpan Data" onClick={simpanData}>Simpan</button>
										</div>
									</div>
								</div>
							</div>
							<hr style={{border: 'solid 1px #000', marginBottom: '30px'}} />
							<b>
							{Guru ? 
								'Jadwal Mengajar : '+Guru.label
							: 
								''
							}</b>
							<ReactDatatable
								config={config}
								records={values}
								columns={columns}
								extraButtons={extraButtons}
								loading={loading}
							/>
						</div>
					</div>
				</section>
			</div>
    </div>
  )
}

export default JadwalMengajar