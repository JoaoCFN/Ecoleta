import React, { useState, useEffect, ChangeEvent, FormEvent} from 'react';
import { Link, useHistory} from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import axios from "axios";
import { LeafletMouseEvent } from "leaflet";
import Swal from "sweetalert2";

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
	
	const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0]);

	const [formData, setformData] = useState({
		name: "",
		email: "",
		whatsapp: ""
	});

	const [selectedUf, setselectedUf] = useState("0");
	const [selectedCity, setselectedCity] = useState("0");
	const [selectedPositionMap, setselectedPositionMap] = useState<[number, number]>([0, 0]);
	const [selectedItems, setselectedItems] = useState<number[]>([]);
	
	// PERMITE NAVEGAR DE UM COMPONENTE PRA OUTRO SEM TER UM BOTÃO
	const history = useHistory();

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

	// CHAMADA PARA BUSCAR A LOCALIZAÇÃO ATUAL DO USUÁRIO
	useEffect(() =>{
		// API DO PRÓPRIO NAVEGADOR
		// RETORNA A POSIÇÃO INICIAL DO USUÁRIO ASSIM QUE ELE ABRIR A APLICAÇÃO
		navigator.geolocation.getCurrentPosition(position => {
			const { latitude, longitude } = position.coords;
			setinitialPosition([latitude, longitude])
		})
	}, []);


	// FUNÇÃO QUE VERIFICA QUAL UF O USUÁRIO SELECIONOU
	function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
		const uf = event.target.value;
		setselectedUf(uf);
	}
	// FUNÇÃO QUE VERIFICA QUAL CIDADE O USUÁRIO SELECIONOU
	function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
		const city = event.target.value;
		setselectedCity(city);
	}
	// FUNÇÃO QUE VERIFICA O CLICK DO USUÁRIO NO MAPA
	function handleMapClick(event: LeafletMouseEvent){
		setselectedPositionMap([event.latlng.lat, event.latlng.lng])
	}

	// FUNÇÃO QUE VERIFICA O CLICK DO USUÁRIO NO MAPA
	function handleInputChange(event: ChangeEvent<HTMLInputElement>){
		const { name, value } = event.target;

		// USAMOS O SPREAD OPERATOR PARA NÃO PERDER AS INFORMAÇÕES DOS CAMPO ANTERIORES
		// USAMOS A ESTRATÉGIA DO NAME E DO VALUE PARA SUBSTITUIR APENAS O CAMPO QUE ESTÁ SENDO ALTERADO NO MOMENTO PELO USUÁRIO
		setformData({ ...formData, [name]: value})
	}

	// FUNÇÃO QUE VERIFICA O ITEM ESCOLHIDO PELO USUÁRIO PARA SER COLETADO
	function handleSelectItem(id: number){
		// FINDINDEX: RETORNA UM NÚMERO ACIMA OU IGUAL A 0, SE O ITEM JÁ ESTIVER NO ARRAY
		const alrerySelected = selectedItems.findIndex(item => item === id);
		// SE O ITEM JÁ ESTIVER NO ARRAY ELE BUSCA E FAZ UM NOVO ARRAY SEM O MESMO
		if(alrerySelected > -1){
			const filteredItems = selectedItems.filter(item => item !== id);
			setselectedItems(filteredItems);
		}	
		else{
			setselectedItems([...selectedItems, id]);
		}
	}

	// FUNÇÃO QUE ENVIA O FORM
	async function handleSubmit(event: FormEvent){
		event.preventDefault();

		const { name, email, whatsapp} = formData;
		const uf = selectedUf;
		const city = selectedCity;
		const [latitude, longitude] = selectedPositionMap;
		const items = selectedItems

		const data = {
			name, 
            email,
            whatsapp, 
            latitude,
            longitude,
            city, 
            uf, 
            items
		}

		// await api.post("collect_points", data);
		Swal.fire({
			title: "Cadastro concluído!",
			icon: "success",
			showConfirmButton: false,
			timer: 3000
		})
		
		// MANDA O USUÁRIO PRA HOME
		setTimeout(() => {
			history.push("/")
		}, 3000)
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

			<form action="" onSubmit={handleSubmit}>
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
						onChange={handleInputChange}
						/>
					</div>

					<div className="field-group">
						<div className="field">
							<label htmlFor="email">Email</label>
							<input 
								type="email"
								id="email"
								name="email"
								onChange={handleInputChange}
							/>
						</div>

						<div className="field">
							<label htmlFor="whatsapp">Whatsapp</label>
							<input 
								type="text"
								id="whatsapp"
								name="whatsapp"
								onChange={handleInputChange}
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
					<Map 
						center={initialPosition} 
						zoom={14} 
						onClick={handleMapClick}
					>
						<TileLayer
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>

						<Marker position={selectedPositionMap}/>
					</Map>

					<div className="field-group">
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

						<div className="field">
							<label htmlFor="email">Cidade</label>
							<select 
								name="city" 
								id="city"
								value={selectedCity}
								onChange={handleSelectCity}
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
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Ítens de coleta</h2>
						<span>Selecione um ou mais itens abaixo</span>
					</legend>

					<ul className="items-grid">
						{items.map(item => (
							<li 
								key={item.id} 
								onClick={() => handleSelectItem(item.id)}
								className={
									// VERIFICA SE O ITEM SELECIONADO JÁ ESTÁ NO ARRAY E SE ESTIVER ADICIONA A CLASSE SELECTED A LI
									selectedItems.includes(item.id) ? "selected": ""
								}
							>
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
