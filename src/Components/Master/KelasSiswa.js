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
	const [Lookvalues, setLookValues] = useState({})
	const [Viewvalues, setViewValues] = useState({})
	const [TanggalLahir, setTanggalLahir] = useState(null);
	const [Agama, setAgama] = useState(null);
	const [Hobi, setHobi] = useState(null);
	const [CitaCita, setCitaCita] = useState(null);
	const [Jenjang, setJenjang] = useState(null);
	const [StatusSekolah, setStatusSekolah] = useState(null);
	const [StatusOrtu, setStatusOrtu] = useState({
		status_ayah: null,
		status_ibu: null
	});
	const [Pendidikan, setPendidikan] = useState({
		pendidikan_ayah: null,
		pendidikan_ibu: null,
		pendidikan_wali: null,
		pendidikan_guru: null
	});
	const [Pekerjaan, setPekerjaan] = useState({
		pekerjaan_ayah: null,
		pekerjaan_ibu: null,
		pekerjaan_wali: null
	});
	const [Penghasilan, setPenghasilan] = useState(null);
	const [StatusTempatTinggal, setStatusTempatTinggal] = useState(null);
	const [JarakRumah, setJarakRumah] = useState(null);
	const [AlatTransportasi, setAlatTransportasi] = useState(null);
	const [TahunLahir, setTahunLahir] = useState({
		tahunlahir_ayah: null,
		tahunlahir_ibu: null,
		tahunlahir_wali: null
	});
	const [loading, setLoading] = useState(true);
	const [viewData, setViewData] = useState(false);
	const [Berkas, setBerkas] = useState(null);
	const [viewBerkas, setviewBerkas] = useState({
		kondisi: false,
		bagian: null
	});
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
			const response = await axios.get(`${env.SITE_URL}api/v1/moduleMain/kelasSiswa/${kelas}`);
			// console.log(response.data.data)
			setLoading(false)
			setValues(response.data.result);
		} catch (error) {
			setLoading(false)
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const lookRecord = (record) => {
		// console.log("Look Record", record);
		setLookValues(record)
		setViewValues({
			...Viewvalues, 
			nama_provinsi: Lower(record.nama_provinsi), 
			nama_kabkota: Lower(record.nama_kabkota),
			nama_kabkota_sekolah: record.nama_kabkot_sekolah ? Lower(record.nama_kabkot_sekolah) : null,
			nama_kecamatan: Lower(record.nama_kecamatan),
			nama_kelurahan: Lower(record.nama_kelurahan)
		})
		setAgama({
			value: record.agama,
			label: record.agama,
		})
		const citacita = optionsCitaCita.find(datacitacita => datacitacita.value === String(record.cita_cita));
		const hobi = optionsHobi.find(datahobi => datahobi.value === String(record.hobi));
		const jenjangsekolah = optionsJenjang.find(datajenjang => datajenjang.value === String(record.jenjang));
		const statussekolah = optionsStatusSekolah.find(datastasek => datastasek.value === String(record.status_sekolah));
		const penghasilan = optionsPenghasilan.find(datapenghasilan => datapenghasilan.value === String(record.penghasilan));
		const statusayah = optionsStatusOrtu.find(datastatusayah => datastatusayah.value === String(record.status_ayah));
		const statusibu = optionsStatusOrtu.find(datastatusibu => datastatusibu.value === String(record.status_ibu));
		const pendidikanayah = optionsPendidikan.find(datapendidikanayah => datapendidikanayah.value === String(record.pendidikan_ayah));
		const pendidikanibu = optionsPendidikan.find(datapendidikanibu => datapendidikanibu.value === String(record.pendidikan_ibu));
		const pendidikanwali = optionsPendidikan.find(datapendidikanwali => datapendidikanwali.value === String(record.pendidikan_wali));
		const pendidikanguru = optionsPendidikan.find(datapendidikanguru => datapendidikanguru.value === String(record.pendidikan_guru));
		const pekerjaanayah = optionsPekerjaan.find(datapekerjaanayah => datapekerjaanayah.value === String(record.pekerjaan_ayah));
		const pekerjaanibu = optionsPekerjaan.find(datapekerjaanibu => datapekerjaanibu.value === String(record.pekerjaan_ibu));
		const pekerjaanwali = optionsPekerjaan.find(datapekerjaanwali => datapekerjaanwali.value === String(record.pekerjaan_wali));
		const statustempattinggal = optionsStatusTempatTinggal.find(datastatustempattinggal => datastatustempattinggal.value === String(record.status_tempat_tinggal));
		const jarakrumah = optionsJarakRumah.find(datajarakrumah => datajarakrumah.value === String(record.jarak_rumah));
		const transportasi = optionsAlatTransportasi.find(datatransportasi => datatransportasi.value === String(record.transportasi));
		setHobi({
				value: hobi ? hobi.value : null,
				label: hobi ? hobi.label : null,
		})
		setCitaCita({
				value: citacita ? citacita.value : null,
				label: citacita ? citacita.label : null,
		})
		setJenjang({
			value: jenjangsekolah ? jenjangsekolah.value : null,
			label: jenjangsekolah ? jenjangsekolah.label : null,
		})
		setStatusSekolah({
			value: statussekolah ? statussekolah.value : null,
			label: statussekolah ? statussekolah.label : null,
		})
		setPenghasilan({
			value: penghasilan ? penghasilan.value : null,
			label: penghasilan ? penghasilan.label : null,
		})
		setStatusTempatTinggal({
			value: statustempattinggal ? statustempattinggal.value : null,
			label: statustempattinggal ? statustempattinggal.label : null,
		})
		setJarakRumah({
			value: jarakrumah ? jarakrumah.value : null,
			label: jarakrumah ? jarakrumah.label : null,
		})
		setAlatTransportasi({
			value: transportasi ? transportasi.value : null,
			label: transportasi ? transportasi.label : null,
		})
		setStatusOrtu({ 
			...StatusOrtu,
			status_ayah: statusayah,
			status_ibu: statusibu
		});
		setPendidikan({
			...Pendidikan,
			pendidikan_ayah: pendidikanayah,
			pendidikan_ibu: pendidikanibu,
			pendidikan_wali: pendidikanwali,
			pendidikan_guru: pendidikanguru,
		})
		setPekerjaan({
			...Pekerjaan,
			pekerjaan_ayah: pekerjaanayah,
			pekerjaan_ibu: pekerjaanibu,
			pekerjaan_wali: pekerjaanwali,
		})
		setTahunLahir({
			...TahunLahir,
			tahunlahir_ayah: record.tahun_ayah,
			tahunlahir_ibu: record.tahun_ibu,
			tahunlahir_wali: record.tahun_wali
		})
		setViewData(true)
	}

	const exportData = (kelas, kategori) => {
		Loading(`Sedang melakukan proses export data siswa`)
		fetch(`${env.SITE_URL}api/v1/moduleMain/exportexcel/${kelas}/?export=${kategori}`, {
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

	const PDFCreate = (id) => {
		// console.log(id)
		fetch(`${env.SITE_URL}api/v1/moduleMain/detailUserPDF/${id}`, {
			method: 'GET',
      dataType: "xml",
		})
		.then(response => response.arrayBuffer())
		.then(response => {
			let blob = new Blob([response], { type: 'application/pdf' })
			setBerkas(window.URL.createObjectURL(blob))
			setviewBerkas({kondisi: true, bagian: 'siswa'}); 
		})
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

	const convertDate2 = (str) => {
		const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
		const date = new Date(str);
    const mnth = bulan[date.getMonth()];
    const day = ("0" + date.getDate()).slice(-2);
  	const valueConvert = [day, mnth, date.getFullYear()].join(" ")
		return valueConvert
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
								onClick={() => lookRecord(record)}
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

	const optionsHobi = [
		{ value: '1', label: 'Olahraga' },
		{ value: '2', label: 'Kesenian' },
		{ value: '3', label: 'Membaca' },
		{ value: '4', label: 'Menulis' },
		{ value: '5', label: 'Traveling' },
		{ value: '6', label: 'Lainnya' },
	]
	
	const optionsCitaCita = [
		{ value: '1', label: 'PNS' },
		{ value: '2', label: 'TNI/PORLI' },
		{ value: '3', label: 'Guru/Dosen' },
		{ value: '4', label: 'Dokter' },
		{ value: '5', label: 'Politikus' },
		{ value: '6', label: 'Wiraswasta' },
		{ value: '7', label: 'Pekerja Seni/Lukis/Artis/Sejenis' },
		{ value: '8', label: 'Lainnya' },
	]
	
	const optionsJenjang = [
		{ value: '1', label: 'MI' },
		{ value: '2', label: 'SD' },
		{ value: '3', label: 'SD Terbuka' },
		{ value: '4', label: 'SLB-MI' },
		{ value: '5', label: 'Paket A' },
		{ value: '6', label: 'Salafiyah Ula' },
		{ value: '7', label: 'MU`adalah MI' },
		{ value: '8', label: 'SLB-SD' },
		{ value: '9', label: 'Lainnya' },
	]

	const optionsStatusSekolah = [
		{ value: '1', label: 'Negeri' },
		{ value: '2', label: 'Swasta' },
	]

	const optionsStatusOrtu = [
		{ value: '1', label: 'Masih Hidup' },
		{ value: '2', label: 'Sudah Mati' },
		{ value: '3', label: 'Tidak Diketahui' },
	]
	
	const optionsPendidikan = [
		{ value: '0', label: 'Tidak Berpendidikan Formal' },
		{ value: '1', label: 'SD/Sederajat' },
		{ value: '2', label: 'SMP/Sederajat' },
		{ value: '3', label: 'SMA/Sederajat' },
		{ value: '4', label: 'D1' },
		{ value: '5', label: 'D2' },
		{ value: '6', label: 'D3' },
		{ value: '7', label: 'S1' },
		{ value: '8', label: 'S2' },
		{ value: '9', label: '>S2' },
	]

	const optionsPekerjaan = [
		{ value: '1', label: 'Tidak Bekerja' },
		{ value: '2', label: 'Pensiunan/Almarhum' },
		{ value: '3', label: 'PNS (selain Guru/Dosen/Dokter/Bidan/Perawat)' },
		{ value: '4', label: 'TNI/Polisi' },
		{ value: '5', label: 'Guru/Dosen' },
		{ value: '6', label: 'Pegawai Swasta' },
		{ value: '7', label: 'Pengusaha/Wiraswasta' },
		{ value: '8', label: 'Pengacara/Hakim/Jaksa/Notaris' },
		{ value: '9', label: 'Seniman/Pelukis/Artis/Sejenis' },
		{ value: '10', label: 'Dokter/Bidan/Perawat' },
		{ value: '11', label: 'Pilot/Pramugari' },
		{ value: '12', label: 'Pedagang' },
		{ value: '13', label: 'Petani/Peternak' },
		{ value: '14', label: 'Nelayan' },
		{ value: '15', label: 'Buruh (Tani/Pabrik/Bangunan)' },
		{ value: '16', label: 'Sopir/Masinis/Kondektur' },
		{ value: '17', label: 'Politikus' },
		{ value: '18', label: 'Lainnya' },
	]

	const optionsStatusTempatTinggal = [
		{ value: '1', label: 'Milik' },
		{ value: '2', label: 'Rumah Orangtua' },
		{ value: '3', label: 'Rumah Saudara/Kerabat' },
		{ value: '4', label: 'Rumah Dinas' },
	]

	const optionsJarakRumah = [
		{ value: '1', label: '< 1 Km' },
		{ value: '2', label: '1 - 3 Km' },
		{ value: '3', label: '3 - 5 Km' },
		{ value: '4', label: '5 - 10 Km' },
		{ value: '5', label: '> 10 Km' },
	]

	const optionsAlatTransportasi = [
		{ value: '1', label: 'Jalan Kaki' },
		{ value: '2', label: 'Sepeda' },
		{ value: '3', label: 'Sepeda Motor' },
		{ value: '4', label: 'Mobil Pribadi' },
		{ value: '5', label: 'Antar Jemput Sekolah' },
		{ value: '6', label: 'Angkutan Umum' },
		{ value: '7', label: 'Perahu/Sampan' },
		{ value: '8', label: 'Lainnya' },
	]

	const optionsPenghasilan = [
		{ value: '1', label: '<= Rp 500.000' },
		{ value: '2', label: 'Rp 500.001 - Rp 1.000.000' },
		{ value: '3', label: 'Rp 1.000.001 - Rp 2.000.000' },
		{ value: '4', label: 'Rp 2.000.001 - Rp 3.000.000' },
		{ value: '5', label: 'Rp 3.000.001 - Rp 5.000.000' },
		{ value: '6', label: '> Rp 5.000.000' },
	]

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
						<div style={{marginTop: '1000px'}}>
							<Modal 
								open={viewData} 
								showCloseIcon={false}
								closeOnOverlayClick={false}
								classNames={{
									overlay: 'customOverlay',
									modal: 'customModal',
								}}>
								<div className="modal-header">
									<h4 className="modal-title" id="my-modal-title">
										View Siswa ({Lookvalues.name ? Lookvalues.name : '-'}) | {title} &nbsp;
										<button
											className="btn btn-primary btn-xs"
											title="PDF FILE"
											onClick={() => PDFCreate(Lookvalues.id_profile)}
											style={{marginRight: '5px'}}>
											<i className="fa fa-file-pdf"></i> PDF FILE 
										</button>
									</h4>
									<button onClick={() => setViewData(false)} className="close" aria-label="Close">
										<span aria-hidden="true">×</span>
									</button>
								</div>
								<div className="text-center">
									<img className="profile-user-img img-fluid img-circle" src={Lookvalues.gambar ? `${env.SITE_URL}images/${Lookvalues.gambar}` : 'dist/img/user.png'} alt="User profile picture" style={{width: '100px', height: '100px'}} />
								</div>
								<br/>
								<div className='row'>
									<div className='col-md-4'>NISN</div>
									<div className='col-md-8'>: {Lookvalues.nomor_induk ? Lookvalues.nomor_induk : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nomor Induk Kewarganegaraan</div>
									<div className='col-md-8'>: {Lookvalues.nik_siswa ? Lookvalues.nik_siswa : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nama Lengkap</div>
									<div className='col-md-8 capitalize'>: {Lookvalues.name ? Lookvalues.name : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Email</div>
									<div className='col-md-8'>: {Lookvalues.email ? Lookvalues.email : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Kata Sandi</div>
									<div className='col-md-8'>: ******** (Hanya administrator yang bisa melihat kata sandi ini)</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Tempat, Tanggal Lahir</div>
									<div className='col-md-8 capitalize'>: {Lookvalues.tempat ? Lookvalues.tempat : '-'}, {Lookvalues.tgl_lahir ? convertDate2(Lookvalues.tgl_lahir) : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Jenis Kelamin</div>
									<div className='col-md-8'>: {Lookvalues.jeniskelamin ? Lookvalues.jeniskelamin : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Anak Ke</div>
									<div className='col-md-8'>: {Lookvalues.anakke ? Lookvalues.anakke : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Jumlah Saudara</div>
									<div className='col-md-8'>: {Lookvalues.jumlah_saudara ? Lookvalues.jumlah_saudara : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Agama</div>
									<div className='col-md-8'>: {Agama ? Agama.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Hobi</div>
									<div className='col-md-8'>: {Hobi ? Hobi.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Cita - Cita</div>
									<div className='col-md-8'>: {CitaCita ? CitaCita.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Telepon</div>
									<div className='col-md-8'>: {Lookvalues.telp ? Lookvalues.telp : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Alamat</div>
									<div className='col-md-8 capitalize'>: {Lookvalues.alamat+', '}
										{Viewvalues.nama_kelurahan+', '}
										{Viewvalues.nama_kecamatan+', '}
										{Viewvalues.nama_kabkota+', '}
										{Viewvalues.nama_provinsi+', '}
										{Lookvalues.kode_pos}
									</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Status Tempat Tinggal</div>
									<div className='col-md-8 capitalize'>: {StatusTempatTinggal ? StatusTempatTinggal.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Jarak Tempat Tinggal</div>
									<div className='col-md-8 capitalize'>: {JarakRumah ? JarakRumah.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Alat Transportasi</div>
									<div className='col-md-8 capitalize'>: {AlatTransportasi ? AlatTransportasi.label : '-'}</div>
								</div>
								<hr/><h5>DATA SEKOLAH SEBELUMNYA</h5><hr/>
								<div className='row'>
									<div className='col-md-4'>Jenjang Sekolah</div>
									<div className='col-md-8'>: {Jenjang ? Jenjang.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Status Sekolah</div>
									<div className='col-md-8'>: {StatusSekolah ? StatusSekolah.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nama Sekolah</div>
									<div className='col-md-8 capitalize'>: {Lookvalues.nama_sekolah ? Lookvalues.nama_sekolah : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>NPSN</div>
									<div className='col-md-8'>: {Lookvalues.npsn ? Lookvalues.npsn : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Alamat Sekolah</div>
									<div className='col-md-8 capitalize'>: {Lookvalues.alamat_sekolah ? Lookvalues.alamat_sekolah : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Kabupaten/Kota Lokasi Sekolah</div>
									<div className='col-md-8 capitalize'>: {Viewvalues.nama_kabkota_sekolah ? Viewvalues.nama_kabkota_sekolah : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nomor Peserta UN</div>
									<div className='col-md-8'>: {Lookvalues.no_peserta_un ? Lookvalues.no_peserta_un : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nomor SKHUN</div>
									<div className='col-md-8'>: {Lookvalues.no_skhun ? Lookvalues.no_skhun : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nomor Ijazah</div>
									<div className='col-md-8'>: {Lookvalues.no_ijazah ? Lookvalues.no_ijazah : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Total Nilai UN</div>
									<div className='col-md-8'>: {Lookvalues.nilai_un ? Lookvalues.nilai_un : '-'}</div>
								</div>
								<hr/><h5>DATA ORANG TUA / WALI</h5><hr/>
								<div className='row'>
									<div className='col-md-4'>Nomor Kartu Keluarga</div>
									<div className='col-md-8'>: {Lookvalues.no_kk ? Lookvalues.no_kk : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nama Kepala Keluarga</div>
									<div className='col-md-8 capitalize'>: {Lookvalues.nama_kk ? Lookvalues.nama_kk : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Penghasilan</div>
									<div className='col-md-8'>: {Penghasilan ? Penghasilan.label : '-'}</div>
								</div>
								<h6 className='titleBar'><i className='fa fa-user'></i> Data Ayah</h6>
								<div className='row'>
									<div className='col-md-4'>Nomor Induk Kewarganegaraan</div>
									<div className='col-md-8'>: {Lookvalues.nik_ayah ? Lookvalues.nik_ayah : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nama Lengkap</div>
									<div className='col-md-8 capitalize'>: {Lookvalues.nama_ayah ? Lookvalues.nama_ayah : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Tahun Lahir</div>
									<div className='col-md-8'>: {TahunLahir&&TahunLahir.tahunlahir_ayah ? TahunLahir.tahunlahir_ayah : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Status Orang Tua</div>
									<div className='col-md-8 capitalize'>: {StatusOrtu&&StatusOrtu.status_ayah ? StatusOrtu.status_ayah.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Pendidikan</div>
									<div className='col-md-8 capitalize'>: {Pendidikan&&Pendidikan.pendidikan_ayah ? Pendidikan.pendidikan_ayah.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Pekerjaan</div>
									<div className='col-md-8 capitalize'>: {Pekerjaan&&Pekerjaan.pekerjaan_ayah ? Pekerjaan.pekerjaan_ayah.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>No Handphone</div>
									<div className='col-md-8'>: {Lookvalues.telp_ayah ? Lookvalues.telp_ayah : '-'}</div>
								</div>
								<h6 className='titleBar'><i className='fa fa-user'></i> Data Ibu</h6>
								<div className='row'>
									<div className='col-md-4'>Nomor Induk Kewarganegaraan</div>
									<div className='col-md-8'>: {Lookvalues.nik_ibu ? Lookvalues.nik_ibu : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nama Lengkap</div>
									<div className='col-md-8 capitalize'>: {Lookvalues.nama_ibu ? Lookvalues.nama_ibu : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Tahun Lahir</div>
									<div className='col-md-8'>: {TahunLahir&&TahunLahir.tahunlahir_ibu ? TahunLahir.tahunlahir_ibu : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Status Orang Tua</div>
									<div className='col-md-8 capitalize'>: {StatusOrtu&&StatusOrtu.status_ibu ? StatusOrtu.status_ibu.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Pendidikan</div>
									<div className='col-md-8 capitalize'>: {Pendidikan&&Pendidikan.pendidikan_ibu ? Pendidikan.pendidikan_ibu.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Pekerjaan</div>
									<div className='col-md-8 capitalize'>: {Pekerjaan&&Pekerjaan.pekerjaan_ibu ? Pekerjaan.pekerjaan_ibu.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>No Handphone</div>
									<div className='col-md-8'>: {Lookvalues.telp_ibu ? Lookvalues.telp_ibu : '-'}</div>
								</div>
								<h6 className='titleBar'><i className='fa fa-user'></i> Data Wali</h6>
								<div className='row'>
									<div className='col-md-4'>Nomor Induk Kewarganegaraan</div>
									<div className='col-md-8'>: {Lookvalues.nik_wali ? Lookvalues.nik_wali : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Nama Lengkap</div>
									<div className='col-md-8 capitalize'>: {Lookvalues.nama_wali ? Lookvalues.nama_wali : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Tahun Lahir</div>
									<div className='col-md-8'>: {TahunLahir&&TahunLahir.tahunlahir_wali ? TahunLahir.tahunlahir_wali : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Pendidikan</div>
									<div className='col-md-8 capitalize'>: {Pendidikan&&Pendidikan.pendidikan_wali ? Pendidikan.pendidikan_wali.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Pekerjaan</div>
									<div className='col-md-8 capitalize'>: {Pekerjaan&&Pekerjaan.pekerjaan_wali ? Pekerjaan.pekerjaan_wali.label : '-'}</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>No Handphone</div>
									<div className='col-md-8'>: {Lookvalues.telp_wali ? Lookvalues.telp_wali : '-'}</div>
								</div>
								<hr/><h5>Berkas - Berkas Siswa</h5><hr/>
								<div className='row'>
									<div className='col-md-4'>Berkas Ijazah</div>
									<div className='col-md-8'>: &nbsp;
										{Lookvalues&&Lookvalues.fc_ijazah ? 
											<a onClick={() => {setBerkas(Lookvalues.fc_ijazah); setviewBerkas({kondisi: true, bagian: 'berkas'});}} style={{cursor: 'pointer', color: 'blue'}}>FC Ijazah</a> : '-'
										}
									</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Berkas Kartu Keluarga</div>
									<div className='col-md-8'>: &nbsp;
										{Lookvalues&&Lookvalues.fc_kk ? 
											<a onClick={() => {setBerkas(Lookvalues.fc_kk); setviewBerkas({kondisi: true, bagian: 'berkas'});}} style={{cursor: 'pointer', color: 'blue'}}>FC Kartu Keluarga</a> : '-'
										}
									</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Berkas KTP Orang Tua</div>
									<div className='col-md-8'>: &nbsp;
										{Lookvalues&&Lookvalues.fc_ktp_ortu ? 
											<a onClick={() => {setBerkas(Lookvalues.fc_ktp_ortu); setviewBerkas({kondisi: true, bagian: 'berkas'});}} style={{cursor: 'pointer', color: 'blue'}}>FC KTP Orang Tua</a> : '-'
										}
									</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Berkas Akta Lahir</div>
									<div className='col-md-8'>: &nbsp;
										{Lookvalues&&Lookvalues.fc_akta_lahir ? 
											<a onClick={() => {setBerkas(Lookvalues.fc_akta_lahir); setviewBerkas({kondisi: true, bagian: 'berkas'});}} style={{cursor: 'pointer', color: 'blue'}}>FC Akta Lahir</a> : '-'
										}
									</div>
								</div>
								<div className='row'>
									<div className='col-md-4'>Berkas Surat Keterangan Lulus</div>
									<div className='col-md-8'>: &nbsp;
										{Lookvalues&&Lookvalues.fc_skl ? 
											<a onClick={() => {setBerkas(Lookvalues.fc_skl); setviewBerkas({kondisi: true, bagian: 'berkas'});}} style={{cursor: 'pointer', color: 'blue'}}>FC Surat Keterangan Lulus</a> : '-'
										}
									</div>
								</div>
							</Modal>
							<Modal 
								open={viewBerkas.kondisi} 
								showCloseIcon={false}
								closeOnOverlayClick={false}
								classNames={{
									overlay: 'customOverlay',
									modal: 'customModal',
								}}>
								<div className="modal-header">
									<h4 className="modal-title" id="my-modal-title">View Berkas</h4>
									<button onClick={() => {setviewBerkas({kondisi: false, bagian: null}); setBerkas(null)}} className="close" aria-label="Close">
										<span aria-hidden="true">×</span>
									</button>
								</div>
								<iframe
									src={viewBerkas.bagian === 'berkas' ? `${env.SITE_URL}pdf/${Lookvalues.id_profile}-${Lookvalues.nomor_induk}/${Berkas}` : `${Berkas}`}
									type="application/pdf"
									height={400}
									width='100%'
								/>
							</Modal>
						</div>
					</div>
				</div>			
			</section>
		</div>
  )
}

export default KelasSiswa