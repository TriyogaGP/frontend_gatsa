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

function Penilaian(props) {
	const [values, setValues] = useState([])
	const [DataNilai, setDataNilai] = useState([])
	const [MengajarArray, setMengajarArray] = useState([]);
	const [MengajarKelasArray, setMengajarKelasArray] = useState([]);
	const [EditValues, setEditValues] = useState({});
	const [Mapel, setMapel] = useState(null);
	const [Kelas, setKelas] = useState(null);
	const [loading, setLoading] = useState(false);
	const [FlagUbahNilai, setFlagUbahNilai] = useState(false);
	const navigate = useNavigate();
	const { search } = useLocation();
	
	useEffect(() => {
		setFlagUbahNilai(false)
		if(Mapel&&Mapel.label != null && Kelas&&Kelas.label != null){
			setLoading(true)
			setTimeout(() => {
				// console.log(Mapel&&Mapel.label, Kelas&&Kelas.label)
				getNilai(Mapel&&Mapel.label, Kelas&&Kelas.label)
			}, 2000);
		}else{
			setLoading(false)
			setDataNilai([])
		}
	},[Mapel, Kelas])
	
	useEffect(() => {
		setKelas(null)
		setMapel(null)
		getData()
	},[])

	const getData = async() => {
		const response = await axios.get(`${env.SITE_URL}restApi/moduleLogin/getusers/${localStorage.getItem('idProfile')}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		});
		setValues(response.data.data);
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
	}

	const getNilai = async(mapel, kelas) => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/penilaian?mapel=${mapel}&kelas=${kelas}`);
			setLoading(false)
			setDataNilai(response.data.data);
		} catch (error) {
			setLoading(false)
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
		
	}

	const SimpanNilai = () => {
    toggleUbahNilai(!FlagUbahNilai)
  }

	const toggleUbahNilai = (aksi) => {
    setFlagUbahNilai(aksi);
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
			key: "nomor_induk",
			text: "NISN",
			className: "nomor_induk",
			width: '15%',
			align: "center",
		},
		{
			key: "name",
			text: "Nama Lengkap",
			className: "name",
			align: "center",
			width: '15%',
			cell: record => { 
				return (
					<Fragment>
						<div className='capitalize' style={{textAlign: 'left'}}>
							{Lower(record.name)}
						</div>
					</Fragment>
				);
			}
		},
		{
			key: "nilai",
			text: "Nilai",
			className: "nilai",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<Fragment>
						<div style={{textAlign: 'center'}}>
							{!FlagUbahNilai ? 
								(record.kelas ? record.kelas : '-')
							:
								<div className="form-group">
									<input type="text" className="form-control" name={"nilai"+record.kelas} value={record.kelas} autoComplete="off" maxLength="20" value={record.kelas} onChange={(e) => e.target.name} />
								</div>
							}
						</div>
					</Fragment>
				);
			}
		},
	]

	const config = {
		key_column: 'name',
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
								<div className='col-sm-8'>
									<div className='row'>
										<div className='col-sm-6'>
											<div className="form-group">
												<label htmlFor="name">Mata Pelajaran</label>
												<Select
													placeholder='Pilih Mata Pelajaran'
													value={Mapel}
													onChange={(x) => {setMapel(x)}}
													options={MengajarArray}
													isClearable
												/>
											</div>
										</div>
										<div className='col-sm-6'>
											<div className="form-group">
												<label htmlFor="name">Kelas</label>
												<Select
													placeholder='Pilih Kelas'
													value={Kelas}
													onChange={(x) => {setKelas(x)}}
													options={MengajarKelasArray}
													isClearable
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<hr style={{border: 'solid 1px #000', marginBottom: '30px'}} />
							<div className='row'>
								<div className='col-sm-12 mb-4'>
									{!FlagUbahNilai ? 
										<button className="btn btn-primary btn-xs float-sm-right" title="Ubah Data" onClick={() => {toggleUbahNilai(!FlagUbahNilai)}}>
											<i className="fa fa-pencil-alt"></i> Ubah Nilai 
										</button>
									:
										<button className="btn btn-primary btn-xs float-sm-right" title="Ubah Data" onClick={SimpanNilai}>
											<i className="fa fa-save"></i> Simpan Nilai
										</button>
									}
								</div>
							</div>
							<ReactDatatable
								config={config}
								records={DataNilai}
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

export default Penilaian