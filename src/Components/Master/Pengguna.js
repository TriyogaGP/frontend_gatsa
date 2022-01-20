import React, { useState, useEffect, Fragment  } from 'react'
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

function Pengguna() {
	const accessToken = localStorage.getItem('access_token')
	const [values, setValues] = useState([])
	const [selectedRows, setSelectedRows] = useState([]);
	const [Editvalues, setEditValues] = useState({})
	const [startDate, setStartDate] = useState(null);
	const [TanggalLahir, setTanggalLahir] = useState(null);
	const [Agama, setAgama] = useState(null);
	const [Hobi, setHobi] = useState(null);
	const [CitaCita, setCitaCita] = useState(null);
	const [Jenjang, setJenjang] = useState(null);
	const [StatusSekolah, setStatusSekolah] = useState(null);
	const [StatusOrtu, setStatusOrtu] = useState({
		status_ayah: null,
		status_ibu: null,
		status_wali: null
	});
	const [Pendidikan, setPendidikan] = useState({
		pendidikan_ayah: null,
		pendidikan_ibu: null,
		pendidikan_wali: null
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
	const [Provinsi, setProvinsi] = useState([]);
	const [KabupatenKotaOnly, setKabupatenKotaOnly] = useState([]);
	const [KabupatenKota, setKabupatenKota] = useState([]);
	const [Kecamatan, setKecamatan] = useState([]);
	const [Kelurahan, setKelurahan] = useState([]);
	const [DataProvinsi, setDataProvinsi] = useState(null);
	const [DataKabKotaOnly, setDataKabKotaOnly] = useState(null);
	const [DataKabKota, setDataKabKota] = useState(null);
	const [DataKecamatan, setDataKecamatan] = useState(null);
	const [DataKelurahan, setDataKelurahan] = useState(null);
	const [TahunLahir, setTahunLahir] = useState({
		tahunlahir_ayah: null,
		tahunlahir_ibu: null,
		tahunlahir_wali: null
	});
	const [PassBay, setPassBay] = useState(null);
	const [flag, setFlag] = useState({
		flagPassEdit: false,
		flagTanggalEdit: false
	})
	const [errors, setErrors] = useState({});
	const [passwordShown, setPasswordShown] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isloading, setIsLoading] = useState({
		load_kabkota: false,
		load_kecamatan: false,
		load_kelurahan: false
	});
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { search } = useLocation();
  const match = search.match(/page=(.*)/);
  const roleID = 
		match?.[1] === 'administrator' ? '1' : 
		match?.[1] === 'guru' ? '2' :
		match?.[1] === 'siswa' ? '3' : '0';
  const title = 
		match?.[1] === 'administrator' ? 'Data Administrator' : 
		match?.[1] === 'guru' ? 'Data Guru' :
		match?.[1] === 'siswa' ? 'Data Siswa' : 'Data Tidak Ditemukan';

	useEffect(() => {
		onCloseModal()
		setLoading(true) 
		const timer = setTimeout(() => {
			getData(roleID)
		}, 2000);
		return () => clearTimeout(timer);
	},[roleID])

	useEffect(() => {
		if(Object.entries(Editvalues).length > 0) return setErrors(validateInput(Editvalues))
	},[Editvalues, TanggalLahir, Jenjang, Penghasilan, TahunLahir, StatusOrtu, Pendidikan, Pekerjaan, DataProvinsi, DataKabKota, DataKecamatan, DataKelurahan])

	const openDialog = (kondisi = null) => {
		if(kondisi === 'tambah'){
			getProvinsi()
			getKabKotaOnly()
			const randomPass = makeRandom(8)
			setEditValues({
				id: null,
				name: '',
				email: '',
				password: randomPass,
				tgl_lahir: '',
				tempat: '',
				jeniskelamin: '',
				agama: '',
				alamat: '',
				telp: '',
				nomor_induk: '',
				nik: '',
				anakke: '',
				jmlsaudara: '',
				namasekolah: '',
				npsn: '',
				alamatsekolah: '',
				no_un: '',
				no_skhun: '',
				no_ijazah: '',
				nilai_un: '',
				no_kk: '',
				nama_kk: '',
				nik_ayah: '',
				nama_ayah: '',
				no_hp_ayah: '',
				nik_ibu: '',
				nama_ibu: '',
				no_hp_ibu: '',
				nik_wali: '',
				nama_wali: '',
				no_hp_wali: '',
			})
		}
		setOpen(true)
	}

	const onCloseModal = () => {
		setOpen(false)
		setErrors({})
		setEditValues({})
		setStartDate(null)
		setTanggalLahir(null)
		setAgama(null)
		setHobi(null)
		setCitaCita(null)
		setJenjang(null)
		setStatusSekolah(null)
		setDataKabKotaOnly(null)
		setPenghasilan(null)
		setStatusTempatTinggal(null)
		setJarakRumah(null)
		setAlatTransportasi(null)
		setStatusOrtu({
			status_ayah: null,
			status_ibu: null,
			status_wali: null
		})
		setPekerjaan({
			pekerjaan_ayah: null,
			pekerjaan_ibu: null,
			pekerjaan_wali: null
		})
		setPendidikan({
			pendidikan_ayah: null,
			pendidikan_ibu: null,
			pendidikan_wali: null
		})
		setTahunLahir({
			tahunlahir_ayah: null,
			tahunlahir_ibu: null,
			tahunlahir_wali: null
		})
		setDataProvinsi(null)
		setDataKabKota(null)
		setDataKecamatan(null)
		setDataKelurahan(null)
		setProvinsi([])
		setKabupatenKotaOnly([])
		setKabupatenKota([])
		setKecamatan([])
		setKelurahan([])
	};
	
	const getData = async(role) => {
		setLoading(true)
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getusers/?idRole=${role}&idProfile=${localStorage.getItem('idProfile')}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			// console.log(response.data.data)
			setLoading(false)
			setValues(response.data.data);
		} catch (error) {
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const getProvinsi = async() => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getprovinsi`);
			// console.log(response.data.data)
			setProvinsi(response.data.data);
		} catch (error) {
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const getKabKotaOnly = async() => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getkabkotaonly`);
			// console.log(response.data.data)
			setKabupatenKotaOnly(response.data.data);
		} catch (error) {
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const getKabKota = async(idprovinsi) => {
		setIsLoading({load_kabkota: true})
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getkabkota/${idprovinsi.value}`);
			setTimeout(() => {
				setIsLoading({load_kabkota: false})
				setKabupatenKota(response.data.data);
			}, 2000);
		} catch (error) {
			setIsLoading({load_kabkota: false})
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const getKecamatan = async(idkabkota) => {
		setIsLoading({load_kecamatan: true})
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getkecamatan/${idkabkota.value}`);
			// console.log(response.data.data)
			setTimeout(() => {
				setIsLoading({load_kecamatan: false})
				setKecamatan(response.data.data);
			}, 2000);
		} catch (error) {
			setIsLoading({load_kecamatan: false})
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const getKelurahan = async(idkecamatan) => {
		setIsLoading({load_kelurahan: true})
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getkeldesa/${idkecamatan.value}`);
			// console.log(response.data.data)
			setTimeout(() => {
				setIsLoading({load_kelurahan: false})
				setKelurahan(response.data.data);
			}, 2000);
		} catch (error) {
			setIsLoading({load_kelurahan: false})
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const prosesSimpan = async(e) => {
		e.preventDefault();
		const payload = {
			id: !Editvalues.id ? null : Editvalues.id,
			name: Editvalues.name ? Editvalues.name : null,
			email: Editvalues.email ? Editvalues.email : null,
			password: Editvalues.id ? !flag.flagPassEdit ? Editvalues.password : PassBay : Editvalues.password ? Editvalues.password : null,
			nomor_induk: roleID !== '1' ? Editvalues.nomor_induk : null,
			tgl_lahir: !Editvalues.id ? TanggalLahir : !flag.flagTanggalEdit ? Editvalues.tgl_lahir : TanggalLahir,
			tempat: Editvalues.tempat ? Editvalues.tempat : null,
			agama: Agama ? Agama.value : null,
			jeniskelamin: Editvalues.jeniskelamin ? Editvalues.jeniskelamin : null,
			nama_ayah: roleID === '5' || roleID === '6' ? Editvalues.nama_ayah : null,
			nama_ibu: roleID === '5' || roleID === '6' ? Editvalues.nama_ibu : null,
			alamat: Editvalues.alamat ? Editvalues.alamat : null,
			telp: Editvalues.telp ? Editvalues.telp : null,
			roleID: roleID,
			jenis: !Editvalues.id ? 'ADD' : 'EDIT',
			kodeOTP: Editvalues.id ? PassBay : null,
		}
		// if(Object.entries(errors).length > 0) return ResponToast('error', 'Form masih ada yang kosong, tolong lengkapi terlebih dahulu. TerimaKasih')
		console.log(payload)
		// setLoading(true) 
		// Loading('Sedang melakukan proses konfirmasi pendaftaran akun ke alamat email anda')
		// try {
		// 	const dataUsers = await axios.post(`${env.SITE_URL}restApi/moduleUser/createupdateusers`, payload);
		// 	getData(roleID)
		// 	setOpen(false)
		// 	setLoading(false) 
		// 	ResponToast('success', dataUsers.data.message)
		// 	navigate(`/pengguna?page=${match?.[1]}`);
		// } catch (error) {
		// 	if(error.response){
		// 		const message = error.response.data.message
		// 		getData(roleID)
		// 		setLoading(false) 
		// 		ResponToast('error', message)
		// 		navigate(`/pengguna?page=${match?.[1]}`);
		// 	}
		// }
	}

	const selectRecord = (e) => {
		if (e.target.checked === true) {
			selectedRows.push(e.target.id);
    } else {
			selectedRows.pop(e.target.id);
    }
	}

	const selectActiveAkun = async(e) => {
		let activeAkun = e.target.checked === true ? '1' : '0'
		try {
			const aktifAkun = await axios.post(`${env.SITE_URL}restApi/moduleUser/updateuserby`, {
				id: e.target.value,
				jenis: 'activeAkun',
				activeAkun: activeAkun
			});
			ResponToast('success', aktifAkun.data.message)
			navigate(`/pengguna?page=${match?.[1]}`);
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToast('error', message)
			}
		}
	}
	
	const editRecord = (record) => {
		// console.log("Edit Record", record);
		setEditValues(record)
		setPassBay(makeRandom(8))
		setAgama({
			value: record.agama,
			label: record.agama,
		})
		setFlag({
			flagPassEdit: false,
			flagTanggalEdit: false
		})
		setPasswordShown(false)
		openDialog()
	}

	const deleteRecord = async(record) => {
		// console.log("Delete Record", record);
		setLoading(true) 
		try {
			const dataUsers = await axios.delete(`${env.SITE_URL}restApi/moduleUser/getusers/${record.id}`);
			getData(roleID)
			setLoading(false) 
			ResponToast('success', dataUsers.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToast('error', message)
			}
		}
	}

	const togglePassword = (aksi) => {
    setPasswordShown(aksi);
  }

	const toggleStatusOrtu = (aksi, kondisi) => {
		if(kondisi === "ayah"){
			setStatusOrtu({
				status_ayah: aksi,
				status_ibu: StatusOrtu.status_ibu,
				status_wali: StatusOrtu.status_wali
			});
		}else if(kondisi === "ibu"){
			setStatusOrtu({
				status_ayah: StatusOrtu.status_ayah,
				status_ibu: aksi,
				status_wali: StatusOrtu.status_wali
			});
		}else if(kondisi === "wali"){
			setStatusOrtu({
				status_ayah: StatusOrtu.status_ayah,
				status_ibu: StatusOrtu.status_ibu,
				status_wali: aksi
			});
		}
  }

	const togglePendidikan = (aksi, kondisi) => {
		if(kondisi === "ayah"){
			setPendidikan({
				pendidikan_ayah: aksi,
				pendidikan_ibu: Pendidikan.pendidikan_ibu,
				pendidikan_wali: Pendidikan.pendidikan_wali
			});
		}else if(kondisi === "ibu"){
			setPendidikan({
				pendidikan_ayah: Pendidikan.pendidikan_ayah,
				pendidikan_ibu: aksi,
				pendidikan_wali: Pendidikan.pendidikan_wali
			});
		}else if(kondisi === "wali"){
			setPendidikan({
				pendidikan_ayah: Pendidikan.pendidikan_ayah,
				pendidikan_ibu: Pendidikan.pendidikan_ibu,
				pendidikan_wali: aksi
			});
		}
  }

	const togglePekerjaan = (aksi, kondisi) => {
		if(kondisi === "ayah"){
			setPekerjaan({
				pekerjaan_ayah: aksi,
				pekerjaan_ibu: Pekerjaan.pekerjaan_ibu,
				pekerjaan_wali: Pekerjaan.pekerjaan_wali
			});
		}else if(kondisi === "ibu"){
			setPekerjaan({
				pekerjaan_ayah: Pekerjaan.pekerjaan_ayah,
				pekerjaan_ibu: aksi,
				pekerjaan_wali: Pekerjaan.pekerjaan_wali
			});
		}else if(kondisi === "wali"){
			setPekerjaan({
				pekerjaan_ayah: Pekerjaan.pekerjaan_ayah,
				pekerjaan_ibu: Pekerjaan.pekerjaan_ibu,
				pekerjaan_wali: aksi
			});
		}
  }

	const toggleTahunLahir = (aksi, kondisi) => {
		if(kondisi === "ayah"){
			setTahunLahir({
				tahunlahir_ayah: aksi,
				tahunlahir_ibu: TahunLahir.tahunlahir_ibu,
				tahunlahir_wali: TahunLahir.tahunlahir_wali
			});
		}else if(kondisi === "ibu"){
			setTahunLahir({
				tahunlahir_ayah: TahunLahir.tahunlahir_ayah,
				tahunlahir_ibu: aksi,
				tahunlahir_wali: TahunLahir.tahunlahir_wali
			});
		}else if(kondisi === "wali"){
			setTahunLahir({
				tahunlahir_ayah: TahunLahir.tahunlahir_ayah,
				tahunlahir_ibu: TahunLahir.tahunlahir_ibu,
				tahunlahir_wali: aksi
			});
		}
  }

	const toggleFlagPass = (aksi) => {
    setFlag({
			flagPassEdit: aksi,
			flagTanggalEdit: flag.flagTanggalEdit
		});
  }

	const toggleFlagTanggal = (aksi) => {
		setStartDate(null)
    setFlag({
			flagPassEdit: flag.flagPassEdit,
			flagTanggalEdit: aksi
		});
  }

	const handleChange = (e) => {
		const { name, value } = e.target
		setEditValues({
			...Editvalues,
			[name]: value
		})
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

	const Loading = (msg) => {
    Swal.fire({
			title: 'Harap Menunggu',
			html: msg,
			allowOutsideClick: false,
			showConfirmButton: false,
		});
		Swal.showLoading()
	}

	const makeRandom = (n) => {
		let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < n; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   	}
   	return result;
	}

	const validateInput = (Editvalues) => {
		let error = {}
		let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let regNumber = /^[0-9\b]+$/

		if(!Editvalues.name.trim()){ error.name = 'Nama Lengkap tidak boleh kosong' }
		
		if(!Editvalues.email.trim()){ error.email = 'Email tidak boleh kosong' } 
		else if(!regEmail.test(Editvalues.email)){ error.email = 'Email tidak sesuai' }
		
		if (!Editvalues.nomor_induk.trim() && roleID !== '1') { error.nomor_induk = "Nomor Induk tidak boleh kosong" }
		else if (!regNumber.test(Editvalues.nomor_induk) && roleID !== '3') { error.nomor_induk = "Hanya boleh angka" }
		else {
			if (Editvalues.nomor_induk.length > 18 && roleID === '2') { error.nomor_induk = "Maksimal 18 angka" }
			else if (Editvalues.nomor_induk.length > 10 && roleID === '3') { error.nomor_induk = "Maksimal 10 angka" }
		}
		
		if (!Editvalues.tempat.trim()) { error.tempat = "Tempat Lahir tidak boleh kosong" }
		
		if ((!Editvalues.id && !TanggalLahir) || (Editvalues.id && !Editvalues.tgl_lahir.trim())) { error.tanggallahir = "Tanggal Lahir tidak boleh kosong" }
		
		if (!Editvalues.jeniskelamin) { error.jeniskelamin = "Pilih Jenis Kelamin" }
		
		if (!Editvalues.telp.trim()) { error.telepon = "telepon tidak boleh kosong" }
		else if(!regNumber.test(Editvalues.telp)){ error.telepon = 'Hanya boleh angka' }
		
		if (!Editvalues.alamat.trim()) { error.alamat = "Alamat tidak boleh kosong" }
		
		if(roleID === '3'){
			if (!Editvalues.nik.trim()) { error.nik = "Nomor Induk Kewarganegaraan tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.nik)) { error.nik = "Hanya boleh angka" }
			else if (Editvalues.nik.length > 16) { error.nik = "Maksimal 10 angka" }
			
			if (!Editvalues.anakke.trim()) { error.anakke = "Anak Ke tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.anakke)) { error.anakke = "Hanya boleh angka" }

			if (!Editvalues.jmlsaudara.trim()) { error.jmlsaudara = "Jumlah Saudara tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.jmlsaudara)) { error.jmlsaudara = "Hanya boleh angka" }
			
			if (!Jenjang) { error.jenjang_sekolah = "Pilih Jenjang Sekolah" }
			
			if (!Editvalues.namasekolah.trim()) { error.namasekolah = "Nama Sekolah tidak boleh kosong" }
			
			if (!Editvalues.npsn.trim()) { error.npsn = "NPSN tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.npsn)) { error.npsn = "Hanya boleh angka" }
			
			if (!Editvalues.alamatsekolah.trim()) { error.alamatsekolah = "Alamat Sekolah tidak boleh kosong" }
			
			if (!Editvalues.no_un.trim()) { error.no_un = "Nomor Peserta UN tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.no_un)) { error.no_un = "Hanya boleh angka" }
			
			if (!Editvalues.no_skhun.trim()) { error.no_skhun = "Nomor SKHUN tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.no_skhun)) { error.no_skhun = "Hanya boleh angka" }
			
			if (!Editvalues.no_ijazah.trim()) { error.no_ijazah = "Nomor Ijazah tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.no_ijazah)) { error.no_ijazah = "Hanya boleh angka" }
			
			if (!Editvalues.nilai_un.trim()) { error.nilai_un = "Total Nilai UN tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.nilai_un)) { error.nilai_un = "Hanya boleh angka" }
			
			if (!Editvalues.no_kk.trim()) { error.no_kk = "Nomor Kartu Keluarga tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.no_kk)) { error.no_kk = "Hanya boleh angka" }
			
			if (!Editvalues.nama_kk.trim()) { error.nama_kk = "Nama Kepala Keluarga tidak boleh kosong" }
			
			if (!Penghasilan) { error.penghasilan = "Pilih Penghasilan OrangTua" }
			
			if (!Editvalues.nama_ayah.trim()) { error.nama_ayah = "Nama lengkap Ayah tidak boleh kosong" }
			if (!Editvalues.nik_ayah.trim()) { error.nik_ayah = "Nomor Induk Kewarganegaraan Ayah tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.nik_ayah)) { error.nik_ayah = "Hanya boleh angka" }
			if (!TahunLahir.tahunlahir_ayah) { error.tahunlahirayah = "Pilih Tahun Lahir Ayah" }
			if (!StatusOrtu.status_ayah) { error.statusayah = "Pilih Status Ayah" }
			if (!Pendidikan.pendidikan_ayah) { error.pendidikanayah = "Pilih Pendidikan Ayah" }
			if (!Pekerjaan.pekerjaan_ayah) { error.pekerjaanayah = "Pilih Pekerjaan Ayah" }
			
			if (!Editvalues.nama_ibu.trim()) { error.nama_ibu = "Nama lengkap Ibu tidak boleh kosong" }
			if (!Editvalues.nik_ibu.trim()) { error.nik_ibu = "Nomor Induk Kewarganegaraan Ibu tidak boleh kosong" }
			else if (!regNumber.test(Editvalues.nik_ibu)) { error.nik_ibu = "Hanya boleh angka" }
			if (!TahunLahir.tahunlahir_ibu) { error.tahunlahiribu = "Pilih Tahun Lahir Ibu" }
			if (!StatusOrtu.status_ibu) { error.statusibu = "Pilih Status Ibu" }
			if (!Pendidikan.pendidikan_ibu) { error.pendidikanibu = "Pilih Pendidikan Ibu" }
			if (!Pekerjaan.pekerjaan_ibu) { error.pekerjaanibu = "Pilih Pekerjaan Ibu" }
			
			if (!DataProvinsi) { error.provinsi = "Pilih Provinsi" }
			if (!DataKabKota) { error.kabkota = "Pilih Kabupaten / Kota" }
			if (!DataKecamatan) { error.kecamatan = "Pilih Kecamatan" }
			if (!DataKelurahan) { error.kelurahan = "Pilih kelurahan / Desa" }
		}
		
		// console.log(error)
		return error
	} 

	const convertDate = (str) => {
		let date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  	const tanggal = [date.getFullYear(), mnth, day].join("-");
		return tanggal
	}

	const columns = [
		{
			key: "check",
			text: "#",
			className: "check",
			align: "center",
			width: '5%',
			cell: record => { 
				return (
					<Fragment>
						<div style={{textAlign: 'center'}}>
							<div className="custom-control custom-checkbox">
								<input className="custom-control-input custom-control-input-danger custom-control-input-outline" type="checkbox" onChange={(e) => selectRecord(e)} id={record.id} />
								<label htmlFor={record.id} className="custom-control-label"></label>
							</div>
						</div>
					</Fragment>
				);
			}
		},
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
			key: "name",
			text: "Nama Lengkap",
			className: "name",
			align: "center",
			width: '15%',
			sortable: true,
		},
		{
			key: "email",
			text: "Email",
			className: "email",
			width: '15%',
			align: "center",
		},
		{
			key: "telp",
			text: "Telepon",
			className: "telp",
			width: '10%',
			align: "center",
		},
		{
			key: "alamat",
			text: "Alamat",
			className: "alamat",
			width: '30%',
			align: "center",
		},
		{
			key: "activeAkun",
			text: "Aktif Akun",
			className: "activeAkun",
			width: '10%',
			align: "center",
			cell: record => { 
				return (
					<Fragment>
						<div style={{textAlign: 'center'}}>
							<div className="form-group">
								<div className="custom-control custom-switch custom-switch-off-default custom-switch-on-success">
									<input type="checkbox" className="custom-control-input" id={"aktivAkun"+record.id} value={record.id} onChange={(e) => selectActiveAkun(e)} defaultChecked={record.activeAkun === 0 ? '' : 'checked' } />
									<label className="custom-control-label" htmlFor={"aktivAkun"+record.id}></label>
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
								className="btn btn-primary btn-xs"
								title="Ubah Data"
								onClick={() => editRecord(record)}
								style={{marginRight: '5px'}}>
								<i className="fa fa-pencil-alt"></i>
							</button>
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

	const optionsAgama = [
		{ value: 'Islam', label: 'Islam' },
		{ value: 'Katolik', label: 'Katolik' },
		{ value: 'Protestan', label: 'Protestan' },
		{ value: 'Hindu', label: 'Hindu' },
		{ value: 'Budha', label: 'Budha' },
	]

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
		{ value: '3', label: 'Ru Saudara/Kerabat' },
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
		<div>
			<div className="content-wrapper">
				<section className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1>{title}</h1>
							</div>
							<div className="col-sm-6">
								<ol className="breadcrumb float-sm-right">
									<li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
									<li className="breadcrumb-item active">{title}</li>
								</ol>
							</div>
						</div>
					</div>
				</section>

				<section className="content">
					<div className="card card-primary card-outline">
						<div className="card-header">
							<h3 className="card-title"><b>{title}</b></h3>
							<div className="card-tools">
								<button onClick={() => openDialog('tambah')}  className="btn btn-primary btn-xs" title="Tambah Data">
									<i className="fas fa-plus" /> Tambah
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
								extraButtons={extraButtons}
								loading={loading}
							/>
						</div>
					</div>
					<div style={{marginTop: '1000px'}}>
						<Modal 
							open={open} 
							showCloseIcon={false}
							closeOnOverlayClick={false}
							classNames={{
								overlay: 'customOverlay',
								modal: 'customModal',
							}}>
							<div className="modal-header">
								<h4 className="modal-title" id="my-modal-title">Form {title}</h4>
								<button onClick={onCloseModal} className="close" aria-label="Close">
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div className='row'>
								<div className={roleID === '2' ? 'col-md-12' : 'col-md-6'}>
									{roleID !== '1' &&
										<>
											<div className="form-group">
												<label htmlFor="name">Nomor Induk {roleID === '2' ? 'Pegawai' : 'Siswa Nasional'}</label>
												<input type="text" className="form-control" name='nomor_induk' placeholder={roleID === '2' ? 'Nomor Induk Pegawai' : 'Nomor Induk Siswa Nasional'} autoComplete="off" maxLength="20" value={Editvalues.nomor_induk} onChange={handleChange} />
												<p className='errorMsg'>{errors.nomor_induk}</p>
												<p className='keterangan'>NB: Diinput tanpa menggunakan spasi</p>
											</div>
										</>
									}
								</div>
								<div className='col-md-6'>
									{roleID === '3' &&
										<div className="form-group">
											<label htmlFor="name">Nomor Induk Kewarganegaraan</label>
											<input type="text" className="form-control" name='nik' placeholder="Nomor Induk Kewarganegaraan" autoComplete="off" maxLength="16" value={Editvalues.nik} onChange={handleChange} />
											<p className='errorMsg'>{errors.nik}</p>
											<p className='keterangan'>NB: Diinput tanpa menggunakan spasi</p>
										</div>
									}
								</div>
							</div>
							<div className='row'>
								<div className='col-md-6'>
									<div className="form-group">
										<label htmlFor="name">Nama Lengkap</label>
										<input type="text" className="form-control" name='name' placeholder="Nama Lengkap" autoComplete="off" value={Editvalues.name} onChange={handleChange} />
										<p className='errorMsg'>{errors.name}</p>
									</div>
								</div>
								<div className='col-md-6'>
									<div className="form-group">
										<label htmlFor="email">Email</label>
										<input type="email" className="form-control" name='email' placeholder="Email" autoComplete="off" value={Editvalues.email} onChange={handleChange} />
										<p className='errorMsg'>{errors.email}</p>
									</div>
								</div>
							</div>
							<div className="form-group">
								<label htmlFor="password">Kata Sandi</label>
								<div className="input-group mb-3">
									<input type={passwordShown ? "text" : "password"} className="form-control" name="password" placeholder="Kata Sandi" autoComplete="off" value={Editvalues.id ? !flag.flagPassEdit ? '********' : PassBay : Editvalues.password} onChange={handleChange} disabled={Editvalues.id ? !flag.flagPassEdit : true} />
									<div className="input-group-append">
										<div className="input-group-text">
											<span onClick={(aksi) => {Editvalues.id ? !flag.flagPassEdit ? togglePassword(false) : togglePassword(!passwordShown) : togglePassword(!passwordShown)}} className={!passwordShown ? "fas fa-eye" : "fas fa-eye-slash"} />
										</div>
									</div>
									{Editvalues.id &&
										<div className="input-group-append">
											<div className="input-group-text">
												<span onClick={(aksi) => {toggleFlagPass(!flag.flagPassEdit)}} className={!flag.flagPassEdit ? "fas fa-unlock" : "fas fa-lock"} />
											</div>
										</div>
									}
								</div>
								{Editvalues.id ? 
									<p className='keterangan'>NB: Jika ingin mengubah password aktifkan input password terlebih dahulu</p>
									:
									<p className='keterangan'>NB: Password sudah di generate acak</p>
								}
							</div>
							<div className='row'>
								<div className='col-md-6'>
									<div className="form-group">
										<label htmlFor="tempat">Tempat Lahir</label>
										<input type="text" className="form-control" name='tempat' placeholder="Tempat Lahir" autoComplete="off" value={Editvalues.tempat} onChange={handleChange} />
										<p className='errorMsg'>{errors.tempat}</p>
									</div>
								</div>
								<div className='col-md-6'>
									<div className="form-group">
										<label>Tanggal Lahir</label>
										<div className="input-group-date">
											{Editvalues.id ?
												!flag.flagTanggalEdit ? 
													<input type="text" className="form-control" name='tgl_lahir' placeholder="Tanggal Lahir" autoComplete="off" disabled value={convertDate(Editvalues.tgl_lahir)} onChange={handleChange} />
												:
													<DatePicker
														className="form-control"
														dateFormat="yyyy-MM-dd"
														placeholderText="Tanggal Lahir"
														selected={startDate}
														onChange={(date) => {setStartDate(date); setTanggalLahir(convertDate(date))}}
														peekNextMonth
														showMonthDropdown
														showYearDropdown
														dropdownMode="select"
													/>
											:
												<DatePicker
													className="form-control"
													dateFormat="yyyy-MM-dd"
													placeholderText="Tanggal Lahir"
													selected={startDate}
													onChange={(date) => {setStartDate(date); setTanggalLahir(convertDate(date))}}
													peekNextMonth
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
												/>
											}
											{Editvalues.id &&
												<div className="input-group-append">
													<div className="input-group-text">
														<span onClick={(aksi) => {toggleFlagTanggal(!flag.flagTanggalEdit)}} className={!flag.flagTanggalEdit ? "fas fa-unlock" : "fas fa-lock"} />
													</div>
												</div>
											}
										</div>
										<p className='errorMsg'>{errors.tanggallahir}</p>
										{Editvalues.id &&
											<p className='keterangan'>NB: Jika ingin mengubah tanggal lahir aktifkan input tanggal lahir terlebih dahulu</p>
										}
									</div>
								</div>
							</div>
							<div className="form-group">
								<label>Jenis Kelamin</label>
								<div className="form-check">
									<input className="form-check-input" type="radio" name="jeniskelamin" value="Laki - Laki" onChange={handleChange} checked={Editvalues.jeniskelamin === 'Laki - Laki' ? 'checked' : '' } />
									<label className="form-check-label">Laki - Laki</label>
								</div>
								<div className="form-check">
									<input className="form-check-input" type="radio" name="jeniskelamin" value="Perempuan" onChange={handleChange} checked={Editvalues.jeniskelamin === 'Perempuan' ? 'checked' : '' } />
									<label className="form-check-label">Perempuan</label>
								</div>
								<p className='errorMsg'>{errors.jeniskelamin}</p>
							</div>
							{roleID === '3' &&
								<div className='row'>
									<div className='col-md-6'>
										<div className="form-group">
											<label htmlFor="name">Anak Ke</label>
											<input type="text" className="form-control" name='anakke' placeholder="Anak Ke" autoComplete="off" maxLength="2" value={Editvalues.anakke} onChange={handleChange} />
											<p className='errorMsg'>{errors.anakke}</p>
										</div>
									</div>
									<div className='col-md-6'>
										<div className="form-group">
											<label htmlFor="name">Jumlah Saudara</label>
											<input type="text" className="form-control" name='jmlsaudara' placeholder="Jumlah Saudara" autoComplete="off" maxLength="2" value={Editvalues.jmlsaudara} onChange={handleChange} />
											<p className='errorMsg'>{errors.jmlsaudara}</p>
										</div>
									</div>
								</div>
							}
							<div className='row'>
								<div className={roleID === '3' ? 'col-md-4' : 'col-md-12'}>
									<div className="form-group">
										<label>Agama</label>
										<Select
											placeholder='Pilih Agama'
											value={Agama}
											onChange={(x) => {setAgama(x)}}
											options={optionsAgama}
										/>
									</div>
								</div>
								{roleID === '3' &&
									<>
										<div className='col-md-4'>
											<div className="form-group">
												<label>Hobi</label>
												<Select
													placeholder='Pilih Hobi'
													value={Hobi}
													onChange={(x) => {setHobi(x)}}
													options={optionsHobi}
												/>
											</div>
										</div>
										<div className='col-md-4'>
											<div className="form-group">
												<label>Cita - Cita</label>
												<Select
													placeholder='Pilih Cita - Cita'
													value={CitaCita}
													onChange={(x) => {setCitaCita(x)}}
													options={optionsCitaCita}
												/>
											</div>
										</div>
									</>
								}
							</div>
							<div className="form-group">
								<label htmlFor="telp">Telepon</label>
								<input type="text" className="form-control" name='telp' placeholder="Telepon" autoComplete="off" maxLength="15" value={Editvalues.telp} onChange={handleChange} />
								<p className='errorMsg'>{errors.telepon}</p>
							</div>
							{roleID === '3' &&	
								<>
									<div className="modal-header2">
										<h5 className="modal-title">DATA SEKOLAH SEBELUMNYA</h5>
									</div>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Jenjang Sekolah</label>
												<Select
													placeholder='Pilih Jenjang Sekolah'
													value={Jenjang}
													onChange={(x) => {setJenjang(x)}}
													options={optionsJenjang}
												/>
												<p className='errorMsg'>{errors.jenjang_sekolah}</p>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Status Sekolah</label>
												<Select
													placeholder='Pilih Status Sekolah'
													value={StatusSekolah}
													onChange={(x) => {setStatusSekolah(x)}}
													options={optionsStatusSekolah}
												/>
											</div>
										</div>
									</div>	
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="name">Nama Sekolah</label>
												<input type="text" className="form-control" name='namasekolah' placeholder="Nama Sekolah" autoComplete="off" value={Editvalues.namasekolah} onChange={handleChange} />
												<p className='errorMsg'>{errors.namasekolah}</p>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="telp">NPSN</label>
												<input type="text" className="form-control" name='npsn' placeholder="npsn" autoComplete="off" maxLength="8" value={Editvalues.npsn} onChange={handleChange} />
												<p className='errorMsg'>{errors.npsn}</p>
											</div>
										</div>
									</div>
									<div className="form-group">
										<label htmlFor="alamat">Alamat Sekolah</label>
										<textarea className="form-control" rows="3" name='alamatsekolah' placeholder="Alamat Sekolah" autoComplete="off" style={{resize: 'none'}} value={Editvalues.alamatsekolah} onChange={handleChange} ></textarea>
										<p className='errorMsg'>{errors.alamatsekolah}</p>
									</div>
									<div className="form-group">
										<label>Kabupaten/Kota Lokasi Sekolah Sebelumnya</label>
										<Select
											placeholder='Pilih Kabupaten/Kota Lokasi Sekolah Sebelumnya'
											value={DataKabKotaOnly}
											onChange={(x) => {setDataKabKotaOnly(x)}}
											options={KabupatenKotaOnly}
										/>
									</div>
									<div className='row'>
										<div className='col-md-3'>
											<div className="form-group">
												<label htmlFor="telp">Nomor Peserta UN</label>
												<input type="text" className="form-control" name='no_un' placeholder="Nomor Peserta UN" autoComplete="off" maxLength="20" value={Editvalues.no_un} onChange={handleChange} />
												<p className='errorMsg'>{errors.no_un}</p>
											</div>
										</div>
										<div className='col-md-3'>
											<div className="form-group">
												<label htmlFor="telp">Nomor SKHUN</label>
												<input type="text" className="form-control" name='no_skhun' placeholder="Nomor SKHUN" autoComplete="off" maxLength="20" value={Editvalues.no_skhun} onChange={handleChange} />
												<p className='errorMsg'>{errors.no_skhun}</p>
											</div>
										</div>
										<div className='col-md-3'>
											<div className="form-group">
												<label htmlFor="telp">Nomor IJAZAH</label>
												<input type="text" className="form-control" name='no_ijazah' placeholder="Nomor IJAZAH" autoComplete="off" maxLength="20" value={Editvalues.no_ijazah} onChange={handleChange} />
												<p className='errorMsg'>{errors.no_ijazah}</p>
											</div>
										</div>
										<div className='col-md-3'>
											<div className="form-group">
												<label htmlFor="telp">Total Nilai UN</label>
												<input type="text" className="form-control" name='nilai_un' placeholder="Total Nilai UN" autoComplete="off" maxLength="3" value={Editvalues.nilai_un} onChange={handleChange} />
												<p className='errorMsg'>{errors.nilai_un}</p>
											</div>
										</div>
									</div>
									<div className="modal-header2">
										<h5 className="modal-title">DATA ORANG TUA / WALI</h5>
									</div>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="telp">Nomor Kartu Keluarga</label>
												<input type="text" className="form-control" name='no_kk' placeholder="Nomor Kartu Keluarga" autoComplete="off" maxLength="16" value={Editvalues.no_kk} onChange={handleChange} />
												<p className='errorMsg'>{errors.no_kk}</p>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="telp">Nama Kepala Keluarga</label>
												<input type="text" className="form-control" name='nama_kk' placeholder="Nama Kepala Keluarga" autoComplete="off" value={Editvalues.nama_kk} onChange={handleChange} />
												<p className='errorMsg'>{errors.nama_kk}</p>
											</div>
										</div>
									</div>
									<div className="form-group">
										<label>Penghasilan</label>
										<Select
											placeholder='Pilih Penghasilan'
											value={Penghasilan}
											onChange={(x) => {setPenghasilan(x)}}
											options={optionsPenghasilan}
										/>
										<p className='errorMsg'>{errors.penghasilan}</p>
									</div>
									{/* DataAyah */}
									<h6 className='titleBar'><i className='fa fa-user'></i> Data Ayah</h6>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="name">Nomor Induk Kewarganegaraan</label>
												<input type="text" className="form-control" name='nik_ayah' placeholder="Nomor Induk Kewarganegaraan" autoComplete="off" maxLength="16" value={Editvalues.nik_ayah} onChange={handleChange} />
												<p className='errorMsg'>{errors.nik_ayah}</p>
												<p className='keterangan'>NB: Diinput tanpa menggunakan spasi</p>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="name">Nama Lengkap</label>
												<input type="text" className="form-control" name='nama_ayah' placeholder="Nama Lengkap" autoComplete="off" value={Editvalues.nama_ayah} onChange={handleChange} />
												<p className='errorMsg'>{errors.nama_ayah}</p>
											</div>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Tahun Lahir</label>
												<DatePicker
													className="form-control"
													dateFormat="yyyy"
													placeholderText="Tahun Lahir"
													selected={TahunLahir.tahunlahir_ayah}
													onChange={(date) => {toggleTahunLahir(date, "ayah")}}
													showYearPicker
												/>
												<p className='errorMsg'>{errors.tahunlahirayah}</p>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Status</label>
												<Select
													placeholder='Pilih Status'
													value={StatusOrtu.status_ayah}
													onChange={(x) => {toggleStatusOrtu(x, "ayah")}}
													options={optionsStatusOrtu}
												/>
												<p className='errorMsg'>{errors.statusayah}</p>
											</div>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Pekerjaan</label>
												<Select
													placeholder='Pilih Pekerjaan'
													value={Pekerjaan.pekerjaan_ayah}
													onChange={(x) => {togglePekerjaan(x, "ayah")}}
													options={optionsPekerjaan}
												/>
												<p className='errorMsg'>{errors.pekerjaanayah}</p>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Pendidikan</label>
												<Select
													placeholder='Pilih Pendidikan'
													value={Pendidikan.pendidikan_ayah}
													onChange={(x) => {togglePendidikan(x, "ayah")}}
													options={optionsPendidikan}
												/>
												<p className='errorMsg'>{errors.pendidikanayah}</p>
											</div>
										</div>
									</div>
									<div className="form-group">
										<label htmlFor="telp">Nomor Handphone</label>
										<input type="text" className="form-control" name='no_hp_ayah' placeholder="Nomor Handphone" autoComplete="off" maxLength="15" value={Editvalues.no_hp_ayah} onChange={handleChange} />
									</div>
									{/* DataIbu */}
									<h6 className='titleBar'><i className='fa fa-user'></i> Data Ibu</h6>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="name">Nomor Induk Kewarganegaraan</label>
												<input type="text" className="form-control" name='nik_ibu' placeholder="Nomor Induk Kewarganegaraan" autoComplete="off" maxLength="16" value={Editvalues.nik_ibu} onChange={handleChange} />
												<p className='errorMsg'>{errors.nik_ibu}</p>
												<p className='keterangan'>NB: Diinput tanpa menggunakan spasi</p>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="name">Nama Lengkap</label>
												<input type="text" className="form-control" name='nama_ibu' placeholder="Nama Lengkap" autoComplete="off" value={Editvalues.nama_ibu} onChange={handleChange} />
												<p className='errorMsg'>{errors.nama_ibu}</p>
											</div>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Tahun Lahir</label>
												<DatePicker
													className="form-control"
													dateFormat="yyyy"
													placeholderText="Tahun Lahir"
													selected={TahunLahir.tahunlahir_ibu}
													onChange={(date) => {toggleTahunLahir(date, "ibu")}}
													showYearPicker
												/>
												<p className='errorMsg'>{errors.tahunlahiribu}</p>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Status</label>
												<Select
													placeholder='Pilih Status'
													value={StatusOrtu.status_ibu}
													onChange={(x) => {toggleStatusOrtu(x, "ibu")}}
													options={optionsStatusOrtu}
												/>
												<p className='errorMsg'>{errors.statusibu}</p>
											</div>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Pekerjaan</label>
												<Select
													placeholder='Pilih Pekerjaan'
													value={Pekerjaan.pekerjaan_ibu}
													onChange={(x) => {togglePekerjaan(x, "ibu")}}
													options={optionsPekerjaan}
												/>
												<p className='errorMsg'>{errors.pekerjaanibu}</p>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Pendidikan</label>
												<Select
													placeholder='Pilih Pendidikan'
													value={Pendidikan.pendidikan_ibu}
													onChange={(x) => {togglePendidikan(x, "ibu")}}
													options={optionsPendidikan}
												/>
												<p className='errorMsg'>{errors.pendidikanibu}</p>
											</div>
										</div>
									</div>
									<div className="form-group">
										<label htmlFor="telp">Nomor Handphone</label>
										<input type="text" className="form-control" name='no_hp_ibu' placeholder="Nomor Handphone" autoComplete="off" maxLength="15" value={Editvalues.no_hp_ibu} onChange={handleChange} />
									</div>
									{/* DataWali */}
									<h6 className='titleBar'><i className='fa fa-user'></i> Data Wali</h6>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="name">Nomor Induk Kewarganegaraan</label>
												<input type="text" className="form-control" name='nik_wali' placeholder="Nomor Induk Kewarganegaraan" autoComplete="off" maxLength="16" value={Editvalues.nik_wali} />
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label htmlFor="name">Nama Lengkap</label>
												<input type="text" className="form-control" name='nama_wali' placeholder="Nama Lengkap" autoComplete="off" value={Editvalues.nama_wali} onChange={handleChange} />
											</div>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Tahun Lahir</label>
												<DatePicker
													className="form-control"
													dateFormat="yyyy"
													placeholderText="Tahun Lahir"
													selected={TahunLahir.tahunlahir_wali}
													onChange={(date) => {toggleTahunLahir(date, "wali")}}
													showYearPicker
												/>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Status</label>
												<Select
													placeholder='Pilih Status'
													value={StatusOrtu.status_wali}
													onChange={(x) => {toggleStatusOrtu(x, "wali")}}
													options={optionsStatusOrtu}
												/>
											</div>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Pekerjaan</label>
												<Select
													placeholder='Pilih Pekerjaan'
													value={Pekerjaan.pekerjaan_wali}
													onChange={(x) => {togglePekerjaan(x, "wali")}}
													options={optionsPekerjaan}
												/>
											</div>
										</div>
										<div className='col-md-6'>
											<div className="form-group">
												<label>Pendidikan</label>
												<Select
													placeholder='Pilih Pendidikan'
													value={Pendidikan.pendidikan_wali}
													onChange={(x) => {togglePendidikan(x, "wali")}}
													options={optionsPendidikan}
												/>
											</div>
										</div>
									</div>
									<div className="form-group">
										<label htmlFor="telp">Nomor Handphone</label>
										<input type="text" className="form-control" name='no_hp_wali' placeholder="Nomor Handphone" autoComplete="off" maxLength="15" value={Editvalues.no_hp_wali} onChange={handleChange} />
									</div>
									<div className="modal-header2">
										<h5 className="modal-title">INFORMASI ALAMAT TEMPAT TINGGAL ORANGTUA/WALI</h5>
									</div>
								</>
							}
							<div className="form-group">
								<label htmlFor="alamat">Alamat</label>
								<textarea className="form-control" rows="3" name='alamat' placeholder="Alamat" autoComplete="off" style={{resize: 'none'}} value={Editvalues.alamat} onChange={handleChange} ></textarea>
								<p className='errorMsg'>{errors.alamat}</p>
							</div>
							<div className="form-group">
								<label>Provinsi</label>
								<Select
									placeholder='Pilih Provinsi'
									value={DataProvinsi}
									onChange={(x) => {setDataProvinsi(x); x && getKabKota(x); setDataKabKota(null); setDataKecamatan(null); setDataKelurahan(null)}}
									options={Provinsi}
									isClearable
								/>
								<p className='errorMsg'>{errors.provinsi}</p>
							</div>
							<div className="form-group">
								<label>Kabupaten / Kota</label>
								<Select
									placeholder='Pilih Kabupaten / Kota'
									value={DataKabKota}
									onChange={(x) => {setDataKabKota(x); x && getKecamatan(x); setDataKecamatan(null); setDataKelurahan(null)}}
									options={KabupatenKota}
									isDisabled={DataProvinsi ? isloading.load_kabkota : !DataProvinsi}
									isLoading={isloading.load_kabkota}
									isClearable
								/>
								<p className='errorMsg'>{errors.kabkota}</p>
							</div>
							<div className="form-group">
								<label>Kecamatan</label>
								<Select
									placeholder='Pilih Kecamatan'
									value={DataKecamatan}
									onChange={(x) => {setDataKecamatan(x); x && getKelurahan(x); setDataKelurahan(null)}}
									options={Kecamatan}
									isDisabled={DataKabKota ? isloading.load_kecamatan : !DataKabKota}
									isLoading={isloading.load_kecamatan}
									isClearable
								/>
								<p className='errorMsg'>{errors.kecamatan}</p>
							</div>
							<div className="form-group">
								<label>Kelurahan</label>
								<Select
									placeholder='Pilih Kelurahan'
									value={DataKelurahan}
									onChange={(x) => {setDataKelurahan(x)}}
									options={Kelurahan}
									isDisabled={DataKecamatan ? isloading.load_kelurahan : !DataKecamatan}
									isLoading={isloading.load_kelurahan}
									isClearable
								/>
								<p className='errorMsg'>{errors.kelurahan}</p>
							</div>
							<div className="form-group">
								<label htmlFor="name">Kode Pos</label>
								<input type="text" className="form-control" placeholder="Kode Pos" autoComplete="off" value={DataKelurahan ? DataKelurahan.kode_pos : "" } disabled />
							</div>
							{roleID === '3' &&
								<>
									<div className="form-group">
										<label>Status Tempat Tinggal</label>
										<Select
											placeholder='Pilih Status Tempat Tinggal'
											value={StatusTempatTinggal}
											onChange={(x) => {setStatusTempatTinggal(x)}}
											options={optionsStatusTempatTinggal}
										/>
									</div>
									<div className="form-group">
										<label>Jarak Tempat Tinggal</label>
										<Select
											placeholder='Pilih Jarak Tempat Tinggal'
											value={JarakRumah}
											onChange={(x) => {setJarakRumah(x)}}
											options={optionsJarakRumah}
										/>
									</div>
									<div className="form-group">
										<label>Alat Transportasi</label>
										<Select
											placeholder='Pilih Alat Transportasi'
											value={AlatTransportasi}
											onChange={(x) => {setAlatTransportasi(x)}}
											options={optionsAlatTransportasi}
										/>
									</div>
								</>
							}
							<div className="modal-footer right-content-between">
								<button onClick={onCloseModal} className="btn btn-primary btn-sm align-right">Batal</button>
								<button onClick={prosesSimpan} className="btn btn-primary btn-sm align-right">Simpan</button>
							</div>
						</Modal>		
					</div>		
				</section>
			</div>
		</div>
	)
}

export default Pengguna
