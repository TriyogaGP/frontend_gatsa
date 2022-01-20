import React from 'react'

function Footer() {
	const d = new Date();
	let year = d.getFullYear();
	return (
		<>
			<footer className="main-footer">
				<strong>Copyright © {year} <a href="/dashboard">MTsS SIROJUL ATHFAL</a>. </strong>
				All rights reserved.
				<div className="float-right d-none d-sm-inline-block">
					<b>Version</b> 1.0.0
				</div>
			</footer>
		</>
	)
}

export default Footer

