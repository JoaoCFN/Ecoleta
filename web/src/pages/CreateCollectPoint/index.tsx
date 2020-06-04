import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import axios from "axios";

import "./style.css";
import logo from "../../assets/logo.svg";
import api from "../../services/api";

const CreateCollectPoint = () => {
	// SEMPRE QUE CRIAMOS UM ESTADO PARA UM ARRAY OU OBJETO, DEVEMOS INFORMAR MANUALMENTE INFORMAR O TIPO DA VAR

	// AS INTERFACES SERVEM PARA DIZER AO TS, QUAL É O TIPO DE FORMATO QUE A VAR TERÁ. NESTE EXEMPLO, DEFINIMOS O FORMATO DO ESTADO DE ITEMS.
	interface Item{
		id: number,
		title: string,
		image_url: string,
	}

	interface IBGE_UF_Response{
		sigla: string,
	}

	interface IGBE_City_Response {
		nome: string,
	}

	// ESTADOS
	const [items, setItems] = useState<Item[]>([]);
	const [ufs, setUfs] = useState<string[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [selectedUf, setselectedUf] = useState("0");

	// CHAMADA PARA BUSCAR OS ITEMS DA NOSSA API 
	useEffect(() => {
		api.get("/items")
		.then( reponse => setItems(reponse.data))
	}, []);

	// CHAMADA PARA BUSCAR ESTADOS DA API DO IBGE
	useEffect(() =>{
		axios.get<IBGE_UF_Response[]>
		("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
		.then(response => {
			const ufSiglas = response.data.map(uf => uf.sigla);
			setUfs(ufSiglas);
		})
	}, []);

	// CHAMADA PARA BUSCAR CIDADES A PARTIR DOS ESTADOS
	useEffect(() => {
		if(selectedUf === "0"){
			return
		}

		axios.get<IGBE_City_Response[]>
		(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
		.then(response => {
			const nomeCidade = response.data.map(city => city.nome);
			setCities(nomeCidade);
		})

	}, [selectedUf]);

	// FUNÇÃO QUE VERIFICA QUAL UF O USUÁRIO SELECIONOU
	function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
		const uf = event.target.value;
		setselectedUf(uf);
	}

	return (
		<div id="page-create-collect-point">
			<header>
				<img src={logo} alt="Ecoleta"/>

				<Link to="/">
				<FiArrowLeft />
				Voltar para a home
				</Link>
			</header>

			<form action="">
				<h1>Cadastro do <br/> ponto de coleta</h1>

				<fieldset>
					<legend>
						<h2>Dados</h2>
					</legend>

					<div className="field">
						<label htmlFor="name">Nome da entidade</label>
						<input 
						type="text"
						id="name"
						name="name"
						/>
					</div>

					<div className="field-group">
						<div className="field">
							<label htmlFor="email">Email</label>
							<input 
								type="email"
								id="email"
								name="email"
							/>
						</div>

						<div className="field">
							<label htmlFor="whatsapp">Whatsapp</label>
							<input 
								type="text"
								id="whatsapp"
								name="whatsapp"
							/>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Endereço</h2>
						<span>Selecione o endereço no mapa</span>
					</legend>

					{/* O mapa é integrado na aplicação usando a lib leaflet */}
					<Map center={[-12.2322944, -38.9578752]} zoom={14}>
						<TileLayer
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>

						<Marker position={[-12.2322944, -38.9578752]}/>
					</Map>

					<div className="field-group">
						<div className="field">
							<label htmlFor="email">Cidade</label>
							<select 
								name="city" 
								id="city"
							>
								<option value="0">
									Selecione uma cidade
								</option>
								{cities.map(city => (
									<option key={city} value={city}>
										{city}
									</option>
								))}
							</select>
						</div>

						<div className="field">
							<label htmlFor="whatsapp">Estado (UF)</label>
							<select 
								name="uf" 
								id="uf" 
								value={selectedUf} 
								onChange={handleSelectUF}
							>
								<option value="0">
									Selecione uma UF
								</option>
								{ufs.map(uf => (
									<option key={uf} value={uf}>
										{uf}
									</option>
								))}
							</select>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Ítens de coleta</h2>
						<span>Selecione um ou mais itens abaixo</span>
					</legend>

					<ul className="items-grid">
						{items.map(item => (
							<li key={item.id}>
								<img src={item.image_url} 
									 alt={item.title}
								/>
								<span>{item.title}</span>
							</li>
						))}
					</ul>
				</fieldset>

				<button type="submit">
					Cadastrar ponto de coleta	
				</button>

			</form>
		</div>
	);
}

export default CreateCollectPoint;
