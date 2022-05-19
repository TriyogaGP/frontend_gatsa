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
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
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
	const [Nilai, setNilai] = useState(null);
	const [Contoh, setContoh] = useState('');
	const [DataTugas, setDataTugas] = useState([]);
	const [loading, setLoading] = useState(false);
	const [FlagUbahNilai, setFlagUbahNilai] = useState(false);
	const [FlagTombol, setFlagTombol] = useState(false);
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
			setFlagTombol(true)
			setDataNilai([])
		}
	},[Mapel, Kelas])
	
	useEffect(() => {
		setNilai(null)
		setKelas(null)
		setMapel(null)
		setDataNilai([])
		getData()
	},[])

	const getData = async() => {
		const response = await axios.get(`${env.SITE_URL}api/v1/moduleMain/getusers/${localStorage.getItem('idProfile')}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		});
		setValues(response.data.result);
		const mengajarKelas = String(response.data.result.mengajar_kelas)
		const mengajarBidang = String(response.data.result.mengajar_bidang)
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
			const response = await axios.get(`${env.SITE_URL}api/v1/moduleMain/penilaian?mapel=${mapel}&kelas=${kelas}`);
			if(response.data.result.length > 0){ setFlagTombol(false) }else{ setFlagTombol(true) }
			setLoading(false)
			setDataNilai(response.data.result);
		} catch (error) {
			setLoading(false)
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
		
	}

	const SimpanNilai = async() => {
    toggleUbahNilai(!FlagUbahNilai)
		const payload = {
			mapel: Mapel&&Mapel.label, 
			triggerUbah: Nilai&&Nilai.value,
			ubahNilai: DataTugas
		}
		// console.log(payload)
		setDataNilai([])
		try {
			const simpan = await axios.post(`${env.SITE_URL}api/v1/moduleMain/ubahPenilaian`, payload); 
			setNilai(null)
			setDataTugas([])
			setLoading(true)
			getNilai(Mapel&&Mapel.label, Kelas&&Kelas.label)
			ResponToast('success', simpan.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				setNilai(null)
				setKelas(null)
				setMapel(null)
				setDataTugas([])
				ResponToast('error', message)
			}
		}
  }

	const BatalSimpan = () => {
    toggleUbahNilai(!FlagUbahNilai)
		setDataTugas([])
		setNilai(null)
	}

	const toggleUbahNilai = (aksi) => {
    setFlagUbahNilai(aksi);
  }

	const handleSave = (data) => {
		// console.log(data)
		DataTugas.map((value, key) => {
			if(String(value.id_profile) === data.name){
				DataTugas.splice(key, 1, {id_profile: data.name, nilai: data.value})
			}
		})
		// console.log(DataTugas)
	};

	const UbahNilai = () => {
		toggleUbahNilai(!FlagUbahNilai)
		let dataKumpul = new Array()
		DataNilai.map(value => {
			dataKumpul.push({id_profile: value.id, nilai: ''})
		})
		setDataTugas(dataKumpul)
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

	const minmax = (val, min, max) => {
    return val > max ? max : val < min ? min : val;
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
			key: "n_tugas1",
			text: "Tugas I",
			className: "n_tugas1",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 1' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas1 ? record.n_tugas1 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_tugas2",
			text: "Tugas II",
			className: "n_tugas2",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 2' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas2 ? record.n_tugas2 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_tugas3",
			text: "Tugas III",
			className: "n_tugas3",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 3' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas3 ? record.n_tugas3 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_tugas4",
			text: "Tugas IV",
			className: "n_tugas4",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 4' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas4 ? record.n_tugas4 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_tugas5",
			text: "Tugas V",
			className: "n_tugas5",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 5' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas5 ? record.n_tugas5 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_tugas6",
			text: "Tugas VI",
			className: "n_tugas6",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 6' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas6 ? record.n_tugas6 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_tugas7",
			text: "Tugas VII",
			className: "n_tugas7",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 7' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas7 ? record.n_tugas7 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_tugas8",
			text: "Tugas VIII",
			className: "n_tugas8",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 8' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas8 ? record.n_tugas8 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_tugas9",
			text: "Tugas IX",
			className: "n_tugas9",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 9' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas9 ? record.n_tugas9 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_tugas10",
			text: "Tugas X",
			className: "n_tugas10",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'Tugas 10' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_tugas10 ? record.n_tugas10 : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_uts",
			text: "UTS",
			className: "n_uts",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'UTS' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_uts ? record.n_uts : 0)
						}
					</div>
				);
			}
		},
		{
			key: "n_uas",
			text: "UAS",
			className: "n_uas",
			width: '7%',
			align: "center",
			cell: record => { 
				return (
					<div style={{textAlign: 'center'}}>
						{FlagUbahNilai && Nilai&&Nilai.value === 'UAS' ? 
							<EditText
								className='form-control-nilai'
								name={String(record.id)}
								onSave={handleSave}
							/>
						:
							(record.n_uas ? record.n_uas : 0)
						}
					</div>
				);
			}
		},
	]

	const config = {
		key_column: 'name',
		page_size: 50,
		length_menu: [ 50 ],
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

	const optionsNilai = [
		{ value: 'Tugas 1', label: 'Tugas 1' },
		{ value: 'Tugas 2', label: 'Tugas 2' },
		{ value: 'Tugas 3', label: 'Tugas 3' },
		{ value: 'Tugas 4', label: 'Tugas 4' },
		{ value: 'Tugas 5', label: 'Tugas 5' },
		{ value: 'Tugas 6', label: 'Tugas 6' },
		{ value: 'Tugas 7', label: 'Tugas 7' },
		{ value: 'Tugas 8', label: 'Tugas 8' },
		{ value: 'Tugas 9', label: 'Tugas 9' },
		{ value: 'Tugas 10', label: 'Tugas 10' },
		{ value: 'UTS', label: 'UTS' },
		{ value: 'UAS', label: 'UAS' },
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
								<div className='col-sm-8 mb-4'></div>
								<div className='col-sm-4 mb-4'>
									{!FlagUbahNilai ? 
										<>
											<button className="btn btn-primary btn-lg float-sm-right" title="Ubah Data" disabled={FlagTombol} onClick={() => UbahNilai()}>
												<i className="fa fa-pencil-alt"></i> Ubah Nilai 
											</button>
											<Select
												className='float-sm-right mr-2'
												placeholder='Pilih Nilai'
												value={Nilai}
												onChange={(x) => {setNilai(x);}}
												options={optionsNilai}
												isClearable
											/>
										</>
									:
										<>
											<button className="btn btn-primary btn-lg float-sm-right" title="Batal Simpan" disabled={FlagTombol} onClick={BatalSimpan}>
												<i className="fa fa-clear"></i> Batal Simpan
											</button>
											<button className="btn btn-primary btn-lg float-sm-right mr-2" title="Simpan Nilai" disabled={FlagTombol} onClick={SimpanNilai}>
												<i className="fa fa-save"></i> Simpan Nilai
											</button>
										</>
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