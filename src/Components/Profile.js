import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios';
import Select from 'react-select';
import env from 'react-dotenv'
import Swal from 'sweetalert2';

function Profile(props) {
	const navigate = useNavigate();
	const [values, setValues] = useState({})
	const [ubahData, setUbahData] = useState({
		namalengkap: '',
		email: '',
		telp: '',
		alamat: '',
		passwordlama: '',
		passwordbaru: '',
		confpasswordbaru: ''
	})
	const [flag, setFlag] = useState({
		flagNama: false,
		flagEmail: false,
		flagTelepon: false,
		flagAlamat: false,
		flagProvinsi: false,
		flagKabupatenKota: false,
		flagKelurahan: false,
		flagKecamatan: false,
	})
	const [Provinsi, setProvinsi] = useState([]);
	const [KabupatenKota, setKabupatenKota] = useState([]);
	const [Kecamatan, setKecamatan] = useState([]);
	const [Kelurahan, setKelurahan] = useState([]);
	const [Label, setLabel] = useState({});
	const [errors, setErrors] = useState({});
	const [passwordShown, setPasswordShown] = useState({
		password_lama: false,
		password_baru: false,
		konf_password_baru: false
	});
	const [DataProvinsi, setDataProvinsi] = useState(null);
	const [DataKabKota, setDataKabKota] = useState(null);
	const [DataKecamatan, setDataKecamatan] = useState(null);
	const [DataKelurahan, setDataKelurahan] = useState(null);
	const [isloading, setIsLoading] = useState({
		load_kabkota: false,
		load_kecamatan: false,
		load_kelurahan: false
	});
	const gbr = values.codeLog === 1 ? values.gambar != null ? `${env.SITE_URL}images/${values.gambar}` : 'dist/img/user.png' : values.codeLog === 2 ? values.gambarGmail : 'dist/img/user.png';

	useEffect(() => {
		getData()
	},[])

	useEffect(() => {
		if(Object.entries(ubahData).length > 0 || flag.flagProvinsi) return setErrors(validateInput(ubahData)) 
	},[ubahData, flag, DataProvinsi, DataKabKota, DataKecamatan, DataKelurahan])

	useEffect(() => {
		if(Label.kondisi && !flag.flagProvinsi){
			getProvinsi()
			getKabKota(values.provinsi)
			getKecamatan(values.kabkota)
			getKelurahan(values.kecamatan)
		}
		setLabel(getDataDaerah());
		if(Object.entries(Label).length > 0 && !flag.flagProvinsi){
			setDataProvinsi({
				value: Label.provinsi ? Label.provinsi.value : null,
				label: Label.provinsi ? Label.provinsi.label : null
			})
			setDataKabKota({
				value: Label.kabupatenkota ? Label.kabupatenkota.value : null,
				label: Label.kabupatenkota ? Label.kabupatenkota.label : null
			})
			setDataKecamatan({
				value: Label.kecamatan ? Label.kecamatan.value : null,
				label: Label.kecamatan ? Label.kecamatan.label : null
			})
			setDataKelurahan({
				value: Label.kelurahan ? Label.kelurahan.value : null,
				label: Label.kelurahan ? Label.kelurahan.label : null
			})
		}
	},[Provinsi, KabupatenKota, Kecamatan, Kelurahan])

	const getData = async() => {
		const response = await axios.get(`${env.SITE_URL}restApi/moduleLogin/getusers/${localStorage.getItem('idProfile')}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		});
		setValues(response.data.data);
		getProvinsi()
		getKabKota(response.data.data.provinsi)
		getKecamatan(response.data.data.kabkota)
		getKelurahan(response.data.data.kecamatan)
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setUbahData({
			...ubahData,
			[name]: value
		})
	}

	const keluar = async() => {
		try {
			await axios.get(`${env.SITE_URL}restApi/moduleLogin/logout/${localStorage.getItem('idProfile')}`);
			localStorage.clear()
			ResponToast('success', 'Anda berhasil keluar dari panel ini .. Terima Kasih !')
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	}

	const ubahKondisiData = (nilai, kondisi) => {
		if(kondisi === 'nama'){ setFlag({...flag, flagNama: nilai}) }
		if(kondisi === 'email'){ setFlag({...flag, flagEmail: nilai}) }
		if(kondisi === 'telepon'){ setFlag({...flag, flagTelepon: nilai}) }
		if(kondisi === 'alamat'){ setFlag({...flag, flagAlamat: nilai}) }
		if(kondisi === 'provinsi'){ setFlag({...flag, flagProvinsi: nilai}) }
		if(kondisi === 'kabkota'){ setFlag({...flag, flagKabupatenKota: nilai}) }
		if(kondisi === 'kecamatan'){ setFlag({...flag, flagKecamatan: nilai}) }
		if(kondisi === 'kelurahan'){ setFlag({...flag, flagKelurahan: nilai}) }
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

	const uploadFile = async(dataFile) => {
		console.log(dataFile)
		const size = (dataFile.size/1024)
		if(size > 5120){
			ResponToast('warning', 'Ukuran gambar terlalu besar !')
		}else{
			const formData = new FormData();
			formData.append("id", localStorage.getItem('idProfile'));
			formData.append("jenis", 'images');
			formData.append("nama", localStorage.getItem('namaLengkap'));
			formData.append("file", dataFile);
			try {
				const uploadImage = await axios.post(`${env.SITE_URL}restApi/moduleLogin/updateImage`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				}
			});
				// console.log(uploadImage)
				getData()
				ResponToast('success', uploadImage.data.message)
				navigate('/profile')
			} catch (error) {
				if(error.response){
					const message = error.response.data.message
					ResponToast('error', message)
				}
			}
		}
	}

	const togglePassword = (aksi, kondisi) => {
		if(kondisi === 'passLama'){
			setPasswordShown({...passwordShown, password_lama: aksi});
		}
		if(kondisi === 'passBaru'){
			setPasswordShown({...passwordShown, password_baru: aksi});
		}
		if(kondisi === 'passBaruConf'){
			setPasswordShown({...passwordShown, konf_password_baru: aksi});
		}
  }

	const validateInput = (ubahData) => {
		let error = {}
		let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let regNumber = /^[0-9\b]+$/

		if(!ubahData.email && flag.flagEmail){ error.email = 'Email tidak boleh kosong' } 
		else if(!regEmail.test(ubahData.email) && flag.flagEmail){ error.email = 'Email tidak sesuai' }

		if (!ubahData.telp && flag.flagTelepon) { error.telp = "telepon tidak boleh kosong" }
		else if(!regNumber.test(ubahData.telp) && flag.flagTelepon){ error.telp = 'Hanya boleh angka' }

		if (!ubahData.alamat && flag.flagAlamat) { error.alamat = "Alamat tidak boleh kosong" }

		if(!ubahData.passwordlama){
			error.passwordlama = 'Kata Sandi Lama tidak boleh kosong'
		}else if(ubahData.passwordlama.length < 8){
			error.passwordlama = 'Kata Sandi Lama harus 8 karakter'
		}

		if(!ubahData.passwordbaru){
			error.passwordbaru = 'Kata Sandi Baru tidak boleh kosong'
		}else if(ubahData.passwordbaru.length < 8){
			error.passwordbaru = 'Kata Sandi Baru harus 8 karakter'
		}

		if(!ubahData.confpasswordbaru){
			error.confpasswordbaru = 'Konfirmasi Kata Sandi Baru tidak boleh kosong'
		}else if(ubahData.confpasswordbaru !== ubahData.passwordbaru){
			error.confpasswordbaru = 'Konfirmasi Kata Sandi Baru harus sama dengan Kata Sandi'
		}

		if (!DataProvinsi) { error.provinsi = "Pilih Provinsi" }
		if (!DataKabKota) { error.kabkota = "Pilih Kabupaten / Kota" }
		if (!DataKecamatan) { error.kecamatan = "Pilih Kecamatan" }
		if (!DataKelurahan) { error.kelurahan = "Pilih kelurahan / Desa" }
		
		return error
	}

	const clearForm = () => {
		setUbahData({
			nama: '',
			email: '',
			telp: '',
			passwordlama: '',
			passwordbaru: '',
			confpasswordbaru: ''
		})
		ubahKondisiData(!flag.flagProvinsi, 'provinsi')
		setErrors({})
	}

	const ubahProfile = async(ubahJenis) => {
		// e.preventDefault();
		const kirimData = {
			id: localStorage.getItem('idProfile'),
			ubah: ubahJenis,
			name: ubahJenis === 'nama' ? ubahData.namalengkap : null,
			email: ubahJenis === 'datapribadi' ? !flag.flagEmail ? values.email : ubahData.email : null,
			telp: ubahJenis === 'datapribadi' ? !flag.flagTelepon ? values.telp : ubahData.telp : null,
			provinsi: ubahJenis === 'datapribadi' ? DataProvinsi ? DataProvinsi.value : null : null,
			kabkota: ubahJenis === 'datapribadi' ? DataKabKota ? DataKabKota.value : null : null,
			kecamatan: ubahJenis === 'datapribadi' ? DataKecamatan ? DataKecamatan.value : null : null,
			kelurahan: ubahJenis === 'datapribadi' ? DataKelurahan ? DataKelurahan.value : null : null,
			kode_pos: ubahJenis === 'datapribadi' ? Object.entries(Label).length > 0 && !flag.flagProvinsi ? values.kode_pos : DataKelurahan ? String(DataKelurahan.kode_pos) : null : null,
			passwordlama: ubahJenis === 'katasandi' ? ubahData.passwordlama : null,
			passwordbaru: ubahJenis === 'katasandi' ? ubahData.passwordbaru : null,
			confPasswordbaru: ubahJenis === 'katasandi' ? ubahData.confpasswordbaru : null
		}
		let err, pesan
		if(ubahJenis === 'nama'){
			if(!ubahData.namalengkap) { ubahKondisiData(false, 'nama'); ResponToast('error', "Nama Lengkap tidak boleh kosong"); return} 
		}else if(ubahJenis === 'datapribadi'){
			err = Object.fromEntries(Object.entries(errors).filter(([key, value]) => key !== 'passwordlama' && key !== 'passwordbaru' && key !== 'confpasswordbaru'))
			pesan = 'Data Pribadi'
		}else if(ubahJenis === 'katasandi'){
			err = Object.fromEntries(Object.entries(errors).filter(([key, value]) => key === 'passwordlama' || key === 'passwordbaru' || key === 'confpasswordbaru'))
			pesan = 'Kata Sandi'
		}
		if(Object.entries(err).length > 0) return ResponToast('error', `Form ${pesan} masih ada yang kosong, tolong lengkapi terlebih dahulu. TerimaKasih`)
		console.log(kirimData)
		// try {
		// 	const profile_ubah = await axios.post(`${env.SITE_URL}restApi/moduleLogin/updateusers`, kirimData);
		// 	// console.log(register)
		// 	if(ubahJenis === 'nama'){
		// 		ubahKondisiData(false, 'nama')
		// 		localStorage.setItem('namaLengkap', ubahData.namalengkap)
		// 	}
		// 	clearForm()
		// 	getData()
		// 	ResponToast('success', profile_ubah.data.message)
		// 	navigate('/profile#aktivity');
		// } catch (error) {
		// 	if(error.response){
		// 		const message = error.response.data.message
		// 		ResponToast('error', message)
		// 	}
		// }
	}

	const getDataDaerah = () => {
		let label = {}
		label.provinsi = Provinsi.find(p => p.value === values.provinsi);
		label.kabupatenkota = KabupatenKota.find(q => q.value === values.kabkota);
		label.kecamatan = Kecamatan.find(r => r.value === values.kecamatan);
		label.kelurahan = Kelurahan.find(s => s.value === values.kelurahan);
		if(label.provinsi === undefined || label.kabupatenkota === undefined || label.kecamatan === undefined || label.kelurahan === undefined){label.kondisi = true}else{label.kondisi = false}
		return label
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

	const getKabKota = async(idprovinsi) => {
		if(!idprovinsi) return
		setIsLoading({load_kabkota: true})
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getkabkota/${idprovinsi.value ? idprovinsi.value : idprovinsi}`);
			// if(Editvalues.id) return setKabupatenKota(response.data.data);
			setTimeout(() => {
				setIsLoading({load_kabkota: false})
				setKabupatenKota(response.data.data);
			}, 1000);
		} catch (error) {
			setIsLoading({load_kabkota: false})
			console.log(error)
			ResponToast('error', error.response.data.message)
		}
	}

	const getKecamatan = async(idkabkota) => {
		if(!idkabkota) return
		setIsLoading({load_kecamatan: true})
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getkecamatan/${idkabkota.value ? idkabkota.value : idkabkota}`);
			// console.log(response.data.data)
			// if(Editvalues.id) return setKecamatan(response.data.data);
			setTimeout(() => {
				setIsLoading({load_kecamatan: false})
				setKecamatan(response.data.data);
			}, 1000);
		} catch (error) {
			setIsLoading({load_kecamatan: false})
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const getKelurahan = async(idkecamatan) => {
		if(!idkecamatan) return
		setIsLoading({load_kelurahan: true})
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getkeldesa/${idkecamatan.value ? idkecamatan.value : idkecamatan}`);
			// console.log(response.data.data)
			// if(Editvalues.id) return setKelurahan(response.data.data);
			setTimeout(() => {
				setIsLoading({load_kelurahan: false})
				setKelurahan(response.data.data);
			}, 1000);
		} catch (error) {
			setIsLoading({load_kelurahan: false})
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const convertDate = (str, kondisi) => {
		const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
		const date = new Date(str);
    // mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    const mnth = bulan[date.getMonth()];
    const day = ("0" + date.getDate()).slice(-2);
  	const valueConvert = kondisi === 'tanggal' ? [day, mnth, date.getFullYear()].join(" ") : String(date.getFullYear());
		return valueConvert
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
				<div className="card">
					<div className="card-body">
						<div className="row">
							<div className="col-md-8">
								<div className="card card-primary card-outline">
									<div className="card-header p-2">
										<ul className="nav nav-pills">
											<li className="nav-item"><a className="nav-link active" href="#activity" data-toggle="tab">Activity</a></li>
											<li className="nav-item"><a className="nav-link" href="#timeline" data-toggle="tab">Timeline</a></li>
											{values.codeLog === 1 &&
												<li className="nav-item"><a className="nav-link" href="#ubah-katasandi" data-toggle="tab">Ubah Kata Sandi</a></li>
											}
											<li className="nav-item"><a className="nav-link" href="#data-pribadi" data-toggle="tab">Ubah Data Pribadi</a></li>
										</ul>
									</div>
									<div className="card-body">
										<div className="tab-content">
											<div className="active tab-pane" id="activity">
												pane 1
											</div>
											<div className="tab-pane" id="timeline">
												pane 2
											</div>
											<div className="tab-pane" id="ubah-katasandi">
												<>
													<div className="form-group">
														<div className="input-group">
															<input type={passwordShown.password_lama ? "text" : "password"} className="form-control" name="passwordlama" placeholder="Kata Sandi Lama" autoComplete="off" value={ubahData.passwordlama} onChange={handleChange} />
															<div className="input-group-append">
																<div className="input-group-text">
																	<span onClick={() => {togglePassword(!passwordShown.password_lama, 'passLama')}} className={!passwordShown.password_lama ? "fas fa-eye" : "fas fa-eye-slash"} />
																</div>
															</div>
														</div>
														<p className='errorMsg'>{errors.passwordlama}</p>
													</div>
													<div className="form-group">
														<div className="input-group">
															<input type={passwordShown.password_baru ? "text" : "password"} className="form-control" name="passwordbaru" placeholder="Kata Sandi Baru" autoComplete="off" value={ubahData.passwordbaru} onChange={handleChange} />
															<div className="input-group-append">
																<div className="input-group-text">
																	<span onClick={() => {togglePassword(!passwordShown.password_baru, 'passBaru')}} className={!passwordShown.password_baru ? "fas fa-eye" : "fas fa-eye-slash"} />
																</div>
															</div>
														</div>
														<p className='errorMsg'>{errors.passwordbaru}</p>
													</div>
													<div className="form-group">
														<div className="input-group">
															<input type={passwordShown.konf_password_baru ? "text" : "password"} className="form-control" name="confpasswordbaru" placeholder="Konfirmasi Kata Sandi Baru" autoComplete="off" value={ubahData.confpasswordbaru} onChange={handleChange} />
															<div className="input-group-append">
																<div className="input-group-text">
																	<span onClick={() => {togglePassword(!passwordShown.konf_password_baru, 'passBaruConf')}} className={!passwordShown.konf_password_baru ? "fas fa-eye" : "fas fa-eye-slash"} />
																</div>
															</div>
														</div>
														<p className='errorMsg'>{errors.confpasswordbaru}</p>
													</div>
													<div className="modal-footer right-content-between">
														<button onClick={clearForm} className="btn btn-primary btn-sm align-right">Batal</button>
														<button onClick={(x) => {ubahProfile('katasandi')}} className="btn btn-primary btn-sm align-right">Ubah Kata Sandi</button>
													</div>
												</>
											</div>
											<div className="tab-pane" id="data-pribadi">
												<>
													<div className="form-group">
														<div className="input-group">
															<input type="email" className="form-control" name='email' placeholder="Email" autoComplete="off" value={!flag.flagEmail ? values.email : ubahData.email} disabled={!flag.flagEmail ? true : false} onChange={handleChange} />
															<div className="input-group-append">
																<div className="input-group-text">
																	<span onClick={() => {ubahKondisiData(!flag.flagEmail, 'email')}} className={!flag.flagEmail ? "fas fa-unlock" : "fas fa-lock"} />
																</div>
															</div>
														</div>
														{flag.flagEmail && <p className='errorMsg'>{errors.email}</p> }
													</div>
													<div className="form-group">
														<div className="input-group">
															<input type="text" className="form-control" name='telp' placeholder="Telepon" autoComplete="off" maxLength="15" value={!flag.flagTelepon ? values.telp : ubahData.telp} disabled={!flag.flagTelepon ? true : false} onChange={handleChange} />
															<div className="input-group-append">
																<div className="input-group-text">
																	<span onClick={() => {ubahKondisiData(!flag.flagTelepon, 'telepon')}} className={!flag.flagTelepon ? "fas fa-unlock" : "fas fa-lock"} />
																</div>
															</div>
														</div>
														{flag.flagTelepon && <p className='errorMsg'>{errors.telp}</p> }
													</div>
													<div className="form-group">
														<div className="input-group">
															<textarea className="form-control" rows="3" name='alamat' placeholder="Alamat" autoComplete="off" style={{resize: 'none'}} value={!flag.flagAlamat ? values.alamat : ubahData.alamat} disabled={!flag.flagAlamat ? true : false} onChange={handleChange} ></textarea>
															<div className="input-group-append">
																<div className="input-group-text">
																	<span onClick={() => {ubahKondisiData(!flag.flagAlamat, 'alamat')}} className={!flag.flagAlamat ? "fas fa-unlock" : "fas fa-lock"} />
																</div>
															</div>
														</div>
														{flag.flagAlamat && <p className='errorMsg'>{errors.alamat}</p> }
													</div>
													<div className="form-group">
														<div className="input-group-date">
															{!flag.flagProvinsi ?
																<input type="text" className="form-control" name="provinsi" autoComplete="off" value={Label.provinsi&&Label.provinsi.label} disabled onChange={handleChange} />
															:	
																<Select
																	placeholder='Pilih Provinsi'
																	className="select-control"
																	value={DataProvinsi}
																	onChange={(x) => {setDataProvinsi(x); getKabKota(x); setDataKabKota(null); setDataKecamatan(null); setDataKelurahan(null);}}
																	options={Provinsi}
																	isDisabled={!flag.flagProvinsi ? true : false}
																	isClearable
																/>
															}
															<div className="input-group-append">
																<div className="input-group-text">
																	<span onClick={() => {ubahKondisiData(!flag.flagProvinsi, 'provinsi'); flag.flagProvinsi && getData(); !flag.flagProvinsi && setDataProvinsi(null); setDataKabKota(null); setDataKecamatan(null); setDataKelurahan(null); }} className={!flag.flagProvinsi ? "fas fa-unlock" : "fas fa-lock"} />
																</div>
															</div>
														</div>
														{flag.flagProvinsi && <p className='errorMsg'>{errors.provinsi}</p> }
													</div>
													<div className="form-group">
														<div className="input-group-date">
														{!flag.flagProvinsi ?
																<input type="text" className="form-control" name="kabkota" autoComplete="off" value={Label.kabupatenkota&&Label.kabupatenkota.label} disabled onChange={handleChange} />
															:
																<Select
																	placeholder='Pilih Kabupaten / Kota'
																	className="select-control"
																	value={DataKabKota}
																	onChange={(x) => {setDataKabKota(x); getKecamatan(x); setDataKecamatan(null); setDataKelurahan(null);}}
																	options={KabupatenKota}
																	isDisabled={DataProvinsi ? isloading.load_kabkota : !DataProvinsi}
																	isLoading={isloading.load_kabkota}
																	isClearable
																/>
															}
														</div>
														{flag.flagProvinsi && <p className='errorMsg'>{errors.kabkota}</p> }
													</div>
													<div className="form-group">
														<div className="input-group-date">
														{!flag.flagProvinsi ?
																<input type="text" className="form-control" name="kecamatan" autoComplete="off" value={Label.kecamatan&&Label.kecamatan.label} disabled onChange={handleChange} />
															:
																<Select
																	placeholder='Pilih Kecamatan'
																	className="select-control"
																	value={DataKecamatan}
																	onChange={(x) => {setDataKecamatan(x); getKelurahan(x); setDataKelurahan(null);}}
																	options={Kecamatan}
																	isDisabled={DataKabKota ? isloading.load_kecamatan : !DataKabKota}
																	isLoading={isloading.load_kecamatan}
																	isClearable
																/>
															}
														</div>
														{flag.flagProvinsi && <p className='errorMsg'>{errors.kecamatan}</p> }
													</div>
													<div className="form-group">
														<div className="input-group-date">
														{!flag.flagProvinsi ?
																<input type="text" className="form-control" name="kelurahan" autoComplete="off" value={Label.kelurahan&&Label.kelurahan.label} disabled onChange={handleChange} />
															:
																<Select
																	placeholder='Pilih Kelurahan'
																	className="select-control"
																	value={DataKelurahan}
																	onChange={(x) => setDataKelurahan(x)}
																	options={Kelurahan}
																	isDisabled={DataKecamatan ? isloading.load_kelurahan : !DataKecamatan}
																	isLoading={isloading.load_kelurahan}
																	isClearable
																/>
															}
														</div>
														{flag.flagProvinsi && <p className='errorMsg'>{errors.kelurahan}</p> }
													</div>
													<div className="form-group">
														<label htmlFor="name">Kode Pos</label>
														<input type="text" className="form-control" name='kode_pos' placeholder="Kode Pos" autoComplete="off" defaultValue={Object.entries(Label).length > 0 && !flag.flagProvinsi ? values.kode_pos : DataKelurahan ? DataKelurahan.kode_pos : ''} disabled />
													</div>
													<div className="modal-footer right-content-between">
														<button onClick={clearForm} className="btn btn-primary btn-sm align-right">Batal</button>
														<button onClick={(x) => {ubahProfile('datapribadi')}} className="btn btn-primary btn-sm align-right">Ubah Data Pribadi</button>
													</div>
												</>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-4">
								<div className="card card-primary card-outline">
									<div className="card-body box-profile">
										<div className="text-center">
											<img className="profile-user-img img-fluid img-circle" src={gbr} alt="User profile picture" />
										</div>
										{flag.flagNama === true &&
											<div className="input-group mb-3" style={{marginTop: '10px'}}>
												<input type="text" className="form-control" name="namalengkap" placeholder="Nama Lengkap" autoComplete="off" value={ubahData.namalengkap} onChange={handleChange} />
												<div className="input-group-append">
													<div className="input-group-text">
														<i onClick={() => {ubahProfile('nama')}} className="fas fa-arrow-right text-muted" style={{cursor: 'pointer'}} />
													</div>
													<div className="input-group-text">
														<i onClick={() => {ubahKondisiData(false, 'nama')}} className="fas fa-times text-muted" title='Batal ' style={{cursor: 'pointer'}} />
													</div>
												</div>
											</div>
										}
										{flag.flagNama === false &&
											<h3 className="profile-username text-center">{values.name} <i onClick={() => {ubahKondisiData(true, 'nama')}} className="fas fa-pencil-alt" style={{cursor: 'pointer'}} /></h3>
										}
										<p className="text-muted text-center">{values.roleName}</p>
										{values.roleID !== 1 &&
											<ul className="list-group list-group-unbordered mb-3">
												<li className="list-group-item">
													<b>Pengikut</b> <a className="float-right">1,322</a>
												</li>
												<li className="list-group-item">
													<b>Mengikuti</b> <a className="float-right">543</a>
												</li>
												<li className="list-group-item">
													<b>Teman</b> <a className="float-right">13,287</a>
												</li>
											</ul>
										}
										<div className="form-group" style={values.codeLog === 1 ? {display: 'block'} : {display: 'none'}}>
											<div className="btn btn-default btn-file btn-block">
												<i className="fas fa-paperclip" /> Ubah Foto Profile
												<input type="file" id='file' accept='image/*' title={values.codeLog === 1 ? 'Ubah Foto Profile' : 'Tidak bisa ubah Foto Profile'} onChange={(e) => {uploadFile(e.target.files[0])}} />
												{/* <input type="file" id='file' accept='image/*' onChange={(e) => {setFiles({selectedFiles: e.target.files[0]})}} /> */}
											</div>
											<p className="help-block">Maksimal File. 5MB</p>
										</div>
										<a onClick={keluar} className="btn btn-primary btn-block"><b>Keluar</b></a>
									</div>
								</div>
								<div className="card card-primary card-outline">
									<div className="card-header">
										<h3 className="card-title">Tentang Saya</h3>
									</div>
									<div className="card-body">
										<strong><i className="fas fa-user-alt mr-1" /> Email</strong>
										<p className="text-muted">{values.email?values.email:'-'}</p>
										<hr />
										<strong><i className="fas fa-phone-alt mr-1" /> Telepon</strong>
										<p className="text-muted">{values.telp?values.telp:'-'}</p>
										<hr />
										<strong><i className="fas fa-calendar-alt mr-1" /> Tempat, Tanggal Lahir</strong>
										<p className="text-muted">{values.tempat?values.tempat:'-'}, {values.tgl_lahir?convertDate(values.tgl_lahir, 'tanggal'):'-'}</p>
										<hr />
										<strong><i className="fas fa-map-marker-alt mr-1" /> Alamat</strong>
										<p className="text-muted">
											{values.alamat&&values.alamat+', '}
											{Label.kelurahan&&Label.kelurahan.label+', '}
											{Label.kecamatan&&Label.kecamatan.label+', '}
											{Label.kabupatenkota&&Label.kabupatenkota.label+', '}
											{Label.provinsi&&Label.provinsi.label+', '}
											{values.kode_pos&&values.kode_pos}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default Profile
