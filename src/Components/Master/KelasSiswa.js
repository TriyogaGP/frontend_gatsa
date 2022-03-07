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

function KelasSiswa() {
	const accessToken = localStorage.getItem('access_token')
	const [values, setValues] = useState([])
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { search } = useLocation();
	const match = search.match(/page=(.*)/);
  const title = match?.[1]

	useEffect(() => {
		setLoading(true) 
		setTimeout(() => {
			getData(title)
		}, 1000);
	},[title])

	const getData = async(kelas) => {
		setLoading(true)
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/kelasSiswa/${kelas}`);
			// console.log(response.data.data)
			setLoading(false)
			setValues(response.data.data);
		} catch (error) {
			setLoading(false)
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const exportData = (kelas, kategori) => {
		Loading(`Sedang melakukan proses export data siswa`)
		fetch(`${env.SITE_URL}restApi/moduleuser/exportexcel/${kelas}/?export=${kategori}`, {
			method: 'GET',
      dataType: "xml",
		})
		.then(response => response.arrayBuffer())
		.then(async response => {
			// console.log(response)
			let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
			downloadBlob(blob,`DataSiswa_${kelas}.xlsx`)
			ResponToast('success', `Berhasil export data siswa`)
		})
	}

	const downloadBlob = (blob, name = '') => {
		const blobUrl = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = blobUrl;
		link.download = name;
		document.body.appendChild(link);
		link.dispatchEvent(
			new MouseEvent('click', { 
				bubbles: true, 
				cancelable: true, 
				view: window 
			})
		);
		document.body.removeChild(link);
	}

	const Loading = (msg) => {
    Swal.fire({
			title: 'Harap Menunggu',
			html: msg,
			allowOutsideClick: false,
			showConfirmButton: false,
		});
		Swal.showLoading()
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

	const ResponToastt = (icon, msg) => {
    Swal.fire({  
      title: 'Pemberitahuan',  
      text: msg,  
      icon: icon,    
			showConfirmButton: false,
			allowOutsideClick: false
    });
	}

	const Lower = (str) => {
		return str.toLowerCase()
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
			align: "center",
			width: '15%',
			sortable: true,
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
			key: "email",
			text: "Email",
			className: "email",
			width: '15%',
			align: "center",
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
								className="btn btn-success btn-xs"
								title="Lihat Data"
								// onClick={() => lookRecord(record)}
								>
								<i className="fa fa-expand-alt"></i>
							</button>
						</div>
					</Fragment>
				);
			}
		}
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

  return (
    <div className="content-wrapper">
			<section className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1>Data Kelas {title}</h1>
						</div>
						<div className="col-sm-6">
							<ol className="breadcrumb float-sm-right">
								<li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
								<li className="breadcrumb-item active">Data Kelas {title}</li>
							</ol>
						</div>
					</div>
				</div>
			</section>

			<section className="content">
				<div className="card card-primary card-outline">
					<div className="card-header">
						<h3 className="card-title"><b>Data Kelas {title}</b></h3>
						<div className="card-tools">
							<button className="btn btn-tool dropdown">
								<i className="fas fa-cogs" data-toggle="dropdown" title='Menu'/>
								<div className="dropdown-menu dropdown-menu-right">
									<a className="dropdown-item" onClick={() => exportData(title, 'dariGuru')} title="Export Data">Export Data<i className="fas fa-download" style={{float: 'right'}}/></a>
								</div>
							</button>
							<button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
								<i className="fas fa-minus" />
							</button>
							<button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
								<i className="fas fa-times" />
							</button>
						</div>
					</div>
					<div className="card-body">
						<ReactDatatable
							config={config}
							records={values}
							columns={columns}
							loading={loading}
						/>
					</div>
				</div>			
			</section>
		</div>
  )
}

export default KelasSiswa